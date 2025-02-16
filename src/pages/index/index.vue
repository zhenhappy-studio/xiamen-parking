<script lang="ts" setup>
import axios from '@/axios'
import type { Parking } from '@/types/api'
import StatusBar from '@/components/StatusBar/index.vue'
import ParkingItem from '@/components/ParkingItem/index.vue'

let parkingList = $ref<Parking[]>([])

onLoad(async () => {
  uni.onNetworkStatusChange(async (res) => {
    if (res.isConnected)
      await getData()
  })
  await getData()
})

async function getData() {
  try {
    parkingList = await axios.get<Parking[]>('/parking')
  }
  catch {
    uni.showToast({
      title: '停车场信息加载失败',
      icon: 'error',
    })
  }
}

async function handleParkingClick(id: number) {
  uni.navigateTo({
    url: `/pages/parking/detail?id=${id}`,
  })
}
</script>

<template>
  <div>
    <div class="rounded-br-40rpx from-#F5FCFF to-#E8F7FE bg-gradient-to-b pb-36rpx">
      <StatusBar />
      <div class="mt-10rpx h-60rpx flex items-center gap-12rpx px-32rpx">
        <img class="h-40rpx" src="./img/title.png" mode="heightFix" />
        <img class="h-42rpx" src="./img/subhead.png" mode="heightFix" />
      </div>
      <swiper class="mt-36rpx h-212rpx" :circular="true">
        <swiper-item class="flex-center">
          <img
            class="h-212rpx w-686rpx"
            src="./img/banner.png"
            mode="scaleToFill"
          />
        </swiper-item>
      </swiper>
    </div>
    <div class="bg-#E8F7FE">
      <div class="rounded-tl-40rpx bg-white px-30rpx py-50rpx">
        <div class="flex justify-between">
          <div
            class="h-64rpx flex items-center gap-10rpx text-32rpx text-#333333 font-semibold"
          >
            <div class="h-32rpx w-8rpx rounded-4rpx bg-#599AFA" />
            快捷停车
          </div>
          <div
            class="h-64rpx w-168rpx flex-center gap-20rpx rounded-32rpx bg-#F7F7F7 text-#999999"
          >
            <img class="h-48rpx w-48rpx" src="./img/ic-search.png" />搜索
          </div>
        </div>
        <div class="my-46rpx flex flex-col gap-32rpx">
          <ParkingItem
            v-for="parking in parkingList"
            :key="parking.id"
            :parking="parking"
            @click="handleParkingClick(parking.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<!-- 使用 type="home" 属性设置首页 -->
<route type="home" lang="json">
{
  "layout": "default",
  "style": {
    "navigationBarTextStyle": "black"
  }
}
</route>
