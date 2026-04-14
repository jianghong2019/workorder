<template>
  <div class="visual-container">
    <!-- 方式一：工具栏作为 SgMap 的子组件（推荐） -->
    <!-- <SgMap
      :mapconfig="mapConfig"
      container-id="sgMap"
      @load="handleMapLoad"
    >
      <div class="toolbar-wrapper">
        <MapToolbarExample />
      </div>
    </SgMap> -->

    <!-- 方式二：父组件在上层 provide，所有子组件都能获取 -->
    <div class="toolbar-wrapper">
      <MapToolbarExample />
    </div>
    <div id="mapView" class="map-wrapper">
      <SgMap :mapconfig="mapConfig" container-id="sgMap" @load="handleMapLoad" />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import SgMap from '@/components/common/SgMap.vue'
import MapToolbarExample from '@/components/common/MapToolbarExample.vue'
import { provideMap } from '@/composables/useMap/useMapContext'

const mapInstance = shallowRef(null)
const isLoaded = ref(false)

// 在上层 provide 地图实例，这样所有子组件都能通过 useMap() 获取
provideMap({
  mapInstance,
  isLoaded,
},'normal-map')

const mapConfig = {
  srcSdk: 'https://map.sgcc.com.cn/maps?v=3.0.0',
  appkey: '4b9985a37eef391f9ff32c696819f605',
  appsecret: 'ee7b92c92455300896b732377a662077',
  style: 'aegis://styles/aegis/Streets-v2',
  zoom: 9,
  center: [116.397478, 39.903179],
}

const handleMapLoad = (map) => {
  console.log('地图加载完成', map)
  mapInstance.value = map
  isLoaded.value = true
}
</script>

<style lang="scss" scoped>
.visual-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.toolbar-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  width: 300px;
}

.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
