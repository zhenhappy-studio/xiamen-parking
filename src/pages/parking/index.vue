<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import axios from '@/axios'
import type { ParkingDetail } from '@/types/api'

let parking = $ref<ParkingDetail | null>(null)
let richTextNodes = $ref('')

// 处理富文本内容
function processRichText(content: string) {
  return content
    // 处理段落
    .replace(/<p/g, '<p class="rich-text-p"')
    // 处理图片
    .replace(/<img/g, '<img class="rich-text-img"')
}

onLoad(async (query) => {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
  })

  const id = query?.id as string
  if (!id) {
    uni.showToast({
      title: '参数错误',
      icon: 'error',
    })
    return
  }

  try {
    parking = await axios.get<ParkingDetail>(`/parking/${id}`)
    // 处理富文本内容
    richTextNodes = processRichText(parking.content)
  }
  catch {
    uni.showToast({
      title: '获取停车场详情失败',
      icon: 'error',
    })
  }
})

// 小程序分享
onShareAppMessage(() => {
  return parking
    ? {
        title: parking.name,
        path: `/pages/parking/index?id=${parking.id}`,
        imageUrl: '/static/img/share.png',
      }
    : {
        title: '鹭岛停车',
        path: '/pages/index/index',
        imageUrl: '/static/img/share.png',
      }
})
</script>

<template>
  <view>
    <view v-if="parking" class="px-32rpx pb-68rpx pt-24rpx">
      <!-- Parking Title -->
      <view class="mb-48rpx text-48rpx font-semibold">
        {{ parking.name }}
      </view>

      <!-- Pricing Card -->
      <view class="overflow-hidden rounded-20rpx bg-white">
        <!-- Header -->
        <view class="h-80rpx flex items-center justify-between bg-#00AEF4 px-32rpx text-white">
          <text class="text-32rpx">
            计费标准
          </text>
          <text class="text-26rpx">
            数据更新时间：{{ dayjs(parking.updatedAt).format('YYYY.MM.DD') }}
          </text>
        </view>

        <!-- Pricing Table -->
        <view class="bg-#E7F7FE px-48rpx py-36rpx">
          <view class="flex flex-col gap-32rpx">
            <view
              v-for="(row, index) in parking.table"
              :key="index"
              class="h-66rpx flex justify-between border-b-2rpx border-white border-b-solid pb-22rpx text-32rpx font-medium last:border-b-0"
            >
              <view class="w-50% text-left">
                {{ row[0] }}
              </view>
              <view class="w-50% text-right">
                {{ row[1] }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Parking Info -->
      <view class="mt-48rpx p-32rpx">
        <rich-text
          class="rich-text"
          :nodes="richTextNodes"
          :selectable="true"
          :preview-img="true"
          :show-menu-by-longpress="true"
        />
      </view>

      <!-- Action Button -->
      <view class="mx-auto mt-48rpx h-96rpx w-686rpx flex-center rounded-full bg-#00AEF4 py-24rpx text-36rpx text-white font-semibold">
        去停车
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.rich-text {
  :deep(.rich-text-img) {
    max-width: 100%;
  }
}
</style>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "停车场详情",
    "navigationBarTextStyle": "black"
  }
}
</route>
