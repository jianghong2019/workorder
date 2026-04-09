import { ref, watch } from 'vue';
import { flatten, polygonToLine, polygon, multiPolygonToLine } from '@turf/turf';
// 使用 Turf.js 转换面为线
function convertWithTurf(polygonData) {
  // const lineFeatures = polygonData.features.map(feature => {
  //   if (feature.geometry.type === 'Polygon') {
  //     return polygonToLine(feature);
  //   } else if (feature.geometry.type === 'MultiPolygon') {
  //     // 对于多多边形，需要分别转换每个多边形
  //     const individualPolygons = feature.geometry.coordinates.map(polygonCoords => ({
  //       type: 'Feature',
  //       properties: feature.properties,
  //       geometry: {
  //         type: 'Polygon',
  //         coordinates: polygonCoords
  //       }
  //     }));

  //     // 转换每个多边形并合并
  //     const lineStrings = individualPolygons.map(polygon => polygonToLine(polygon));
  //     return {
  //       type: 'Feature',
  //       properties: feature.properties,
  //       geometry: {
  //         type: 'MultiLineString',
  //         coordinates: lineStrings.map(ls => ls.geometry.coordinates)
  //       }
  //     };
  //   }
  //   return null;
  // }).filter(Boolean);
  // 首先展平所有几何类型
  const flattened = flatten(polygonData);
  const lineFeatures = [];
  flattened.features.forEach((feature) => {
    if (feature.geometry.type === 'Polygon') {
      const line = polygonToLine(feature);
      lineFeatures.push(line);
    } else if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach((polygonCoords) => {
        const tempPolygon = polygon(polygonCoords, feature.properties);
        const line = polygonToLine(tempPolygon);
        lineFeatures.push(line);
      });
    }
  });
  return {
    type: 'FeatureCollection',
    features: lineFeatures,
  };
}
// 工具函数：根据数值范围生成颜色配置
// import PointPopup from "../components/mapPopup/PointPopup.vue";
import { sgMapInstance, useVectorLayer, useMapEvents, useMapTools } from '@/composables/useMap';
/**
 * 获取当前可视区域内的矢量点
 * @return {array} [geoJsonData]
 * @example
 * const geoJsonData = getPointSource();
 */
const getPointSource = (layerId = '') => {
  const source = sgMapInstance?.value?.queryRenderedFeatures({
    layers: [layerId],
  });
  // 去重-重复id的点
  const pointSource = source?.filter((item, index, self) => {
    return self.findIndex((i) => i.properties.id === item.properties.id) === index;
  });
  // 将矢量点数据转换为geoJson格式
  const geoJsonData = {
    data: {
      type: 'FeatureCollection',
      features: pointSource?.map((r) => {
        return {
          type: r.type,
          geometry: r.geometry,
          properties: r.properties,
        };
      }),
    },
  };
  return geoJsonData;
};
/**
 * 根据geoJson添加地图弹窗
 * @param {object} geoJson
 * @returns {object} {reload,remove}
 * reload:重新加载弹窗
 * remove:移除弹窗
 */
export const addMapPopup = (geoJson, callBack) => {
  // 存储所有popup实例
  const popups = [];
  // 遍历删除所有popup实例
  const remove = () => {
    popups?.map((popup) => {
      popup.remove();
    });
  };
  // 加载图上popup
  const reload = () => {
    remove();
    // 遍历范围内矢量点添加popup
    geoJson?.value?.data?.features?.map((feature) => {
      const coordinates = feature.geometry.coordinates;
      if (coordinates.length > 1) {
        const lngLat = ref({ lat: coordinates[1], lng: coordinates[0] });
        // const popup = useRenderPopup(
        //   PointPopup,
        //   lngLat,
        //   { "bottom-left": [-32, 0] },
        //   {
        //     props: {
        //       ...feature.properties,
        //     },
        //     nativeOn: {
        //       /**
        //        * @description 点击图上覆盖物触发事件-点击图上元素拿到对应的geoJson数据，修改properties中的popupType，重新渲染
        //        */
        //       click: (item) => {
        //         console.log(item, feature);
        //         // 重新渲染之前先将图上覆盖物的样式重置为‘未点击’状态
        //         geoJson?.value?.data?.features?.map((item) => {
        //           if (
        //             item?.properties?.popupType === 2 ||
        //             item?.properties?.popupType === 4
        //           ) {
        //             item.properties.popupType = item.properties.popupType - 1;
        //           }
        //         });
        //         // 将点击的数据渲染为'点击'状态
        //         feature.properties.popupType = feature.properties.popupType + 1;
        //         reload();
        //         if (feature) callBack(feature);
        //       },
        //     },
        //   }
        // );
        // popups.push(popup);
      }
    });
  };
  // reload();
  return {
    reload,
    remove,
  };
};
/**
 * @description 根据geoJson添加地图可聚类的矢量图层（包含：聚类、矢量点、图上覆盖物）
 * @param {object} geojson
 * @returns {object} {destory,reload}
 * destory:销毁图层（矢量点、聚类、图上覆盖物popup）
 * reload:重新渲染（在业务代码中如果geojson变更后需要重新渲染，先调用destory）
 *
 */
