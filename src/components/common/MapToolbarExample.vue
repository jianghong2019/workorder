<template>
  <div class="map-toolbar">
    <h3>地图工具栏示例</h3>

    <div class="button-group">
      <el-button type="primary" @click="zoomIn" :disabled="!isLoaded"> 放大 </el-button>

      <el-button type="primary" @click="zoomOut" :disabled="!isLoaded"> 缩小 </el-button>

      <el-button @click="fitToBounds" :disabled="!isLoaded"> 自适应视野 </el-button>
    </div>

    <div class="map-info" v-if="isLoaded">
      <p><strong>当前缩放级别:</strong> {{ currentZoom }}</p>
      <p><strong>地图中心:</strong> {{ currentCenter }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useMap } from '@/composables/useMap/useMapContext'
import { useMapTools } from '@/composables/useMap/useMapTools'

// 使用 inject 获取地图实例
const { mapInstance, isLoaded } = useMap('normal-map')

// 使用地图工具
const { fitBounds } = useMapTools(mapInstance)

// 计算属性 - 获取当前缩放级别
const currentZoom = computed(() => {
  if (!mapInstance?.value) return '-'
  return mapInstance.value.getZoom().toFixed(2)
})

// 计算属性 - 获取当前中心点
const currentCenter = computed(() => {
  if (!mapInstance?.value) return '-'
  const center = mapInstance.value.getCenter()
  return `${center.lng.toFixed(4)}, ${center.lat.toFixed(4)}`
})

// 方法 - 放大
const zoomIn = () => {
  if (!mapInstance?.value) return
  mapInstance.value.zoomIn()
}

// 方法 - 缩小
const zoomOut = () => {
  if (!mapInstance?.value) return
  mapInstance.value.zoomOut()
}

// 方法 - 自适应视野（示例）
const fitToBounds = () => {
  // 示例：一个简单的边界
  const features = [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [116, 39] } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [117, 40] } },
  ]
  fitBounds(features)
}
watch(isLoaded, (loaded) => {
  console.log(loaded, '可以操作')
})
</script>

<style lang="scss" scoped>
.map-toolbar {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;

  h3 {
    margin: 0 0 16px 0;
    color: #303133;
  }

  .button-group {
    margin-bottom: 16px;
    display: flex;
    gap: 8px;
  }

  .map-info {
    padding: 12px;
    background: #fff;
    border-radius: 4px;

    p {
      margin: 8px 0;
      color: #606266;
    }
  }
}
</style>
