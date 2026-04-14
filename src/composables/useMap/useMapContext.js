import { inject, provide, shallowRef, ref } from 'vue'

// 缓存生成的 Symbol key
const mapKeyCache = new Map()

// 生成唯一的 Symbol key，相同的字符串 key 返回同一个 Symbol
const createMapKey = (key = 'map') => {
  if (mapKeyCache.has(key)) {
    return mapKeyCache.get(key)
  }
  const symbolKey = Symbol(`map-${key}`)
  mapKeyCache.set(key, symbolKey)
  return symbolKey
}

/**
 * 提供地图实例
 * @param {Object} options - 地图相关选项
 * @param {Ref} options.mapInstance - 地图实例 ref
 * @param {Ref} options.isLoaded - 地图是否加载完成 ref
 * @param {string|Symbol} [key='map'] - 可选的自定义 key，用于多地图场景
 */
export function provideMap(options, key = 'map') {
  const mapKey = typeof key === 'symbol' ? key : createMapKey(key)
  console.log('provideMap', mapKey);

  provide(mapKey, options)
}

/**
 * 使用地图实例
 * @param {string|Symbol} [key='map'] - 可选的自定义 key，用于多地图场景
 * @param {Object} [options] - 配置选项
 * @param {boolean} [options.silent=false] - 是否静默模式，不显示警告
 * @returns {Object} 地图相关状态
 * @returns {Ref} mapInstance - 地图实例 ref
 * @returns {Ref} isLoaded - 地图是否加载完成 ref
 */
export function useMap(key = 'map', options = {}) {
  const { silent = false } = options
  const mapKey = typeof key === 'symbol' ? key : createMapKey(key)
  const mapContext = inject(mapKey, null)
  console.log('useMap-mapContext', mapKey, mapContext);

  if (!mapContext) {
    if (!silent) {
      console.warn(`useMap() 未找到地图上下文 (key: ${String(key)})`);
    }
    return {
      mapInstance: shallowRef(null),
      isLoaded: ref(false)
    }
  }

  return mapContext
}
