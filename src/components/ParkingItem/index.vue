<script lang="ts" setup>
import type { Parking } from '@/types/api'

const { parking } = defineProps<{
  parking: Parking
}>()

function handleClick(id: number) {
  uni.navigateTo({
    url: `/pages/parking/index?id=${id}`,
  })
}
</script>

<template>
  <view
    class="bg-white p-20rpx"
    @tap="handleClick(parking.id)"
  >
    <view class="flex justify-between gap-22rpx">
      <image class="h-136rpx w-176rpx" src="./img/avatar.png" />
      <view class="h-150rpx flex-1 border-b-2rpx border-b-#EEEEEE border-b-solid">
        <view class="h-136rpx flex items-center justify-between">
          <view class="flex flex-col justify-center">
            <view class="text-32rpx text-#333333 font-semibold">
              {{ parking.name }}
            </view>
            <view class="flex items-center gap-12rpx text-24rpx text-#555555">
              <view>距此995米</view>
              <view class="h-20rpx w-2rpx rounded-2rpx bg-#D8D8D8"></view>
              <view>30分钟免费</view>
            </view>
            <view class="flex items-center gap-8rpx text-24rpx text-#333333">
              <image class="h-32rpx w-32rpx" src="./img/subsurface.png" />
              地下停车场
            </view>
          </view>
          <view class="flex flex-col items-center gap-16rpx text-24rpx text-#00AEF4">
            <image class="h-48rpx w-48rpx" src="./img/map.png" />
            去停车
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
