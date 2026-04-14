import { renderDynamicComponent } from '@/utils/renderDynamicComponent'
import { sgMapInstance } from './useMapInit'
import { watch, toValue } from 'vue-demi';
/**
 * 在地图上渲染自定义 Vue 组件 popup
 * @param {Object} Component - Vue组件引用
 * @param {Object} lngLat - 经纬度对象，如 {lng: 120, lat: 30}
 * @param {Array} offset - popup偏移量，默认为[0,0]
 * @param {Object} props - 传递给组件的props
 * @returns {Object} - popup实例、组件实例、移除popup并卸载组件方法、更新popup中组件方法
 * @returns {Object} - { popup, componentInstance, remove, update }
 * @example
 * import nullData from '@/components/nullData.vue'
 * useRenderPopup(nullData, { lng: 120, lat: 30 }, [0, 0], { name: 'test' })
 *
 */
export function useRenderPopup(Component, lngLat, offset={ 'bottom-left': [0,0] }, props = {}) {
  // 创建popup
  const popupDOM = new SGMap.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'bottom-left',
    offset,
  })

  // 创建容器
  const container = document.createElement('div')
  container.className = 'popup-render-root'

  // 设置popup内容、位置
  popupDOM.setLngLat(lngLat.value).setDOMContent(container).addTo(sgMapInstance.value)
  // 获取异步组件
  let instance = renderDynamicComponent(Component, props, container)
  // popupDOM.on('open', function (e) {
  //   console.log('popupDOM打开', e)

  //   // 渲染Vue组件
  //   instance = renderDynamicComponent(Component, props, container)
  // })
  // 监听popup关闭，自动卸载组件
  popupDOM.on('close', function () {
    instance && instance.unmount && instance.unmount()
  })
  watch(lngLat, (newVal) => {
    console.log(newVal,popupDOM);
    popupDOM.setLngLat(newVal)._update()
  })
  // 传入新的组件引用，渲染新组件
  const renderInstance = (Component,props) =>{
    instance && instance.unmount && instance.unmount()
    console.log(container.childNodes);
    container.childNodes?.forEach(node=>{
      console.log(node);
      node?.remove()
    })
    instance = renderDynamicComponent(Component, props, container)
  }
  return {
    popup: popupDOM, //popup实例
    componentInstance: instance, //popup中vue组件实例
    //移除popup并卸载组件
    remove() {
      popupDOM.remove()
      instance && instance.unmount && instance.unmount()
    },
    // 更新popup中组件
    update(newProps = {}) {
      instance && instance.update && instance.update(newProps)
    },
    renderInstance
  }
}
