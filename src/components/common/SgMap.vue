<template>
  <div class="sg-map-container">
    <div id="sgMap" class="map-container"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMapInit } from '@/composables/useMap/useMapInit'
import { provideMap } from '@/composables/useMap/useMapContext'

const props = defineProps({
  mapconfig: {
    type: Object,
    required: true,
    default: () => {
      return {
        srcSdk: 'https://map.sgcc.com.cn/maps?v=3.0.0',
        appkey: '4b9985a37eef391f9ff32c696819f605',
        appsecret: 'ee7b92c92455300896b732377a662077',
        style: 'aegis://styles/aegis/Streets-v2',
        zoom: 9,
        center: [116.397478, 39.903179],
      }
    },
  },
  containerId: {
    type: String,
    default: 'sgMap',
  },
  mapKey: {
    type: [String, Symbol],
    default: 'map',
  },
})

const emit = defineEmits(['load'])

const mapInstance = shallowRef(null)
const isLoaded = ref(false)

// expose 给父组件使用
defineExpose({
  mapInstance,
  isLoaded,
})

const handleResize = () => {
  if (mapInstance.value?.value && typeof mapInstance.value.value.resize === 'function') {
    mapInstance.value.value.resize()
    console.log('地图画布已重新调整大小')
  }
}

const loadMapSDK = () => {
  if (window.SGMap) {
    initMap()
    return
  }

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = props.mapconfig.srcSdk
  script.onload = () => {
    console.log('地图 SDK 加载完成')
    initMap()
  }
  script.onerror = () => {
    console.log('地图 SDK 加载失败')
  }
  document.head.appendChild(script)
}

const initMap = () => {
  console.log('开始初始化地图', props.mapconfig)
  const mapState = useMapInit(props.containerId, props.mapconfig, (map) => {
    console.log('sgMap 初始化实例===>', map)
    mapInstance.value = map
    isLoaded.value = true
    emit('load', map.value)
  })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadMapSDK()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.sg-map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}
</style>
