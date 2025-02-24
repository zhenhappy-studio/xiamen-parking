<script lang="ts" setup>
import { onReachBottom } from '@dcloudio/uni-app'
import axios from '@/axios'
import type { Parking, ParkingResponse } from '@/types/api'
import ParkingItem from '@/components/ParkingItem/index.vue'

const HISTORY_KEY = 'search_history'
let keyword = $ref('')
let parkingList = $ref<Parking[]>([])
let searchHistory = $ref<string[]>([])
let page = $ref(1)
let hasMore = $ref(true)
let loading = $ref(false)

// 初始化时获取历史记录
searchHistory = uni.getStorageSync(HISTORY_KEY) || []

// 保存搜索历史
function saveHistory(kw: string) {
  if (!kw.trim())
    return
  // 删除已存在的相同关键词
  const index = searchHistory.indexOf(kw)
  if (index > -1)
    searchHistory.splice(index, 1)
  // 添加到开头
  searchHistory.unshift(kw)
  // 最多保存5条
  searchHistory = searchHistory.slice(0, 5)
  // 保存到本地存储
  uni.setStorageSync(HISTORY_KEY, searchHistory)
}

// 清空历史记录
function clearHistory() {
  searchHistory = []
  uni.removeStorageSync(HISTORY_KEY)
}

// 点击历史记录
function handleHistoryClick(kw: string) {
  keyword = kw
  handleSearch()
}

// 删除单个历史记录
function deleteHistory(index: number) {
  searchHistory.splice(index, 1)
  uni.setStorageSync(HISTORY_KEY, searchHistory)
}

const status = $computed(() => {
  if (loading)
    return 'loading'
  if (!hasMore)
    return 'noMore'
  return 'more'
})
async function handleSearch() {
  if (!keyword.trim()) {
    parkingList = [] // 清空搜索结果
    return
  }
  if (loading)
    return
  loading = true
  page = 1
  try {
    const res = await axios.get<ParkingResponse>('/parking', {
      params: {
        keyword,
        page,
      },
    })
    parkingList = res.results
    hasMore = page < res.totalPages
    // 保存搜索历史
    saveHistory(keyword)
  }
  catch {
    uni.showToast({
      title: '搜索失败',
      icon: 'error',
    })
  }
  finally {
    loading = false
  }
}

async function loadMore() {
  if (loading || !hasMore)
    return
  loading = true
  page++
  try {
    const res = await axios.get<ParkingResponse>('/parking', {
      params: {
        keyword,
        page,
      },
    })
    parkingList = [...parkingList, ...res.results]
    hasMore = page < res.totalPages
  }
  catch {
    page--
    uni.showToast({
      title: '加载失败',
      icon: 'error',
    })
  }
  finally {
    loading = false
  }
}

// 添加触底加载更多
onReachBottom(loadMore)
</script>

<template>
  <view class="min-h-screen">
    <!-- Search Bar -->
    <view class="h-120rpx flex-center px-16rpx py-24rpx">
      <view class="flex flex-1 items-center gap-16rpx rounded-full bg-#F7F7F7 p-4rpx pl-24rpx">
        <image class="h-40rpx w-40rpx" src="/static/img/search.png" />
        <input
          v-model="keyword"
          class="flex-1 bg-transparent text-28rpx"
          placeholder="搜索停车场"
          @confirm="handleSearch"
        />
        <view class="h-64rpx w-136rpx flex-center rounded-full bg-#00AEF4 text-28rpx text-white" @tap="handleSearch">
          搜索
        </view>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="mb-20rpx px-32rpx">
      <view class="h-80rpx flex items-center justify-between">
        <text class="text-32rpx font-bold">
          历史记录
        </text>
        <view
          v-if="searchHistory.length"
          class="h-80rpx w-80rpx flex-center"
          @tap="clearHistory"
        >
          <image class="h-30rpx w-30rpx" src="/static/img/trash.png" />
        </view>
      </view>
      <view class="flex flex-wrap gap-24rpx">
        <view
          v-for="(item, index) in searchHistory"
          :key="index"
          class="max-w-200rpx overflow-hidden text-ellipsis whitespace-nowrap rounded-8rpx bg-#F7F7F7 px-24rpx py-12rpx text-24rpx text-#666666"
          @tap="handleHistoryClick(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>

    <!-- Results -->
    <view class="flex-1 px-32rpx py-32rpx">
      <view v-if="parkingList.length" class="flex flex-col gap-32rpx">
        <ParkingItem
          v-for="parking in parkingList"
          :key="parking.id"
          :parking="parking"
        />
        <uni-load-more
          :status="status"
          :content-text="{
            contentdown: '上拉加载更多',
            contentrefresh: '加载中...',
            contentnomore: '没有更多数据了',
          }"
          @click-load-more="loadMore"
        />
      </view>
      <view
        v-else-if="keyword && !loading"
        class="mt-200rpx flex-center flex-col gap-32rpx text-#999"
      >
        <view class="text-28rpx">
          未找到相关停车场
        </view>
      </view>
      <view
        v-else-if="loading && !parkingList.length"
        class="mt-200rpx flex-center flex-col gap-32rpx"
      >
        <uni-load-more
          status="loading"
          :content-text="{
            contentdown: '上拉加载更多',
            contentrefresh: '加载中...',
            contentnomore: '没有更多数据了',
          }"
        />
      </view>
    </view>
  </view>
</template>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "搜索",
    "navigationBarTextStyle": "black",
    "onReachBottomDistance": 150,
    "enablePullDownRefresh": false
  }
}
</route>
