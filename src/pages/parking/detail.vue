<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import axios from '@/axios'
import type { Parking } from '@/types/api'

interface ParkingDetail extends Parking {
  availableSpaces: number
  totalSpaces: number
  price: number
  content: string // 富文本内容
  table: string[][] // 价格表格数据
  updatedAt: Date
}

let parking = $ref<ParkingDetail | null>(null)

onLoad(async (query) => {
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
  }
  catch {
    uni.showToast({
      title: '获取停车场详情失败',
      icon: 'error',
    })
  }
})
</script>

<template>
  <div v-if="parking" class="min-h-screen bg-gray-100">
    <!-- Main Content -->
    <div class="px-32rpx py-48rpx">
      <h2 class="mb-48rpx text-48rpx font-semibold">
        {{ parking.name }}
      </h2>

      <!-- Pricing Card -->
      <div class="overflow-hidden rounded-20rpx bg-white">
        <!-- Header -->
        <div class="flex items-center justify-between bg-[#00A0E9] px-32rpx py-24rpx text-white">
          <span class="text-36rpx">计费标准</span>
          <span class="text-28rpx">数据更新时间：{{ dayjs(parking.updatedAt).format('YYYY.MM.DD') }}</span>
        </div>

        <!-- Pricing Table -->
        <div class="bg-[#E8F6FC] p-32rpx">
          <table class="w-full">
            <tbody>
              <tr
                v-for="(row, index) in parking.table"
                :key="index"
                class="border-b border-gray-200 last:border-b-0"
              >
                <td class="py-16rpx text-32rpx">
                  {{ row[0] }}
                </td>
                <td class="py-16rpx text-right text-32rpx">
                  {{ row[1] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Parking Info -->
      <div class="mt-48rpx p-32rpx">
        <div
          class="rich-text text-28rpx text-#666"
          v-html="parking.content"
        />
      </div>

      <!-- Action Button -->
      <div class="fixed bottom-48rpx left-32rpx right-32rpx">
        <button class="w-full rounded-16rpx bg-[#00A0E9] py-24rpx text-36rpx text-white">
          去停车
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rich-text :deep(p) {
  margin-bottom: 16rpx;
  line-height: 1.6;
}

.rich-text :deep(p:last-child) {
  margin-bottom: 0;
}

/* 添加图片样式 */
.rich-text :deep(img) {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
  border-radius: 8rpx;
}

.rich-text :deep(p:has(img)) {
  text-align: center;
  margin: 32rpx 0;
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