export const addClusterPointLayer = (geoJson, { popupClick }) => {
  // 初始化地图矢量数据渲染
  const { destoryLayer, destorySource } = useVectorLayer(sgMapInstance);
  // const { destory } = addGeoJsonLayers(geoJson);
  // 定义需要用来渲染覆盖物的geoJson数据
  const geoJsonData = ref([]);
  // 为可视区域内矢量点渲染图上覆盖物
  const { reload: reloadMapPop, remove: removeMapPop } = addMapPopup(geoJsonData, (feature) => {
    popupClick(feature);
  });
  /**
   * @description 根据geoJson重新渲染矢量图层
   */
  const reload = () => {
    const cluster_type = geoJson?.value?.data?.features?.[0]?.properties?.title ?? '';
    // 添加数据源
    sgMapInstance?.value?.addSource(`source_${geoJson.value.id}`, {
      type: 'geojson',
      data: geoJson.value.data,
      cluster: true,
      // clusterMaxZoom: 12, // 最大聚类层级
      clusterRadius: 150, // 聚合点半径，默认50
      clusterProperties: {
        // 未配置的数量
        isNoManage_count: ['+', ['case', ['==', ['get', 'isNoManage'], 1], 1, 0]],
        // 配置的数量
        isManage_count: ['+', ['case', ['==', ['get', 'isNoManage'], 0], 1, 0]],
        total_count: ['+', 1],
        // 是否都配置（都配置：true；存在未配置的：false）
        is_all_Manage: ['all', ['==', ['get', 'isNoManage'], 0]],
      },
    });
    sgMapInstance?.value?.addLayer({
      id: `clusters_${geoJson.value.id}`,
      type: 'symbol',
      source: `source_${geoJson.value.id}`,
      filter: ['has', 'point_count'],
      layout: {
        'icon-image': [
          'case',
          ['==', ['get', 'is_all_Manage'], true],
          'icon_allManage',
          'icon_noManage',
        ],
        'icon-size': ['case', ['==', ['get', 'is_all_Manage'], true], 0.4, 0.5],
        'text-allow-overlap': true, // 允许文字重叠
        'text-ignore-placement': true, // 忽略文字布局冲突
        'icon-allow-overlap': true, // 允许图标重叠
        'icon-ignore-placement': true, // 忽略布局冲突
      },
    });

    sgMapInstance?.value?.addLayer({
      id: `clusterMainText_${geoJson.value.id}`,
      type: 'symbol',
      source: `source_${geoJson.value.id}`,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': `${cluster_type}{point_count_abbreviated}个`,
        'text-font': ['Microsoft YaHei Regular'],
        'text-size': 16,
        'text-offset': [
          'case',
          ['==', ['get', 'is_all_Manage'], true],
          ['literal', [0, 0]],
          ['literal', [0, -1.1]],
        ],
        'text-allow-overlap': true, // 允许文字重叠
        'text-ignore-placement': true, // 忽略文字布局冲突
        'icon-allow-overlap': true, // 允许图标重叠
        'icon-ignore-placement': true, // 忽略布局冲突
      },
      paint: {
        'text-color': '#ffffff',
      },
    });
    sgMapInstance?.value?.addLayer({
      id: `clusterNoManageText_${geoJson.value.id}`,
      type: 'symbol',
      source: `source_${geoJson.value.id}`,
      filter: ['all', ['has', 'point_count'], ['==', ['get', 'is_all_Manage'], false]],
      layout: {
        'text-field': ['concat', '未配置', ['get', 'isNoManage_count'], '个'],
        'text-font': ['Microsoft YaHei Regular'],
        'text-size': 14,
        'text-offset': [0, 1],
        'text-allow-overlap': true, // 允许文字重叠
        'text-ignore-placement': true, // 忽略文字布局冲突
        'icon-allow-overlap': true, // 允许图标重叠
      },
      paint: {
        'text-color': 'rgba(254,51,51,.8)',
      },
    });

    // 添加矢量点图层
    sgMapInstance?.value?.addLayer({
      id: `layer_${geoJson.value.id}`,
      type: 'circle',
      source: `source_${geoJson.value.id}`,
      filter: ['!has', 'point_count'],
      paint: {
        'circle-pitch-alignment': 'map',
        'circle-radius': ['case', ['has', 'radius'], ['get', 'radius'], 10],
        'circle-color': ['get', 'color'],
        'circle-opacity': ['case', ['has', 'circleOpacity'], ['get', 'circleOpacity'], 1],
        'circle-stroke-color': ['case', ['has', 'strokeColor'], ['get', 'strokeColor'], '#fff'],
        'circle-stroke-width': ['case', ['has', 'strokeWidth'], ['get', 'strokeWidth'], 1],
        'circle-stroke-opacity': ['case', ['has', 'strokeOpacity'], ['get', 'strokeOpacity'], 1],
      },
    });
    // 矢量数据渲染完成、页面进入空闲状态前一帧时，设置覆盖物
    sgMapInstance?.value?.on('idle', function () {
      if (!geoJson.value?.id) return;
      const features = sgMapInstance.value?.queryRenderedFeatures({
        layers: [`layer_${geoJson.value.id}`],
      });
      if (features.length > 0) {
        geoJsonData.value = getPointSource(`layer_${geoJson.value.id}`);
        reloadMapPop();
      } else {
        removeMapPop();
      }
    });
    sgMapInstance?.value?.on('click', `layer_${geoJson.value.id}`, function (e) {});

    //监听聚类图点击，并且根据点击的聚合圆展开
    sgMapInstance?.value?.on('click', `clusters_${geoJson.value.id}`, function (e) {
      var features = sgMapInstance.value?.queryRenderedFeatures(e.point, {
        layers: [`clusters_${geoJson.value.id}`],
      });

      var clusterId = features[0].properties.cluster_id;
      var pointCount = features[0].properties.point_count;
      //根据点击的聚合圆获取所有的叶子节点
      sgMapInstance.value
        ?.getSource(`source_${geoJson.value.id}`)
        .getClusterLeaves(clusterId, pointCount, 0, (err, features) => {
          if (err) return;
        });
      //根据点击的聚合圆获取子节点
      sgMapInstance.value
        ?.getSource(`source_${geoJson.value.id}`)
        .getClusterChildren(clusterId, (err, features) => {
          if (err) return;
        });
      //根据点击的聚合圆展开自适应显示
      sgMapInstance.value
        ?.getSource(`source_${geoJson.value.id}`)
        .getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err) return;
          sgMapInstance.value?.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    // sgMapInstance.value.on("zoom", () => {
    //   geoJsonData.value = getPointSource(`layer_${geoJson.value.id}`);
    //   reloadMapPop();
    // });
    // sgMapInstance?.value.on("moveend", () => {
    //   geoJsonData.value = getPointSource(`layer_${geoJson.value.id}`);
    //   reloadMapPop();
    // });
  };
  const setSource = () => {
    const currentSource = sgMapInstance.value?.getSource(`source_${geoJson.value.id}`);
    if (!currentSource) {
      sgMapInstance.value?.addSource(`source_${geoJson.value.id}`, geoJson.value.data);
    } else {
      sgMapInstance.value?.getSource(`source_${geoJson.value.id}`)?.setData(geoJson.value.data);
    }
  };
  // 销毁所有图层
  const destory = () => {
    removeMapPop();
    destoryLayer(`layer_${geoJson.value.id}`, false);
    destoryLayer(`clusterNoManageText_${geoJson.value.id}`, false);
    destoryLayer(`clusterMainText_${geoJson.value.id}`, false);
    destoryLayer(`clusters_${geoJson.value.id}`, false);
    destorySource(`source_${geoJson.value.id}`);
  };
  reload();
  return {
    destory,
    reload,
    setSource,
  };
};
/**
 * @description 根据geoJson绘制边界区域和点-省市区图层
 * @params {geoJson} geoJson数据
 * @params {layerClick} 点击事件回调
 */
