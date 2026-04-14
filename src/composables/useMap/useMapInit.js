import { shallowRef, ref } from 'vue-demi';
import { useMapEvents } from './useMapEvents';

/**
 * @description 初始化地图，暴露初始化后的回调、地图实例
 * @param el {String} 地图初始化容器的id，不需要传`#`
 * @param mapconfig {object} 地图初始化参数如：中心坐标、缩放层级、矢量源
 * @param callback {Function} 回调初始化地图完成之后的回调
 * @returns Object - 返回包含地图实例和加载状态的对象
 * @example
 * const mapconfig = {
 *        srcSdk: "https://map.sgcc.com.cn/maps?v=3.0.0",
 *        appkey: "4b9985a37eef391f9ff32c696819f605",
 *        appsecret: "ee7b92c92455300896b732377a662077",
 *        style: "aegis://styles/aegis/Streets-v2",
 *        zoom: 5.6,
 *        center: [116.06958776337888, 27.451715986601002]
 *    }
 * const { mapInstance, isLoaded } = useMapInit('container', this.mapconfig, (map) => {
 *              this.$emit("load", map);
 *              this.$hideLoading()
 *          })
 *
 */
export const useMapInit = (el, mapconfig, callback) => {
  const mapInstance = shallowRef(null);
  const isLoaded = ref(false);

  console.log(SGMap, '<==SGMap');
  // 思极地图认证
  SGMap.tokenTask.login(mapconfig.appkey, mapconfig.appsecret).then(() => {
    SGMap.plugin([
      'SGMap.DistrictPlusTask',
      'SGMap.GeolocationTask',
      'SGMap.ConvertTask',
      'SGMap.DrawPolygonHandler',
      'SGMap.DrawPointHandler',
    ]).then(function (res) {
      window.districtPlusTask = new SGMap.DistrictPlusTask();
      window.convertTask = new SGMap.ConvertTask();
      // 创建地图实例
      mapInstance.value = new SGMap.Map({
        container: el,
        style: mapconfig.style,
        zoom: mapconfig.zoom,
        center: mapconfig.center,
        localIdeographFontFamily: 'Microsoft YoHei',
        doubleClickZoom: false,
        scrollZoom: true,
        touchZoomRotate: true,
      });
      mapInstance.value.on('load', async () => {
        callback(mapInstance);
        isLoaded.value = true;
        window.geolocationTask = new SGMap.GeolocationTask();
        const { styleimagemissing } = useMapEvents(mapInstance);
        styleimagemissing();
      });
    });
  });

  return {
    mapInstance,
    isLoaded
  };
};
