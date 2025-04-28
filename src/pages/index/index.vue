<script lang="ts" setup>
import { onLoad, onPullDownRefresh, onReachBottom, onShareAppMessage } from '@dcloudio/uni-app'
import axios from '@/axios'
import type { Parking, ParkingResponse } from '@/types/api'
import ParkingItem from '@/components/ParkingItem/index.vue'

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

onLoad(async () => {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
  })

  uni.onNetworkStatusChange(async (res) => {
    if (res.isConnected)
      await getData()
  })
  await getData()
})

async function getData() {
  if (loading || (!hasMore && page > 1))
    return
  loading = true
  try {
    const res = await axios.get<ParkingResponse>('/parking', {
      params: { page },
    })

    if (page === 1)
      parkingList = res.results
    else
      parkingList = [...parkingList, ...res.results]

    hasMore = page < res.totalPages
  }
  catch {
    uni.showToast({
      title: '停车场信息加载失败',
      icon: 'error',
    })
  }
  finally {
    loading = false
  }
}

// 添加触底加载更多
onReachBottom(() => {
  if (!hasMore || loading)
    return
  page++
  getData()
})

// 添加下拉刷新处理
onPullDownRefresh(async () => {
  page = 1
  await getData()
  uni.stopPullDownRefresh()
})

function handleSearchClick() {
  uni.navigateTo({
    url: '/pages/search/index',
  })
}

// 小程序分享
onShareAppMessage(() => {
  return {
    title: '鹭岛停车',
    path: '/pages/index/index',
    imageUrl: '/static/img/share.png',
  }
})
</script>

<template>
  <view class="min-h-screen">
    <uni-nav-bar status-bar :fixed="true" :border="false" :height="0" />
    <view class="rounded-br-40rpx from-#F5FCFF to-#E8F7FE bg-gradient-to-b pb-36rpx">
      <view class="h-88rpx flex items-center gap-12rpx px-32rpx">
        <image class="h-40rpx" src="./img/title.png" mode="heightFix" />
        <image class="h-42rpx" src="./img/subhead.png" mode="heightFix" />
      </view>
      <swiper class="mt-36rpx h-212rpx" :circular="true">
        <swiper-item class="flex-center">
          <image
            class="h-212rpx w-686rpx"
            src="./img/banner.png"
            mode="scaleToFill"
          />
        </swiper-item>
      </swiper>
    </view>
    <view class="bg-#E8F7FE">
      <view class="rounded-tl-40rpx bg-white px-30rpx py-50rpx">
        <view class="mb-32rpx flex justify-between">
          <view
            class="h-64rpx flex items-center gap-10rpx text-32rpx text-#333333 font-semibold"
          >
            <view class="h-32rpx w-8rpx rounded-4rpx bg-#599AFA" />
            快捷停车
          </view>
          <view
            class="h-64rpx w-188rpx flex-center gap-20rpx rounded-32rpx bg-#F7F7F7 text-#999999"
            @tap="handleSearchClick"
          >
            <image class="h-48rpx w-48rpx" src="/static/img/search.png" />搜索
          </view>
        </view>
        <ParkingItem
          v-for="parking in parkingList"
          :key="parking.id"
          :parking="parking"
        />
        <uni-load-more
          v-if="parkingList.length > 0"
          :status="status"
          :content-text="{
            contentdown: '上拉加载更多',
            contentrefresh: '加载中...',
            contentnomore: '没有更多数据了',
          }"
          @click-load-more="getData"
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>

<!-- 使用 type="home" 属性设置首页 -->
<route type="home" lang="json">
{
  "style": {
    "navigationStyle": "custom",
    "enablePullDownRefresh": true,
    "onReachBottomDistance": 150
  }
}
</route>