export const addCountyLayer = (geoJson, { layerClick = null, layerPointHover = null }) => {
  function createColorStops(data, colorScheme = 'blue') {
    const values = data.features.map((f) => f.properties.total ?? 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const colorStops = {
      blue: ['#deebf7', '#d7f3ef', '#b8e5de', '#99e4d8', '#0Ac5A8', '#009B83'],
      red: [
        '#fff5f0',
        '#fee0d2',
        '#fcbba1',
        '#fc9272',
        '#fb6a4a',
        '#ef3b2c',
        '#cb181d',
        '#a50f15',
        '#67000d',
      ],
      green: [
        '#f7fcf5',
        '#e5f5e0',
        '#c7e9c0',
        '#a1d99b',
        '#74c476',
        '#41ab5d',
        '#238b45',
        '#006d2c',
        '#00441b',
      ],
      purple: [
        '#fcfbfd',
        '#efedf5',
        '#dadaeb',
        '#bcbddc',
        '#9e9ac8',
        '#807dba',
        '#6a51a3',
        '#54278f',
        '#3f007d',
      ],
    };
    const stops = [min];
    const colors = colorStops[colorScheme] || colorStops.blue;

    // 生成等间距的色阶
    const step = (max - min) / (colors.length - 1);
    for (let i = 1; i < colors.length - 1; i++) {
      stops.push(min + step * i);
    }
    stops.push(max);
    return { stops, colors };
  }

  let hoveredCityId = null;
  // 初始化地图矢量数据渲染
  const { destoryLayer, destorySource } = useVectorLayer(sgMapInstance);
  // 初始化地图工具-可视区域适配
  const { fitBounds } = useMapTools();
  // 添加中心点数据源
  const pointGeoJson = ref({
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });
  // 为范围内中心点渲染图上覆盖物
  // const { reload: reloadMapPop, remove: removeMapPop } = addMapPopup(
  //   pointGeoJson,
  //   (feature) => {
  //     console.log("popup点击回调", feature);
  //     if (feature.properties.isOpatity === 0)
  //       layerClick && layerClick(feature.properties);
  //   }
  // );
  //鼠标移动事件
  const handleCityMouseEnter = (e) => {
    const features = sgMapInstance.value.queryRenderedFeatures(e.point, {
      layers: [`layer_point_${geoJson.id}`],
    });
    if (features.length > 0) {
      sgMapInstance.value.getCanvas().style.cursor = 'pointer';
      const newHoveredCityId = features[0].properties.adcode;
      // 如果高亮的城市ID发生了变化
      if (newHoveredCityId !== hoveredCityId) {
        // 然后高亮新的要素
        hoveredCityId = newHoveredCityId;
        layerPointHover && layerPointHover({ data: features[0].properties, isDestory: false });
      }
    } else {
      // 如果没有悬停在任何城市上，则取消高亮
      if (hoveredCityId) {
        hoveredCityId = null;
      }
      layerPointHover && layerPointHover({ data: null, isDestory: true });
    }
  };
  // 鼠标离开事件
  const handleCityMouseLeave = () => {
    sgMapInstance.value.getCanvas().style.cursor = '';
    if (hoveredCityId) {
      hoveredCityId = null;
    }
    layerPointHover && layerPointHover({ data: null, isDestory: true });
  };
  //鼠标点击事件
  const handleCityClick = (e) => {
    // 获取当前鼠标位置下的所有市级填充要素
    const features = sgMapInstance.value.queryRenderedFeatures(e.point, {
      layers: [`layer_point_${geoJson.id}`],
    });
    if (features.length > 0) {
      const cityId = features[0].properties.adcode;
      console.log('点击获取区域', features?.[0]?.properties, cityId);
      layerClick && layerClick(features?.[0]?.properties);
      // 暂时用37401模拟
      // layerClick && layerClick({adcode:320114});
    }
  };
  // 添加事件监听
  const setupMapEvents = () => {
    sgMapInstance.value.on('mouseenter', `layer_point_${geoJson.id}`, handleCityMouseEnter);
    sgMapInstance.value.on('mouseleave', `layer_point_${geoJson.id}`, handleCityMouseLeave);
    sgMapInstance.value.on('click', `layer_point_${geoJson.id}`, handleCityClick);
  };

  // 移除事件监听
  const removeMapEvents = () => {
    sgMapInstance.value.off('mouseenter', `layer_point_${geoJson.id}`, handleCityMouseEnter);
    sgMapInstance.value.off('mouseleave', `layer_point_${geoJson.id}`, handleCityMouseLeave);
    sgMapInstance.value.off('click', `layer_point_${geoJson.id}`, handleCityClick);
  };
  // 销毁所有图层
  const destory = () => {
    // removeMapPop();
    removeMapEvents();
    destoryLayer(`layer_line_${geoJson.id}`, false);
    destoryLayer(`layer_polygon_${geoJson.id}`, false);
    destoryLayer(`layer_point_${geoJson.id}`, false);
    destoryLayer(`layer_text_${geoJson.id}`, false);
    destorySource(`pointSource_${geoJson.id}`);
    destorySource(`source_${geoJson.id}`);
    destorySource(`line_source_${geoJson.id}`);
  };
  // 更改数据源
  const changeLayerSource = (data) => {
    // 使用工具函数动态生成颜色配置
    const colorConfig = createColorStops(data, 'blue');
    const fillColorExpression = ['interpolate', ['linear'], ['coalesce', ['get', 'total'], 0]];
    for (let i = 0; i < colorConfig.stops.length; i++) {
      fillColorExpression.push(colorConfig.stops[i]);
      fillColorExpression.push(colorConfig.colors[i]);
    }
    // 区域数据源重置
    const lineData = convertWithTurf(data);
    sgMapInstance.value?.getSource(`source_${geoJson.id}`)?.setData(data);
    sgMapInstance.value?.getSource(`line_source_${geoJson.id}`)?.setData(lineData);
    sgMapInstance.value?.setPaintProperty(
      `layer_polygon_${geoJson.id}`,
      'fill-color',
      fillColorExpression
    );
    // 点数据源重置
    pointGeoJson.value.data.features = [];
    // 遍历给pointGeoJson设置点数据源所需的features
    // 遍历获取区域的中心点后创建点的geoJson
    data?.features?.forEach((item, i) => {
      if (item.properties.center) {
        pointGeoJson.value.data.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: item.properties.center,
          },
          properties: {
            ...item.properties,
          },
        });
      }
    });
    sgMapInstance.value?.getSource(`pointSource_${geoJson.id}`)?.setData(pointGeoJson.value.data);
    fitBounds(data.features);
  };
  const load = () => {
    destory();
    pointGeoJson.value.data.features = [];
    if (!geoJson || !geoJson.id) return;
    // 添加边界数据源
    sgMapInstance.value?.addSource(`source_${geoJson.id}`, {
      type: 'geojson',
      data: geoJson.data,
    });
    const lineData = convertWithTurf(geoJson.data);
    // 添加边界线数据源
    sgMapInstance.value?.addSource(`line_source_${geoJson.id}`, {
      type: 'geojson',
      data: lineData,
    });

    // 遍历给pointGeoJson设置点数据源所需的features
    geoJson?.data?.features?.forEach((item, i) => {
      if (item.properties.center) {
        pointGeoJson.value.data.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: item.properties.center,
          },
          properties: {
            ...item.properties,
          },
        });
      }
    });
    // 添加点数据源
    sgMapInstance.value?.addSource(`pointSource_${geoJson.id}`, pointGeoJson.value);
    // 添加范围面图层
    sgMapInstance.value?.addLayer({
      id: `layer_polygon_${geoJson.id}`,
      type: 'fill',
      source: `source_${geoJson.id}`,
      paint: {
        'fill-color': '#d7f3ef',
      },
    });
    // 添加范围边线图层
    sgMapInstance.value?.addLayer({
      id: `layer_line_${geoJson.id}`,
      type: 'line',
      source: `line_source_${geoJson.id}`,
      layout: {
        'line-cap': 'square',
        'line-join': 'miter',
      },
      paint: {
        'line-color': ['case', ['has', 'lineColor'], ['get', 'lineColor'], '#009B83'],
        'line-width': ['case', ['has', 'lineWidth'], ['get', 'lineWidth'], 2],
        'line-dasharray': [
          'case',
          ['==', ['get', 'lineType'], 'dashed'],
          ['literal', [1, 4]],
          ['literal', []],
        ],
      },
    });
    // 添加范围点图标图层
    sgMapInstance.value?.addLayer({
      id: `layer_point_${geoJson.id}`,
      type: 'symbol',
      source: `pointSource_${geoJson.id}`,
      layout: {
        'icon-allow-overlap': true, // 允许图标重叠
        'icon-image': 'icon_popup',
        'icon-size': 0.5,
        'text-field': ['get', 'name'],
        'text-size': 14,
        'text-font': ['Microsoft YaHei Regular'],
        'text-offset': [0, 3.1],
        'text-anchor': 'top', // 文字顶部对齐点
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#3D3D3D',
      },
    });
    // 添加范围点图标图层
    sgMapInstance.value?.addLayer({
      id: `layer_text_${geoJson.id}`,
      type: 'symbol',
      source: `pointSource_${geoJson.id}`,
      layout: {
        'text-field': ['get', 'total'],
        'text-size': 14,
        'text-offset': [0, -0.8],
        'text-anchor': 'top', // 文字顶部对齐点
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#fff',
      },
    });
    fitBounds(geoJson?.data?.features, { padding: -100 });
    // reloadMapPop();
    setupMapEvents();
  };
  load();

  return {
    destory,
    load,
    changeLayerSource,
  };
};
/**
 * @description 根据geoJson绘制边界区域和点-所级图层
 * @params {geoJson} geoJson数据
 * @params {layerClick} 点击事件回调
 */
