<script lang="ts" setup>
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import axios from '@/axios'
import type { Parking, ParkingResponse } from '@/types/api'
import ParkingItem from '@/components/ParkingItem/index.vue'

const keyword = $ref('')
let parkingList = $ref<Parking[]>([])
let page = $ref(1)
let hasMore = $ref(true)
let loading = $ref(false)

const status = $computed(() => {
  if (loading)
    return 'loading'
  if (!hasMore)
    return 'noMore'
  return 'more'
})

async function handleSearch() {
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
    const data = res as unknown as ParkingResponse
    parkingList = data.results
    hasMore = page < data.totalPages
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

// 添加下拉刷新处理
onPullDownRefresh(async () => {
  if (!keyword)
    return
  page = 1
  await handleSearch()
  uni.stopPullDownRefresh()
})

function handleParkingClick(id: number) {
  uni.navigateTo({
    url: `/pages/parking/detail?id=${id}`,
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<template>
  <div class="min-h-screen bg-#F5F5F5">
    <!-- Search Bar -->
    <div class="bg-white px-32rpx py-24rpx">
      <div class="flex items-center gap-24rpx">
        <div class="flex flex-1 items-center gap-16rpx rounded-full bg-#F7F7F7 px-32rpx py-16rpx">
          <!-- <img class="h-40rpx w-40rpx" src="@/static/img/ic-search.png" /> -->
          <input
            v-model="keyword"
            class="flex-1 bg-transparent text-28rpx"
            placeholder="搜索停车场"
            @confirm="handleSearch"
          />
        </div>
        <button
          class="text-28rpx text-#666"
          @click="handleBack"
        >
          取消
        </button>
      </div>
    </div>
    <!-- Results -->

    <div class="flex-1 px-32rpx py-32rpx">
      <div v-if="parkingList.length" class="flex flex-col gap-32rpx">
        <ParkingItem
          v-for="parking in parkingList"
          :key="parking.id"
          :parking="parking"
          @click="handleParkingClick(parking.id)"
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
      </div>
      <div
        v-else-if="keyword && !loading"
        class="mt-200rpx flex-center flex-col gap-32rpx text-#999"
      >
        <div class="text-28rpx">
          未找到相关停车场
        </div>
      </div>
      <div
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
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "style": {
    "navigationStyle": "custom",
    "navigationBarTextStyle": "black",
    "onReachBottomDistance": 50,
    "enablePullDownRefresh": true
  }
}
</route>
