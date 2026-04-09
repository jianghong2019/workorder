<template>
  <div id="mapView" class="order-visual">
    <SgMap :mapconfig="mapconfig"></SgMap>
    <el-container class="visual-container">
      <!-- 头部按钮容器 -->
      <el-header>
        <div class="el-row-header">
          <!-- 左侧单位容器 -->
          <div class="unit-left">
            <!-- 组织机构树下拉 -->
            <org-tree
              v-model="form.orgNo"
              :unit-data="unitData"
              @handlerTreeSelect="handlerTreeSelect"
            ></org-tree>
            <!-- 本级||管辖切换按钮,06层所级管理单时不展示切换按钮,因为所级无管辖单位只能看本级数据 -->
            <span v-if="showUnitBtn" class="unit-btn" @click="modeClick">{{
              form.hasChildren ? '本级单位' : '管辖单位'
            }}</span>
            <el-input
              v-if="!form.hasChildren"
              v-model="form.searchText"
              size="small"
              placeholder="请输入搜索内容"
              class="search-input"
              clearable
              @keyup.enter.native="handleSearch"
            >
              <i slot="prefix" class="el-icon-search"></i>
            </el-input>
          </div>
          <!-- 中间提示信息 -->
          <div class="message-center">
            <span class="error-info">离线终端较昨日下降超过3.7%，请处理！</span>
            <span class="error-details" @click="errorDetails">查看详情</span>
          </div>
          <!-- 右侧功能按钮 -->
          <div class="funbtn-right">
            <fun-button
              :btn-list="funBtnList"
              @jumpPage="jumpPage"
              @report="report"
              @legend="legend"
              @screen="screen"
            ></fun-button>
          </div>
        </div>
      </el-header>
      <!-- 卡片主体 -->
      <el-main>
        <!-- 卡片容器 -->
        <div class="el-row-main">
          <!-- 左侧卡片 -->
          <div class="crad-left">
            <template v-for="card of leftCardList">
              <component
                :is="card.is"
                :key="card.is"
                :ref="card.is"
                :org-no="form.orgNo"
                :screensize.sync="fullScreen"
              ></component>
            </template>
          </div>
          <!-- 中间的控件 -->
          <div class="control-center">
            <!-- 左侧控件 -->
            <div class="control-left">
              <el-popover
                v-for="item of controlList"
                :key="item.id"
                v-model="item.filter"
                placement="bottom"
                trigger="manual"
              >
                <!-- 控件气泡弹框内容 -->
                <div class="popover-content" :style="{ width: item.width + 'px' }">
                  <template v-for="checkItem of item.checkList">
                    <div :key="checkItem.codeValue" class="check-content">
                      <el-checkbox
                        v-model="checkItem.checkAll"
                        class="check-title checkbox-bottom"
                        :indeterminate="checkItem.isIndeterminate"
                        @change="(flag) => handleCheckAllChange(flag, checkItem)"
                        >{{ checkItem.codeName }}</el-checkbox
                      >
                      <el-checkbox-group
                        v-model="checkItem.checkeds"
                        @change="(val) => handleCheckedChange(val, checkItem)"
                      >
                        <el-checkbox
                          v-for="child in checkItem.childList"
                          :key="child.codeValue"
                          class="checkbox-bottom"
                          :label="child.codeValue"
                          >{{ child.codeName }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </div>
                  </template>
                  <div class="filter-btn">
                    <el-button round size="medium" @click="item.filter = false">取消</el-button>
                    <el-button round size="medium" type="success" @click="popoverFilter(item)"
                      >筛选</el-button
                    >
                  </div>
                </div>
                <!-- 控件按钮 -->
                <template slot="reference">
                  <div
                    class="control-btn"
                    :class="controlActive == item.id ? item.active : item.unactive"
                    @click="controlClick(item)"
                  >
                    <span class="control-text">{{ item.label }}</span>
                    <!-- 筛选按钮 -->
                    <span
                      v-if="controlActive == item.id"
                      class="control-filter"
                      @click.stop="controlFilter(item)"
                    ></span>
                  </div>
                </template>
              </el-popover>
            </div>
            <!-- 右侧控件 -->
            <el-button plain @click="back">
              <img :src="require('@/assets/iconfont/icon/返回.svg')" width="15" height="15" />
              <span>返回上一级</span>
            </el-button>
          </div>
          <!-- 右侧卡片 -->
          <div class="crad-right">
            <template v-for="card of rightCardList">
              <component
                :is="card.is"
                :key="card.is"
                :ref="card.is"
                :org-no="form.orgNo"
                :screensize.sync="fullScreen"
              ></component>
            </template>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 图列说明弹框 -->
    <el-dialog append-to-body title="图例说明" :visible.sync="legendVisible">
      <img src="@/assets/iconfont/icon/图例.png" />
    </el-dialog>
  </div>
</template>
<script>
import SgMap from '@/components/common/tools/SgMap.vue';
import { isLoaded, sgMapInstance } from '@/composables/useMap';
import { addCountyLayer, addfinalLayer } from './js/mapUtils';
import { useRenderPopup } from '@/composables/useMap/useRenderPopup';
import OrderTool from './components/OrderTool.vue';
import PeopleTool from './components/PeopleTool.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import { useUnitData } from '@/composables/useUnitData.js';
import { mapState } from 'vuex';
import API from '@/api/hierarchicalControl/firstlevel.js';
import {
  mapconfig,
  funBtnList,
  routers,
  controlConfig,
  leftCardConfig,
  rightCardConfig,
} from './js/config.js';
import funButton from './components/funButton.vue'; //右侧功能按钮组件
import WorkOrderManage from './components/WorkOrderManage.vue';
import WarningSituation from './components/WarningSituation.vue';
import WorkOrderManageNext from './components/WorkOrderManageNext.vue';
import PeopleSituation from './components/PeopleSituation.vue';
import ProductionFactors from './components/ProductionFactors.vue';
import ProblemMonitor from './components/ProblemMonitor.vue';
import ProductionFactorsSub from './components/ProductionFactorsSub.vue';
export default {
  components: {
    SgMap,
    OrgTree,
    funButton,
    WorkOrderManage,
    WarningSituation,
    PeopleSituation,
    ProductionFactors,
    WorkOrderManageNext,
    ProblemMonitor,
    ProductionFactorsSub,
  },
  computed: {
    ...mapState({
      UserData: (state) => state.UserData,
    }),
    showUnitBtn() {
      //是否展示本级单位与管辖单位切换按钮
      return this.form.distLv != '06';
    },
    //控件按钮循环数据
    controlList() {
      return this.controlConfig.filter((item) => {
        let { id, hasChildren } = item;
        if (id == '02' || id == '03') return item; //如果是工单、人员直接返回
        return hasChildren == this.form.hasChildren; //否则只返回与form的hasChildren相同的配置项
      });
    },
    //左侧卡片配置数据
    leftCardList() {
      return this.leftCardConfig.filter((el) => {
        return el.hasChildren == this.form.hasChildren;
      });
    },
    //右侧卡片配置数据
    rightCardList() {
      return this.rightCardConfig.filter((el) => {
        return el.hasChildren == this.form.hasChildren;
      });
    },
  },
  data() {
    return {
      mapconfig: mapconfig, //思极地图sdk地址以及秘钥配置
      geoResult: {}, //gis地图边界图层数据
      form: {
        orgNo: '', //管理单位编码
        orgName: '', //管理单位名称
        distLv: '', //管理单位层级
        hasChildren: true, //当前页面展示本级单位还是管辖单位，true：管辖单位，false:本级单位
        searchText: '', //本级时的输入框输入内容
      },
      funBtnList: funBtnList, //右侧功能按钮
      fullScreen: true, //是否全屏，true:非全景;false:全景
      legendVisible: false, //图列说明弹框是否打开
      controlActive: '02', //选中的控件，01:全部; 02:工单; 03:人员; 04:问题 默认选中第一项
      controlConfig: controlConfig, //控件配置项
      removeTooltip: null, //去除悬浮框
      boundaryGeo: {
        // 供电所区域geoJson数据
        id: 10000,
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      finalOrderGeo: {
        //供电所散点数据
        id: 10001,
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      districtMarkers: [], // 保存所有 marker
      thirdLevelMarkers: [],
      leftCardConfig: leftCardConfig, //左侧卡片配置
      rightCardConfig: rightCardConfig, //右侧卡片配置
    };
  },
  setup() {
    //初始化管理单位树下拉内容
    const { unitData } = useUnitData();
    return {
      unitData,
    };
  },
  watch: {
    'form.hasChildren': {
      handler(val) {
        if (val) {
          //如果为管辖单位
          this.form.searchText = ''; //清空输入框内容
          //如果当前控件选择为全部，则切换至工单
          this.controlActive == '01' ? (this.controlActive = '02') : '';
        } else {
          //如果为本级单位
          //如果当前控件选择为问题类型，则切换至全部
          this.controlActive == '04' ? (this.controlActive = '01') : '';
        }
      },
    },
  },
  created() {
    // 根据登录人信息初始化管理单位树绑定数据
    this.handlerTreeSelect(this.UserData);
    // 获取gis地图边界图层数据
    this.getFirstOrgGeo();
    // 获取工单、全部控件多选内容
    this.getOrderTree();
    //获取督办消息数据
    this.getMySuperviseCount();
  },
  mounted() {
    this.$watch(
      () => isLoaded.value,
      (val) => {
        if (val) {
          this.initsourceMap();
        }
      },
      { immediate: true }
    );
  },
  methods: {
    //管理单位树选择事件
    handlerTreeSelect(data) {
      let { FUNC_TYPE: distLv, orgId: orgNo, name: orgName } = data;
      data = { ...data, distLv, orgNo, orgName };
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key];
      });
      //层级06无下级单位，否则有下级单位
      distLv == '06' ? (this.form.hasChildren = false) : (this.form.hasChildren = true);
      this.funcType = distLv;
    },
    //模式切换分为本级单位、管辖单位两种模式
    modeClick() {
      this.form.hasChildren = !this.form.hasChildren;
      // this.changeLayerSource(this.geoResult);
    },
    // 查询地图边界数据
    async getFirstOrgGeo() {
      let params = {
        orgNo: '37101',
      };
      // demo
      let res = await API.getCurrentOrgGeo(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.geoResult = JSON.parse(DTS.geoJson);
      }
    },
    //初始化地图数据源
    initsourceMap() {
      // const mymap = sgMapInstance.value;
      const geoJson = {
        value: {
          data: this.geoResult,
          id: 100000,
        },
      };
      /**
       * @description 初始化创建区域图层方法-省市区图层
       * @param {Object} geoJson 数据源
       * @param {Object} options 配置项
       * @param {Function} options.layerClick 点击事件
       * @param {Function} options.layerPointHover 悬浮事件
       * @returns {Object} { load, changeLayerSource,destory }
       * load: 初始化/重新加载图层方法
       * changeLayerSource: 切换数据源方法
       * destory: 销毁图层及数据源方法
       */
      const { load, changeLayerSource, destory } = addCountyLayer(geoJson, {
        layerClick: this.layerClick,
        layerPointHover: this.layerPointHover,
      });
      this.changeLayerSource = changeLayerSource;
      this.reloadLayer = load;
      this.destoryLayer = destory;

      const {
        load: loadFinal,
        changeLayerSource: changeFinalLayerSource,
        destory: destoryFinal,
      } = addfinalLayer(
        this.boundaryGeo,
        { finalOrderGeo: this.finalOrderGeo },
        {
          layerClick: this.finaLayerClick,
          layerPointHover: this.finalLayerPointHover,
        }
      );
      this.changeFinalLayerSource = changeFinalLayerSource;
      this.reloadFinalLayer = loadFinal;
      this.destoryFinalLayer = destoryFinal;
    },
    // 图层点击事件
    async layerClick(properties) {
      let params = {
        orgNo: '37401',
        // orgNo: properties.adcode,
      };
      let res1 = await API.getCurrentOrgGeo(params);
      let res2 = await API.selectAll(params);
      if (res1.data.RT_F == 1 && res1.data.DTS && res1.data.DTS.funcType == '02') {
        let targetGeoObj = JSON.parse(res1.data.DTS.geoJson).features.filter(
          (item) => item.properties.adcode === properties.adcode
        );
        let targetGeo = {
          type: 'FeatureCollection',
          features: targetGeoObj,
        };
        this.changeLayerSource(targetGeo);
      } else if (res1.data.RT_F == 1 && res1.data.DTS && res1.data.DTS.funcType == '03') {
        // 清空省市区级别图层数据源，后续需要展示所级图层数据
        this.changeLayerSource({
          type: 'FeatureCollection',
          features: [],
        });
        const geoJson = JSON.parse(res1.data.DTS.geoJson);
        console.log('所边界geoJson====>', geoJson);

        const targetGeo = res1.data?.DTS?.geoJson
          ? JSON.parse(res1.data.DTS.geoJson)
          : {
              type: 'FeatureCollection',
              features: [],
            };
        const orderFeatures = [
          {
            type: 'Feature',
            properties: {
              name: '电',
              id: 100801,
            },
            geometry: {
              type: 'Point',
              coordinates: [118.74886210873177, 31.973794707067952],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: '采',
              id: 100802,
            },
            geometry: {
              type: 'Point',
              coordinates: [118.7538988441629, 31.95955155490489],
            },
          },
        ];
        // 展示所级数据源
        this.finalOrderGeo.data = {
          type: 'FeatureCollection',
          features: orderFeatures,
        };
        this.changeFinalLayerSource(targetGeo);
        // let finalgeo = JSON.parse(res1.data.DTS.geoJson);
        // finalgeo.features[0].properties.value = 60;
        // this.addThirdLevelMarkers(res2.data.DTS);
      }
    },
    /**
     * @description: 图上点的hover事件，鼠标悬浮式展示悬浮弹层
     * @param {*} data 悬浮点所在区域的properties数据，可以从中拿取adcode请求下级以及拿去业务数据渲染弹窗
     * @param {*} isDestory 是否为销毁弹窗 true为销毁，false为创建
     */
    layerPointHover({ data, isDestory }) {
      console.log('layerPointHover====>', data, isDestory);
      // 创建
      if (!isDestory) {
        const center = JSON.parse(data.center);
        const lngLat = { value: center };
        // 暴漏销毁方法，调用可销毁popup
        if (this.controlActive == '02') {
          //工单类型
          const { remove } = useRenderPopup(OrderTool, lngLat, [0, 0], {
            props: {
              name: data.name,
              unprocessedCount: data.unprocessedCount || 0,
              dispatchedCount: data.dispatchedCount || 0,
              unDispatchCount: data.unDispatchCount || 0,
            },
          });
          this.removeTooltip = remove;
        } else if (this.controlActive == '03') {
          //人员性质
          const { remove } = useRenderPopup(PeopleTool, lngLat, [0, 0], {
            props: {
              name: data.name,
              workCount: data.workCount || 0,
              mainCount: data.mainCount || 0,
              outCount: data.outCount || 0,
            },
          });
          this.removeTooltip = remove;
        } else if (this.controlActive == '04') {
          //问题类型
          const { remove } = useRenderPopup(ProblemTool, lngLat, [0, 0], {
            props: {
              name: data.name,
              qualityProblemCount: data.qualityProblemCount || 0,
              riskProblemCount: data.riskProblemCount || 0,
            },
          });
          this.removeTooltip = remove;
        }
      } else {
        // 销毁
        this.removeTooltip && this.removeTooltip();
        this.removeTooltip = null;
      }
    },
    getGeoJsonBounds(geoJson) {
      const bounds = new SGMap.LngLatBounds();
      geoJson.features.forEach((feat) => {
        const coords = feat.geometry.coordinates;
        function processCoord(coord) {
          if (typeof coord[0] === 'number') {
            bounds.extend(coord);
          } else {
            coord.forEach((c) => processCoord(c));
          }
        }
        processCoord(coords);
      });
      return bounds;
    },
    // 清除marker
    removeAllDistrictMarkers() {
      if (this.districtMarkers) {
        this.districtMarkers.forEach((m) => m.remove());
        this.districtMarkers = [];
      }
    },
    // 清除打点
    clearThirdLevelMarkers() {
      if (this.thirdLevelMarkers) {
        this.thirdLevelMarkers.forEach((m) => m.remove());
        this.thirdLevelMarkers = [];
      }
    },
    // 创建marker
    createMarker({ icon, name, lon, lat }) {
      const el = document.createElement('div');
      el.className = 'third-level-marker';

      el.innerHTML = `
                        <div class="marker-icon" style="background-image:url('${icon}')"></div>
                        <div class="marker-label">${name || ''}</div>
                      `;

      const marker = new SGMap.Marker(el).setLngLat([lon, lat]).addTo(sgMapInstance.value);

      this.thirdLevelMarkers.push(marker);
    },
    getOrderIconByRate(rate) {
      if (rate >= 300) return require('@/static/icons/order_level3.png'); // 严重超时
      if (rate >= 100) return require('@/static/icons/order_level2.png'); // 中度超时
      return require('@/static/icons/icon_popup.png'); // 一般工单
    },
    //获取工单、全部控件多选内容
    async getOrderTree() {
      let res = await API.getOrderTree({});
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        DTS.forEach((item) => {
          item.isIndeterminate = false;
          item.checkAll = true;
          item.checkeds = item.childList.map((el) => el.codeValue);
        });
        this.controlConfig.forEach((item) => {
          if (item.orderTree) item.checkList = JSON.parse(JSON.stringify(DTS));
        });
      } else {
        this.$message.error(RT_D);
      }
    },
    // 获取督办消息数据
    async getMySuperviseCount() {
      let res = await API.getMySuperviseCount({});
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
      } else {
        this.$message.error(RT_D);
      }
    },
    //报告生成
    report() {
      console.log('报告生成');
    },
    //页面跳转
    jumpPage(data, dateType) {
      let { id } = data;
      if (!id) return;
      let beginTime = '';
      let endTime = '';
      if (dateType) {
        const timeRange = this.getDateRangeByType(dateType);
        beginTime = timeRange.beginTime;
        endTime = timeRange.endTime;
      }
      let params = {
        orgId: this.form.orgNo,
        orgType: this.form.hasChildren ? '01' : '02', //管辖单位传01,本级单位传02
        tabsIndex: '',
        timeData: [beginTime, endTime],
      };
      //路由跳转并携带参数
      this.$router.push({ path: routers[id], query: params });
    },
    // 时间范围获取函数
    getDateRangeByType(dateType) {
      if (!dateType) return { beginTime: '', endTime: '' };
      const now = this.$moment();
      const dateConfig = {
        '01': { start: 'day', end: 'day' }, // 本日
        '02': { start: 'month', end: 'month' }, // 本月
        '04': { start: 'year', end: 'year' }, // 本年
      };
      const config = dateConfig[dateType] || dateConfig['04'];
      return {
        beginTime: now.startOf(config.start).format('YYYY-MM-DD'),
        endTime: now.endOf(config.end).format('YYYY-MM-DD'),
      };
    },
    //图例说明
    legend() {
      this.legendVisible = true;
    },
    //全屏预览
    screen(data) {
      this.fullScreen = !this.fullScreen;
      this.fullScreen ? (data.label = '全屏预览') : (data.label = '退出全屏');
    },
    //地图中间控件按钮点击事件
    controlClick(item) {
      let { id, event } = item;
      console.log('控件点击事件');
      // 将所有控件的气泡弹框隐藏
      this.controlConfig.forEach((el) => {
        el.filter = false;
      });
      this.controlActive = id;
      this[event]({ item });
    },
    //地图控件按钮筛选图标点击事件
    controlFilter(item) {
      console.log('控件筛选点击事件');
      //当前控件气泡弹框状态取反
      item.filter = !item.filter;
    },
    //筛选气泡弹框全选
    handleCheckAllChange(flag, checkItem) {
      checkItem.checkeds = flag ? checkItem.childList.map((el) => el.codeValue) : [];
      checkItem.isIndeterminate = false;
    },
    //筛选气泡弹框多选改变事件
    handleCheckedChange(value, checkItem) {
      let checkedCount = value.length;
      checkItem.checkAll = checkedCount === checkItem.childList.length;
      checkItem.isIndeterminate = checkedCount > 0 && checkedCount < checkItem.childList.length;
    },
    //控件气泡弹框筛选按钮点击事件
    popoverFilter(item) {
      this[item.event]({ item, close: true });
    },
    //工单按钮点击业务逻辑
    async workOrder(item, close) {
      //close：是否关闭控件气泡弹框；true：关闭；false:保持当前状态
      let keyWord = item.checkList
        .reduce((arr, el) => {
          return arr.concat(el.checkeds);
        }, [])
        .join(',');
      let params = {
        orgNo: this.form.orgNo,
        keyWord,
      };
      let res = await API.getWorkOrderStats(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        close ? (item.filter = false) : '';
        this.geoResult.features.forEach((itemB) => {
          const matched = DTS.find((itemA) => itemA.orgNo === itemB.properties.adcode);
          if (matched) {
            Object.assign(itemB.properties, {
              unprocessedCount: matched.unprocessedCount,
              dispatchedCount: matched.dispatchedCount,
              unDispatchCount: matched.unDispatchCount,
            });
          }
        });
        this.changeLayerSource(this.geoResult);
      } else {
        this.$message.error(RT_D);
      }
    },
    // 人员按钮点击业务逻辑
    async personNature(item, close) {
      let personNature = item.checkList
        .reduce((arr, el) => {
          return arr.concat(el.checkeds);
        }, [])
        .join(',');
      let params = {
        orgNo: this.form.orgNo,
        personNature,
      };
      let res = await API.getPersonStats(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        close ? (item.filter = false) : '';
        this.geoResult.features.forEach((itemB) => {
          const matched = DTS.find((itemA) => itemA.orgNo === itemB.properties.adcode);
          if (matched) {
            Object.assign(itemB.properties, {
              workCount: matched.workCount,
              mainCount: matched.mainCount,
              outCount: matched.outCount,
            });
          }
        });
        this.changeLayerSource(this.geoResult);
      } else {
        this.$message.error(RT_D);
      }
    },
    //问题按钮点击业务逻辑
    async questionType(item, close) {
      let problemType = item.checkList
        .reduce((arr, el) => {
          return arr.concat(el.checkeds);
        }, [])
        .join(',');
      let params = {
        orgNo: this.form.orgNo,
        problemType,
      };
      let res = await API.getProblemStats(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        close ? (item.filter = false) : '';
        this.geoResult.features.forEach((itemB) => {
          const matched = DTS.find((itemA) => itemA.orgNo === itemB.properties.adcode);
          if (matched) {
            Object.assign(itemB.properties, {
              qualityProblemCount: matched.qualityProblemCount,
              riskProblemCount: matched.riskProblemCount,
            });
          }
        });
      } else {
        this.$message.error(RT_D);
      }
    },
    //查看详情点击事件
    errorDetails() {},
    //返回上一级按钮点击事件
    back() {},
  },
};
</script>
<style lang="scss" scoped>
.order-visual {
  position: relative;
  width: 100%;
  height: 100%;
  ::v-deep .sgmap-popup {
    max-width: none !important;
  }
  ::v-deep .visual-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10;
    pointer-events: none;
    .el-header {
      margin-bottom: 17px;
      .el-row-header {
        padding-top: 8px;
        box-sizing: content-box;
        height: 32px;
        display: flex;
        pointer-events: all;
        .unit-left {
          flex: 8;
          display: flex;
          flex-wrap: nowrap;
          .safeweb-web {
            flex: 1;
            margin-right: 8px;
            max-width: 344px;
          }
          .unit-btn {
            width: 94px;
            background-image: url('~@/assets/iconfont/icon/单位切换.svg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 32px;
            line-height: 32px;
            color: #fff;
            text-align: end;
            padding-right: 10px;
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
          }
          .search-input {
            width: 230px;
            margin-left: 22px;
            .el-input__prefix {
              line-height: 32px;
            }
          }
        }
        .message-center {
          flex: 8;
          background-image: url('~@/assets/iconfont/icon/小喇叭.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          line-height: 32px;
          padding: 0 30px 0 60px;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          .error-details {
            color: $color-warning;
            cursor: pointer;
            &::after {
              content: '>';
              margin-left: 3px;
            }
          }
        }
        .funbtn-right {
          flex: 8;
          height: 100%;
        }
      }
    }
    .el-row-main {
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      .crad-left {
        width: 446px;
        height: 891px;
        pointer-events: all;
      }
      .control-center {
        flex: 1;
        display: flex;
        justify-content: space-between;
        pointer-events: all;
        height: 43px;
        .control-left {
          display: flex;
          cursor: pointer;
          .control-btn {
            display: flex;
            align-items: center;
            .control-text {
              width: 70%;
              padding-left: 35px;
              box-sizing: border-box;
            }
            .control-filter {
              height: 43px;
              width: 30%;
            }
          }
          .problemclick {
            cursor: pointer;
            background-image: url('~@/assets/iconfont/icon/iconc/5.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 43px;
            line-height: 43px;
            width: 150px;
            font-size: 16px;
            color: white;
            text-align: center;
          }
          .problemnormal {
            cursor: pointer;
            background-image: url('~@/assets/iconfont/icon/iconc/2.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 43px;
            line-height: 43px;
            text-align: center;
            font-size: 16px;
            width: 120px;
            padding-left: 20px;
            box-sizing: border-box;
          }
          .orderclick {
            cursor: pointer;
            background-image: url('~@/assets/iconfont/icon/iconc/1.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 43px;
            line-height: 43px;
            width: 150px;
            font-size: 16px;
            color: white;
            text-align: center;
          }
          .ordernormal {
            cursor: pointer;
            background-image: url('~@/assets/iconfont/icon/iconc/6.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 43px;
            line-height: 43px;
            text-align: center;
            font-size: 16px;
            width: 120px;
            padding-left: 20px;
            box-sizing: border-box;
          }
          .peopleclick {
            cursor: pointer;
            background-image: url('~@/assets/iconfont/icon/iconc/4.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 43px;
            line-height: 43px;
            width: 150px;
            font-size: 16px;
            color: white;
            text-align: center;
          }
          .peoplenormal {
            cursor: pointer;
            background-image: url('~@/assets/iconfont/icon/iconc/3.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 43px;
            line-height: 43px;
            text-align: center;
            font-size: 16px;
            width: 120px;
            padding-left: 20px;
            box-sizing: border-box;
          }
        }
      }
      .crad-right {
        pointer-events: all;
        width: 446px;
        height: 891px;
      }
    }
  }
}
.popover-content {
  .checkbox-bottom {
    margin-bottom: 8px;
  }
  .check-title {
    font-weight: 600;
    ::v-deep .el-checkbox__label {
      font-size: 18px;
    }
  }
  .filter-btn {
    display: flex;
    justify-content: space-around;
  }
  .check-content {
    margin-bottom: 15px;
  }
}
</style>