export const addfinalLayer = (
  boundaryGeo,
  { finalOrderGeo, finalPersonGeo },
  { layerClick = null, layerPointHover = null }
) => {
  let hoveredCityId = null;
  // 初始化地图矢量数据渲染
  const { destoryLayer, destorySource } = useVectorLayer(sgMapInstance);
  // 初始化地图工具-可视区域适配
  const { fitBounds } = useMapTools();
  // 为范围内中心点渲染图上覆盖物
  // const { reload: reloadMapPop, remove: removeMapPop } = addMapPopup(
  //   pointGeoJson,
  //   (feature) => {
  //     console.log("popup点击回调", feature);
  //     if (feature.properties.isOpatity === 0)
  //       layerClick && layerClick(feature.properties);
  //   }
  // );
  //鼠标点击事件
  const handlePointClick = (e) => {
    // 获取当前鼠标位置下的所有市级填充要素
    const features = sgMapInstance.value.queryRenderedFeatures(e.point, {
      layers: [`layer_order_point_${finalOrderGeo.id}`, `layer_person_point_${finalPersonGeo.id}`],
    });
    if (features.length > 0) {
      const cityId = features[0].properties.adcode;
      console.log('点击获取区域', features?.[0]?.properties, cityId);
      layerClick && layerClick({ data: features?.[0]?.properties });
    } else {
      layerClick && layerClick({ isClose: true });
    }
  };
  // 工单聚合图标点击事件
  const handleOrderClusterClick = (e) => {
    var features = sgMapInstance.value?.queryRenderedFeatures(e.point, {
      layers: [`layer_order_cluster_${finalOrderGeo.id}`],
    });
    console.log(features);

    var clusterId = features[0].properties.cluster_id;
    var pointCount = features[0].properties.point_count;
    //根据点击的聚合圆获取所有的叶子节点
    sgMapInstance.value
      ?.getSource(`order_pointSource_${finalOrderGeo.id}`)
      .getClusterLeaves(clusterId, pointCount, 0, (err, features) => {
        console.log(err, features);

        if (err) return;
      });
    //根据点击的聚合圆获取子节点
    sgMapInstance.value
      ?.getSource(`order_pointSource_${finalOrderGeo.id}`)
      .getClusterChildren(clusterId, (err, features) => {
        console.log(err, features);
        if (err) return;
      });
    //根据点击的聚合圆展开自适应显示
    sgMapInstance.value
      ?.getSource(`order_pointSource_${finalOrderGeo.id}`)
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;
        sgMapInstance.value?.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  };
  const handlePersonClusterClick = (e) => {
    var features = sgMapInstance.value?.queryRenderedFeatures(e.point, {
      layers: [`layer_person_cluster_${finalOrderGeo.id}`],
    });
    console.log(features);

    var clusterId = features[0].properties.cluster_id;
    var pointCount = features[0].properties.point_count;
    //根据点击的聚合圆获取所有的叶子节点
    sgMapInstance.value
      ?.getSource(`person_pointSource_${finalPersonGeo.id}`)
      .getClusterLeaves(clusterId, pointCount, 0, (err, features) => {
        console.log(err, features);

        if (err) return;
      });
    //根据点击的聚合圆获取子节点
    sgMapInstance.value
      ?.getSource(`person_pointSource_${finalPersonGeo.id}`)
      .getClusterChildren(clusterId, (err, features) => {
        console.log(err, features);
        if (err) return;
      });
    //根据点击的聚合圆展开自适应显示
    sgMapInstance.value
      ?.getSource(`person_pointSource_${finalPersonGeo.id}`)
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;
        sgMapInstance.value?.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  };
  // 添加事件监听
  const setupMapEvents = () => {
    sgMapInstance.value.on('click', handlePointClick);
    //监听聚类图点击，并且根据点击的聚合圆展开
    sgMapInstance?.value?.on(
      'click',
      `layer_order_cluster_${finalOrderGeo.id}`,
      handleOrderClusterClick
    );
    sgMapInstance?.value?.on(
      'click',
      `layer_person_cluster_${finalOrderGeo.id}`,
      handlePersonClusterClick
    );
  };

  // 移除事件监听
  const removeMapEvents = () => {
    sgMapInstance.value.off('click', handlePointClick);
    sgMapInstance?.value?.off(
      'click',
      `layer_order_cluster_${finalOrderGeo.id}`,
      handleOrderClusterClick
    );
    sgMapInstance?.value?.off(
      'click',
      `layer_person_cluster_${finalOrderGeo.id}`,
      handlePersonClusterClick
    );
  };
  // 销毁所有图层
  const destory = () => {
    // removeMapPop();
    removeMapEvents();
    destoryLayer(`layer_bound_line_${boundaryGeo.id}`, false);
    destoryLayer(`layer_bound_polygon_${boundaryGeo.id}`, false);
    destoryLayer(`layer_order_cluster_${finalOrderGeo.id}`, false);
    destoryLayer(`layer_order_point_${finalOrderGeo.id}`, false);
    destoryLayer(`layer_person_cluster_${finalOrderGeo.id}`, false);
    destoryLayer(`layer_person_point_${finalPersonGeo.id}`, false);
    destorySource(`order_pointSource_${finalOrderGeo.id}`);
    destorySource(`person_pointSource_${finalPersonGeo.id}`);
    destorySource(`source_${boundaryGeo.id}`);
  };
  // 更改数据源
  const changeLayerSource = (boundaryData = null) => {
    // 区域数据源重置
    boundaryData &&
      sgMapInstance.value?.getSource(`source_${boundaryGeo.id}`)?.setData(boundaryData);
    console.log(boundaryData, 'finalOrderGeo.data.features====>', finalOrderGeo.data.features);

    sgMapInstance.value
      ?.getSource(`order_pointSource_${finalOrderGeo.id}`)
      ?.setData(finalOrderGeo.data);
    sgMapInstance.value
      ?.getSource(`person_pointSource_${finalPersonGeo.id}`)
      ?.setData(finalPersonGeo.data);
    // 调整地图可视区域
    boundaryData && fitBounds(boundaryData.features);
  };
  const toggleLayer = (layerId, isShow = true) => {
    console.log('toggleLayer===>', sgMapInstance.value);
    if (isShow) {
      sgMapInstance.value.setLayoutProperty(layerId, 'visibility', 'visible');
    } else {
      sgMapInstance.value.setLayoutProperty(layerId, 'visibility', 'none');
    }
  };
  const load = () => {
    destory();
    if (!boundaryGeo || !boundaryGeo.id) return;
    // 添加边界数据源
    sgMapInstance.value?.addSource(`source_${boundaryGeo.id}`, {
      type: 'geojson',
      data: boundaryGeo.data,
    });
    // 添加工单点数据源
    sgMapInstance.value?.addSource(`order_pointSource_${finalOrderGeo.id}`, {
      type: 'geojson',
      data: finalOrderGeo.data,
      cluster: true,
      // clusterMaxZoom: 12, // 最大聚类层级
      // clusterRadius: 150, // 聚合点半径，默认50
      clusterProperties: {
        hasWarning04: ['any', ['==', ['get', 'warningDegree'], '04']],
        hasWarning0: ['any', ['==', ['get', 'warningDegree'], '0']],
        hasWarning01: ['any', ['==', ['get', 'warningDegree'], '01']],
        hasWarning02: ['any', ['==', ['get', 'warningDegree'], '02']],
        hasWarning03: ['any', ['==', ['get', 'warningDegree'], '03']],
      },
    });
    // 添加人员点数据源
    sgMapInstance.value?.addSource(`person_pointSource_${finalPersonGeo.id}`, {
      type: 'geojson',
      data: finalPersonGeo.data,
      cluster: true,
      // clusterMaxZoom: 12, // 最大聚类层级
      // clusterRadius: 150, // 聚合点半径，默认50
      clusterProperties: {
        hasWarning04: ['any', ['==', ['get', 'warningDegree'], '04']],
        hasWarning0: ['any', ['==', ['get', 'warningDegree'], '0']],
        hasWarning01: ['any', ['==', ['get', 'warningDegree'], '01']],
        hasWarning02: ['any', ['==', ['get', 'warningDegree'], '02']],
        hasWarning03: ['any', ['==', ['get', 'warningDegree'], '03']],
      },
    });
    // 添加范围边线图层
    sgMapInstance.value?.addLayer({
      id: `layer_bound_line_${boundaryGeo.id}`,
      type: 'line',
      source: `source_${boundaryGeo.id}`,
      layout: {
        'line-cap': 'square',
        'line-join': 'miter',
      },
      paint: {
        'line-color': ['case', ['has', 'lineColor'], ['get', 'lineColor'], 'rgba(0, 155, 131, 1)'],
        'line-width': ['case', ['has', 'lineWidth'], ['get', 'lineWidth'], 3],
        'line-dasharray': [
          'case',
          ['==', ['get', 'lineType'], 'dashed'],
          ['literal', [1, 4]],
          ['literal', []],
        ],
      },
    });
    // 添加范围面图层
    sgMapInstance.value?.addLayer({
      id: `layer_bound_polygon_${boundaryGeo.id}`,
      type: 'fill',
      source: `source_${boundaryGeo.id}`,
      paint: {
        'fill-color': 'rgba(0, 155, 131, 0.1)',
        'fill-opacity': 1,
      },
    });
    // 添加工单聚合图层
    sgMapInstance.value?.addLayer({
      id: `layer_order_cluster_${finalOrderGeo.id}`,
      type: 'symbol',
      source: `order_pointSource_${finalOrderGeo.id}`,
      filter: ['has', 'point_count'],
      layout: {
        'icon-allow-overlap': true, // 允许图标重叠
        'icon-image': [
          'case',
          ['==', ['get', 'hasWarning04'], true],
          'icon_order_status_0',
          ['==', ['get', 'hasWarning01'], true],
          'icon_order_status_2',
          ['==', ['get', 'hasWarning02'], true],
          'icon_order_status_3',
          ['==', ['get', 'hasWarning03'], true],
          'icon_order_status_4',
          'icon_order_status_1',
        ],
        'icon-size': ['case', ['>=', ['get', 'point_count'], 10], 0.7, 0.6],
        'text-field': [
          'concat', // 拼接字符串
          ['get', 'point_count'], // 获取聚合数量
          '个',
          '\n',
          '工单',
        ],
        'text-size': 14,
        'text-font': ['Microsoft YaHei Regular'],
        'text-offset': [0, -1.5],
        'text-anchor': 'top', // 文字顶部对齐点
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': ['case', ['==', ['get', 'hasWarning04'], true], '#000', '#fff'],
      },
    });
    // 添加工单数据图层
    sgMapInstance.value?.addLayer({
      id: `layer_order_point_${finalOrderGeo.id}`,
      type: 'symbol',
      source: `order_pointSource_${finalOrderGeo.id}`,
      filter: ['!has', 'point_count'],
      layout: {
        'icon-allow-overlap': true, // 允许图标重叠
        'icon-image': [
          'match',
          ['get', 'warningDegree'],
          '0',
          'icon_order_status_1',
          '01',
          'icon_order_status_2',
          '02',
          'icon_order_status_3',
          '03',
          'icon_order_status_4',
          '04',
          'icon_order_status_0',
          'icon_order_status_0',
        ],
        'icon-size': 0.5,
        'text-field': ['case', ['has', 'name'], ['get', 'name'], '其他'],
        'text-size': 14,
        'text-font': ['Microsoft YaHei Regular'],
        'text-offset': [0, -0.8],
        'text-anchor': 'top', // 文字顶部对齐点
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': ['match', ['get', 'warningDegree'], '04', '#000', '#fff'],
      },
    });
    // 添加人员聚合图层
    sgMapInstance.value?.addLayer({
      id: `layer_person_cluster_${finalOrderGeo.id}`,
      type: 'symbol',
      source: `person_pointSource_${finalPersonGeo.id}`,
      filter: ['has', 'point_count'],
      layout: {
        'icon-allow-overlap': true, // 允许图标重叠
        'icon-image': [
          'case',
          ['==', ['get', 'hasWarning04'], true],
          'icon_order_status_0',
          [
            'any',
            ['==', ['get', 'hasWarning01'], true],
            ['==', ['get', 'hasWarning02'], true],
            ['==', ['get', 'hasWarning03'], true],
          ],
          'icon_order_status_3',
          'icon_order_status_1',
        ],
        'icon-size': ['case', ['>=', ['get', 'point_count'], 10], 0.7, 0.6],
        'text-field': [
          'concat', // 拼接字符串
          ['get', 'point_count'], // 获取聚合数量
          '个',
          '\n',
          '人员',
        ],
        'text-size': 14,
        'text-font': ['Microsoft YaHei Regular'],
        'text-offset': [0, -1.5],
        'text-anchor': 'top', // 文字顶部对齐点
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': ['case', ['==', ['get', 'hasWarning04'], true], '#000', '#fff'],
      },
    });
    //添加人员数据-状态图层
    sgMapInstance.value?.addLayer({
      id: `layer_person_point_${finalPersonGeo.id}`,
      type: 'symbol',
      source: `person_pointSource_${finalPersonGeo.id}`,
      filter: ['!has', 'point_count'],
      layout: {
        'icon-allow-overlap': true, // 允许图标重叠
        'icon-image': [
          'match',
          ['get', 'warningDegree'],
          '04',
          'icon_person_status_0',
          '01',
          'icon_person_status_2',
          '02',
          'icon_person_status_2',
          '03',
          'icon_person_status_2',
          '0',
          'icon_person_status_1',
          'icon_person_status_1',
        ],
        'icon-size': 0.4,
      },
      paint: {
        'text-color': '#fff',
      },
    });
    fitBounds(boundaryGeo?.data?.features, { padding: -100 });
    // reloadMapPop();
    setupMapEvents();
  };
  load();

  return {
    destory,
    load,
    changeLayerSource,
    toggleLayer,
  };
};
