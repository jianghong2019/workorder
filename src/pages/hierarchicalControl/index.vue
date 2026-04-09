<template>
  <div id="mapView" class="order-visual">
    <SgMap v-if="isReady" :mapconfig="mapconfig"></SgMap>
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
              :placeholder="placeholder"
              class="search-input"
              clearable
              @keyup.enter.native="handleSearch"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              <el-button slot="append" @click="handleSearch">搜索</el-button>
            </el-input>
          </div>
          <!-- 中间提示信息 -->
          <div class="message-center">
            <messageScroll @jumpPage="jumpPage"></messageScroll>
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
          <div class="crad-left" :style="leftCardStyle">
            <template v-for="card of leftCardList">
              <!-- :class="(card.is = 'WarningSituation' ? 'card-item' : '')" -->
              <component
                :is="card.is"
                :key="card.is"
                :ref="card.is"
                :org-no="form.orgNo"
                :card-id="card.is"
                :screensize.sync="fullScreen"
                @goNewPage="jumpPage"
                @cardToggle="cardToggle"
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
                  <template v-if="item.dateList">
                    <span class="date-label">{{ item.dateList.label }}</span>
                    <el-tabs v-model="item.dateList.active" type="card">
                      <el-tab-pane
                        v-for="tab of item.dateList.childList"
                        :key="tab.value"
                        :label="tab.label"
                        :name="tab.value"
                      ></el-tab-pane>
                    </el-tabs>
                  </template>
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
                    v-debounce="[() => controlClick(item)]"
                    class="control-btn"
                    :class="controlActive == item.id ? item.active : item.unactive"
                  >
                    <!--  @click="controlClick(item)" -->
                    <span class="control-text">{{ item.label }}</span>
                    <!-- 筛选图标按钮 -->
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
            <el-button v-if="areaStack.length > 1" plain @click="back">
              <img :src="require('@/assets/iconfont/icon/返回.svg')" width="15" height="15" />
              <span>返回上一级</span>
            </el-button>
          </div>
          <!-- 右侧卡片 -->
          <div class="crad-right" :style="rightCardStyle">
            <template v-for="card of rightCardList">
              <component
                :is="card.is"
                :key="card.is"
                :ref="card.is"
                :org-no="form.orgNo"
                :card-id="card.is"
                :screensize.sync="fullScreen"
                @goNewPage="jumpPage"
                @cardToggle="cardToggle"
              ></component>
            </template>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 图列说明弹框 -->
    <Reporetone ref="Reporetone"></Reporetone>
    <Reporet ref="Reporet"></Reporet>
    <el-dialog custom-class="legend-box" title="图例说明" :visible.sync="legendVisible" width="50%">
      <img class="legend-icon" src="@/assets/iconfont/icon/legend.png" />
    </el-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import { isLoaded, useMapEvents, useMapTools, sgMapInstance } from '@/composables/useMap';
import {
  mapconfig,
  funBtnList,
  routers,
  controlConfig,
  leftCardConfig,
  rightCardConfig,
} from './js/config.js';
import { useRenderPopup } from '@/composables/useMap/useRenderPopup';
import Reporet from './components/Reporet.vue';
import Reporetone from './components/Reporetone.vue';
import SgMap from '@/components/common/tools/SgMap.vue';
import WorkOrderManage from './components/WorkOrderManage.vue';
import WarningSituation from './components/WarningSituation.vue';
import PeopleSituation from './components/PeopleSituation.vue';
import ProductionFactors from './components/ProductionFactors.vue';
import WorkOrderManageNext from './components/WorkOrderManageNext.vue';
import ProblemMonitor from './components/ProblemMonitor.vue';
import ProductionFactorsSub from './components/ProductionFactorsSub.vue'; //管辖单位生产要素
import OrgTree from '@/components/common/form/OrgTree.vue';
import funButton from './components/funButton.vue'; //右侧功能按钮组件
import OrderTool from './components/OrderTool.vue'; //省市区模式图上popup-工单
import PeopleTool from './components/PeopleTool.vue'; //省市区模式图上popup-人员
import ProblemTool from './components/ProblemTool.vue'; //省市区模式图上popup-问题
import messageScroll from './components/messageScroll.vue'; // 滚动消息
import OrderTooltip from './components/OrderTooltip.vue';
import PersonTooltip from './components/PersonTooltip.vue';
import { useUnitData } from '@/composables/useUnitData.js';
import { addCountyLayer, addfinalLayer } from './js/mapUtils';
import { getSgConfig } from '@/api/common';
import API from '@/api/hierarchicalControl/firstlevel.js';
import API_work from '@/api/hierarchicalControl/workReminder.js';
import { mapState } from 'vuex';
let latestBoundaryTimestamp = 0; //记录区域边界请求的最新时间戳
let latestFinalTimestamp = 0; //记录图上点数据请求的最新时间戳
export default {
  name: 'OrderVisual',
  components: {
    Reporet,
    Reporetone,
    SgMap,
    WorkOrderManage,
    WarningSituation,
    PeopleSituation,
    ProductionFactors,
    WorkOrderManageNext,
    ProblemMonitor,
    messageScroll,
    OrgTree,
    funButton,
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
        if (this.funcType == '06') {
          // 如果是地图手动下钻到所级
          return id == '01'; //如果是区县级别，则返回所有配置项
        } else {
          // 如果不是下钻到所级，则使用本级单位、管辖单位的切换按钮来控制按钮
          return hasChildren == this.form.hasChildren; //否则只返回与form的hasChildren相同的配置项
        }
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
    //左侧卡片宽高样式
    leftCardStyle() {
      let oneToggle = this.leftCardList.some((item) => !item.toggle);
      if (oneToggle) {
        //只要有一个收起高度靠内容撑开
        return { height: 'auto' };
      } else {
        //如果没有收起的高度为父元素100%
        return { height: '100%' };
      }
    },
    //右侧卡片宽高样式
    rightCardStyle() {
      let oneToggle = this.rightCardList.some((item) => !item.toggle);
      if (oneToggle) {
        //只要有一个收起高度靠内容撑开
        return { height: 'auto' };
      } else {
        //如果没有收起的高度为父元素100%
        return { height: '100%' };
      }
    },
  },
  beforeRouteEnter(e, from, next) {
    next((vm, a) => {
      console.log('beforeRouteEnter', e, from, vm, a);
      if (vm.UserData.PEOPLE_NATURE === '01') {
        vm.$router.push('/nullAuth');
      } else {
        vm.$router.push('/hierarchicalControl');
      }
    });
  },
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
    };
  },
  data() {
    return {
      isReady: false, // 思极配置是否已经获取成功
      mapconfig: mapconfig,
      form: {
        orgNo: '', //管理单位编码
        orgName: '', //管理单位名称
        distLv: '', //管理单位层级
        hasChildren: true, //当前页面展示本级单位还是管辖单位，true：管辖单位，false:本级单位
        searchText: '', //本级时的输入框输入内容
      },
      placeholder: '',
      funBtnList: funBtnList, //右侧功能按钮
      fullScreen: true, //是否全屏，true:非全景;false:全景
      legendVisible: false, //图列说明弹框是否打开
      controlActive: '02', //选中的控件，01:全部; 02:工单; 03:人员; 04:问题 默认选中第一项
      controlConfig: controlConfig, //控件配置项
      leftCardConfig: leftCardConfig, //左侧卡片配置
      rightCardConfig: rightCardConfig, //右侧卡片配置
      removeTooltip: null, //去除悬浮框
      geoResult: {},
      funcType: this.$store.state.UserData.FUNC_TYPE, //单位级别判断
      // 省市区区域geoJson数据
      provinceGeo: {
        id: 10000,
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      // 供电所区域geoJson数据
      boundaryGeo: {
        id: 10001,
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      //供电所-工单散点数据
      finalOrderGeo: {
        id: 10002,
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      //供电所-人员散点数据
      finalPersonGeo: {
        id: 10003,
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      // 区域下钻栈
      areaStack: [],
      // 是否单位首次加载
      isFirstLoadOrg: true,
      mapPointParams: {}, //所级状态下图上数据的检索入参
    };
  },
  watch: {
    'form.hasChildren': {
      handler(val) {
        this.leftCardConfig.forEach((item) => (item.toggle = true));
        this.rightCardConfig.forEach((item) => (item.toggle = true));
        if (val) {
          //如果为管辖单位
          this.form.searchText = ''; //清空输入框内容
          //如果当前控件选择为全部，则切换至工单
          // this.controlActive == "01" ? (this.controlActive = "02") : "";
          this.controlActive = '02';
        } else {
          //如果为本级单位
          //如果当前控件选择为问题类型，则切换至全部
          // this.controlActive == "04" ? (this.controlActive = "01") : "";
          this.controlActive = '01';
        }
      },
    },
    controlActive: {
      handler(val) {
        switch (val) {
          case '01':
            this.placeholder = '请输入工单编号/人员姓名';
            break;
          case '02':
            this.placeholder = '请输入工单编号';
            break;
          case '03':
            this.placeholder = '请输入人员姓名';
            break;
          case '04':
            this.placeholder = '';
            break;
        }
      },
      immediate: true,
    },
  },
  created() {
    this.init();
    //监听窗口变化
    window.addEventListener('resize', this.echartsResize);
  },
  mounted() {
    this.getSgConfig();
    this.$watch(
      () => isLoaded.value,
      (val) => {
        console.log('监听isLoaded', val, this.orgNo);
        if (val) {
          this.getFirstOrgGeo();
          this.initsourceMap();
        }
      },
      { immediate: true }
    );
  },
  activated() {
    console.log('分级管控首页激活');
    this.echartsResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.echartsResize);
  },
  methods: {
    //页面初始化
    init() {
      // 根据登录人信息初始化管理单位树绑定数据
      this.handlerTreeSelect(this.UserData, true);
      // 获取工单、全部控件多选内容
      this.getOrderTree();
      //获取督办消息数据
      this.getMySuperviseCount();
      //获取工作提醒数据
      this.getApprovalList();
    },
    //由于此项目框架问题，用户登录后虽未打开此页面，但此页面已开始加载，导致切换到此页面时echarts大小存在问题
    //激活页面时,寻找当前展示卡片中的echarts实例对象，并手动调用resize方法改变echarts大小
    echartsResize() {
      this.$nextTick(() => {
        let elements = [...this.leftCardList, ...this.rightCardList].map((el) => el.is);
        elements.forEach((name) => {
          if (this.$refs[name][0]?.myChart) this.$refs[name][0].myChart.resize();
        });
      });
    },
    async getSgConfig() {
      try {
        const res = await getSgConfig();
        console.log(res.data);
        const res2 = null;
        this.isReady = true;
        this.mapconfig.srcSdk = res.data.resultValue.mapsrc;
        this.mapconfig.appkey = res.data.resultValue.appkey;
        this.mapconfig.appsecret = res.data.resultValue.appsecret;
      } catch (error) {
        console.log('获取地图配置失败', error);
        this.mapconfig.srcSdk = 'http://172.29.192.164:12001/maps?v=3.0.0';
        this.mapconfig.appkey = '2416909a56f03b8faa2dc01d21fc4710';
        this.mapconfig.appsecret = '6ad810cb6ee232638021d65f223642c7';
        console.log('this.mapconfig', this.mapconfig);
        this.isReady = true;
      }
    },
    // goReporet() {
    //   // console.log(11111111111111111);
    //   this.$refs.Reporet.opan();
    // },
    // 所级状态下，搜索人员/工单时，定位到对应图上位置
    async handleSearch() {
      let res = null;
      let workOrderList = [];
      let personList = [];
      if (!this.form.searchText.trim()) return;
      if (!this.mapPointParams?.orgNo) return;
      if (this.controlActive === '01') {
        res = await API.selectAll({
          ...this.mapPointParams,
          keyWord: this.form.searchText,
        });
        workOrderList = res.data?.DTS?.workOrderList ?? [];
        personList = res.data?.DTS?.personList ?? [];
      } else if (this.controlActive === '02') {
        res = await API.getWorkOrderInfo({
          ...this.mapPointParams,
          keyWord: this.form.searchText,
        });
        workOrderList = res.data?.DTS ?? [];
      } else if (this.controlActive === '03') {
        res = await API.selectPersonInfo({
          ...this.mapPointParams,
          keyWord: this.form.searchText,
        });
        personList = res.data?.DTS ?? [];
      }
      if (!workOrderList?.length && !personList?.length) {
        return this.$message.warning('未查询到相关数据');
      }
      const center = workOrderList?.length
        ? [workOrderList[0].gpsLongitude, workOrderList[0].gpsLatitude]
        : personList?.length
        ? [personList[0].longitude, personList[0].latitude]
        : [];
      if (center.length) this.flyToAsync({ center, zoom: 15 });
      // this.flyToAsync({center})
    },
    // 所级状态获取散点信息
    async getPointInfo(params) {
      let res = null;
      let workOrderList = [];
      let personList = [];
      const nowTimestamp = new Date().getTime();
      latestFinalTimestamp = nowTimestamp;
      // 切换至全部时，按工单筛选条件查询全部
      if (this.controlActive === '01') {
        res = await API.selectAll(params);
        workOrderList = res.data?.DTS?.workOrderList ?? [];
        personList = res.data?.DTS?.personList ?? [];
      } else if (this.controlActive === '02') {
        res = await API.getWorkOrderInfo(params);
        workOrderList = res.data?.DTS ?? [];
      } else if (this.controlActive === '03') {
        res = await API.selectPersonInfo(params);
        personList = res.data?.DTS ?? [];
      }
      if (nowTimestamp !== latestFinalTimestamp) return;
      const orderFeatures =
        workOrderList?.map((r) => {
          return {
            type: 'Feature',
            properties: {
              ...r,
              name: r.spare1,
              id: r.recordId,
              // 添加自定义的popup类型，控制鼠标点击图上要素时显示工单还是人员卡片
              popupType: 1,
            },
            geometry: {
              type: 'Point',
              coordinates: [r.gpsLongitude, r.gpsLatitude],
            },
          };
        }) ?? [];
      const personFeatures =
        personList?.map((r) => {
          return {
            type: 'Feature',
            properties: {
              ...r,
              name: r.name,
              id: r.recordId,
              // 添加自定义的popup类型，控制鼠标点击图上要素时显示工单还是人员卡片
              popupType: 2,
            },
            geometry: {
              type: 'Point',
              coordinates: [r.longitude, r.latitude],
            },
          };
        }) ?? [];
      // 展示所级-工单数据源
      this.finalOrderGeo.data = {
        type: 'FeatureCollection',
        features: orderFeatures,
      };
      // 展示所级-人员数据源
      this.finalPersonGeo.data = {
        type: 'FeatureCollection',
        features: personFeatures,
      };
      this.changeFinalLayerSource();
      console.log('this.boundaryGeo.data', this.boundaryGeo.data);

      this.fitBounds(this.boundaryGeo.data?.features);
      return res;
    },
    // 工单选择确定
    async workOrder({ item, close, orgId }) {
      //close：是否关闭控件气泡弹框；true：关闭；false:保持当前状态
      // 获取选择的工单类型
      console.log(item.checkList, 'item.checkList');
      close ? (item.filter = false) : '';
      let businessTypeCode =
        item.checkList
          ?.reduce((arr, el) => {
            return arr.concat(el.checkeds);
          }, [])
          ?.join(',') ?? '';
      let otherType = item.checkList.find((item) => item.codeValue == '9999')?.checkAll ? '1' : ''; //1:勾选了其它类型；空字符串未勾选
      const orgNo = orgId ?? this.areaStack[this.areaStack.length - 1]?.adcode;
      if (!orgNo) {
        console.log('workOrder===>', orgNo);
        return;
      }
      let params = {
        orgNo,
        businessTypeCode,
        otherType, //其它类型
      };

      if (this.funcType === '06') {
        this.mapPointParams = params;
        await this.getPointInfo(params);
        // close ? (item.filter = false) : "";
        return;
      }
      const nowTimestamp = new Date().getTime();
      latestFinalTimestamp = nowTimestamp;
      let res = await API.getWorkOrderStats(params);
      if (nowTimestamp !== latestFinalTimestamp) return;
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.provinceGeo.data.features?.forEach((itemB) => {
          const matched = DTS.find((itemA) => itemA.orgNo == itemB.properties.adcode);
          console.log('getWorkOrderStats-matched===>', matched);

          if (matched) {
            Object.assign(itemB.properties, {
              unprocessedCount: matched.unprocessedCount,
              dispatchedCount: matched.dispatchedCount,
              unDispatchCount: matched.unDispatchCount,
              total: matched.unprocessedCount,
            });
          }
        });
        this.changeLayerSource(this.provinceGeo.data);
      } else {
        this.$message.error(RT_D);
      }
      // close ? (item.filter = false) : "";
    },
    // 人员选择确定
    async personNature({ item, close, orgId }) {
      console.log('peopleChoose===>', orgId, this.areaStack);
      close ? (item.filter = false) : '';
      let personNature = item.checkList
        .reduce((arr, el) => {
          return arr.concat(el.checkeds);
        }, [])
        .join(',');
      const orgNo = orgId ?? this.areaStack[this.areaStack.length - 1]?.adcode;
      if (!orgNo) {
        console.log('personNature===>', orgNo);
        return;
      }
      let params = {
        orgNo,
        personNature,
      };
      if (this.funcType === '06') {
        this.mapPointParams = params;
        await this.getPointInfo(params);
        // close ? (item.filter = false) : "";
        return;
      }
      const nowTimestamp = new Date().getTime();
      latestFinalTimestamp = nowTimestamp;
      let res = await API.getPersonStats(params);
      if (nowTimestamp !== latestFinalTimestamp) return;
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        // close ? (item.filter = false) : "";
        this.provinceGeo.data.features?.forEach((itemB) => {
          const matched = DTS.find((itemA) => itemA.orgNo == itemB.properties.adcode);
          if (matched) {
            Object.assign(itemB.properties, {
              workCount: matched.workCount,
              mainCount: matched.mainCount,
              outCount: matched.outCount,
              total: matched.mainCount + matched.outCount,
            });
          }
        });
        this.changeLayerSource(this.provinceGeo.data);
      } else {
        this.$message.error(RT_D);
      }
    },
    // 问题选择确定
    async questionType({ item, close, orgId }) {
      close ? (item.filter = false) : '';
      if (this.funcType === '06') return;
      const orgNo = orgId ?? this.areaStack[this.areaStack.length - 1]?.adcode;
      if (!orgNo) {
        console.log('questionType===>', orgNo);
        return;
      }
      let problemType = item.checkList
        .reduce((arr, el) => {
          return arr.concat(el.checkeds);
        }, [])
        .join(',');
      let params = {
        orgNo,
        problemType,
        dateRange: item.dateList.active,
      };
      const nowTimestamp = new Date().getTime();
      latestFinalTimestamp = nowTimestamp;
      let res = await API.getProblemStats(params);
      if (nowTimestamp !== latestFinalTimestamp) return;
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        // close ? (item.filter = false) : "";
        this.provinceGeo.data.features?.forEach((itemB) => {
          const matched = DTS.find((itemA) => itemA.orgNo == itemB.properties.adcode);
          console.log('matched===>', matched);

          if (matched) {
            Object.assign(itemB.properties, {
              qualityProblemCount: matched.qualityProblemCount,
              riskProblemCount: matched.riskProblemCount,
              total: matched.qualityProblemCount + matched.riskProblemCount,
            });
          }
        });
        this.changeLayerSource(this.provinceGeo.data);
      } else {
        this.$message.error(RT_D);
      }
    },
    // 获取工单类型
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
      let { DTS, RT_F } = res.data;
      if (RT_F !== 1) return;
      this.funBtnList.forEach((item) => {
        if (item.id == 'surpervision') item.value = DTS || 0;
      });
    },
    //获取工作提醒消息数据
    getApprovalList() {
      //00:未处理
      API_work.getApprovalList({}).then((res) => {
        let { DTS, RT_F } = res.data;
        if (RT_F !== 1) return;
        this.funBtnList.forEach((item) => {
          if (item.id == 'workReminder') item.value = DTS[item.prop] || 0;
        });
      });
    },

    //模式切换分为本级单位、管辖单位两种模式
    modeClick() {
      this.form.hasChildren = !this.form.hasChildren;
      // 组织机构侧切换，清空历史栈
      this.areaStack = [];
      this.getBoundary({ orgNo: this.form.orgNo });
    },
    //返回上级按钮点击事件
    back() {
      console.log('返回上一级====>', this.areaStack);
      if (this.areaStack?.length === 1) return;
      // 删除当前栈
      this.areaStack.pop();
      // 获取areaStack上一层级的orgNo,然后重置地图数据源
      const adcode = this.areaStack[this.areaStack.length - 1]?.adcode;
      this.layerClick({ adcode }, true);
    },
    //管理单位树选择事件
    /**
     * @description: 树选择事件
     * @param {object} data 选择的行数据
     * @param {boolean} isInitial 是否是初始化
     */
    handlerTreeSelect(data, isInitial = false) {
      let { FUNC_TYPE: distLv, orgId: orgNo, name: orgName } = data;
      data = { ...data, distLv, orgNo, orgName };
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key];
      });
      //层级06无下级单位，否则有下级单位
      if (distLv == '06') {
        this.form.hasChildren = false;
        this.controlActive = '01';
      } else {
        this.form.hasChildren = true;
        this.controlActive = '02';
      }
      this.funcType = distLv;
      // 组织机构侧切换，清空历史栈
      this.areaStack = [];
      console.log('handlerTreeSelect===>', data);
      // 37101模拟，后期删除
      !isInitial && this.getBoundary({ orgNo });
      // !isInitial && this.getBoundary({orgNo:'37101'})
    },
    // 省市区模式下获取工单/人员/问题数量
    async getOrderPersonProblemCount(orgId) {
      let item = this.controlList.find((el) => el.id == this.controlActive);
      switch (this.controlActive) {
        case '02':
          this.workOrder({ item, orgId });
          break;
        case '03':
          this.personNature({ item, orgId });
          break;
        case '04':
          this.questionType({ item, orgId });
          break;
        case '01':
          this.workOrder({ item, orgId });
          break;
        default:
          break;
      }
    },
    // 加载边界数据
    /**
     *
     * @param params {orgNo}
     * @param isBack 是否是返回上一级
     */
    async getBoundary(params, isBack = false) {
      const nowTimnestamp = new Date().getTime();
      latestBoundaryTimestamp = nowTimnestamp;
      const res = await API.getCurrentOrgGeo({
        ...params,
        isCurrentLevel: this.form.hasChildren ? '0' : '1',
      }).catch((err) => {
        console.log(err);
        // 清空省市区级别图层数据源
        this.changeLayerSource({
          type: 'FeatureCollection',
          features: [],
        });
        // 清空所级数据源
        this.finalOrderGeo.data = {
          type: 'FeatureCollection',
          features: [],
        };
        this.finalPersonGeo.data = {
          type: 'FeatureCollection',
          features: [],
        };
        this.changeFinalLayerSource({
          type: 'FeatureCollection',
          features: [],
        });
      });
      if (nowTimnestamp !== latestBoundaryTimestamp) return;
      console.log(`getBoundary，最终加载${params.orgNo}`);

      const targetGeo = {
        type: 'FeatureCollection',
        features: [],
      };
      if (res.data?.DTS?.geoJson?.features?.length) {
        targetGeo.features = res.data?.DTS?.geoJson?.features;
      } else {
        return this.$message.error('未获取到边界数据');
      }
      this.provinceGeo.data = targetGeo;
      // 目前返回值是03，先写死06
      this.funcType =
        res.data?.DTS?.funcType === '06' || !this.form.hasChildren ? '06' : res.data?.DTS?.funcType;
      // this.funcType = res.data?.DTS?.funcType === "03" || !this.form.hasChildren ? "06" : res.data?.DTS?.funcType;
      // isBack-是否为返回，若是返回则不添加历史记录栈
      !isBack &&
        this.areaStack.push({
          adcode: params.orgNo,
          FUNC_TYPE: this.funcType,
        });
      console.log('获取this.areaStack===>', this.areaStack);
      if (this.funcType == '06') {
        // 清空省市区级别图层数据源，后续需要展示所级图层数据
        this.changeLayerSource({
          type: 'FeatureCollection',
          features: [],
        });
        // 渲染所级图层区域数据
        this.changeFinalLayerSource(targetGeo);
        this.boundaryGeo.data = targetGeo;
        // 省市区切换至所前选中的是问‘题’，下钻到所时切换为全部（所级没有问题选项）
        if (this.controlActive === '04') this.controlActive = '01';
      } else {
        // 清空所级图层数据源，后续需要展示省市区级别图层数据
        this.changeLayerSource(targetGeo);
        // 清空所级数据源
        this.finalOrderGeo.data = {
          type: 'FeatureCollection',
          features: [],
        };
        this.finalPersonGeo.data = {
          type: 'FeatureCollection',
          features: [],
        };
        this.changeFinalLayerSource({
          type: 'FeatureCollection',
          features: [],
        });
        // 所级切换至省市区时，选中的是‘全部’，切换时切换为‘问题’（省级没有全部选项）
        if (this.controlActive === '01') this.controlActive = '04';
      }
      // 渲染图上数据点
      this.getOrderPersonProblemCount(params.orgNo);
    },
    /**
     * @description 图上数据点的点击事件，默认情况isBack为false-非返回
     * @param properties 图上区域的额外数据，包含adcode
     * @param isBack 是否为返回上一级
     */
    async layerClick(properties, isBack = false) {
      console.log('layerClick===>', properties);
      let params = {
        // orgNo: "37401",
        orgNo: properties.adcode,
      };
      this.getBoundary(params, isBack);
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
        const lngLat = ref(center);
        // 暴漏销毁方法，调用可销毁popup
        if (this.controlActive == '02') {
          const { remove } = useRenderPopup(OrderTool, lngLat, [40, 100], {
            props: {
              name: data.name,
              unprocessedCount: data.unprocessedCount || 0,
              dispatchedCount: data.dispatchedCount || 0,
              unDispatchCount: data.unDispatchCount || 0,
            },
          });
          this.removeTooltip = remove;
        } else if (this.controlActive == '03') {
          const { remove } = useRenderPopup(PeopleTool, lngLat, [40, 100], {
            props: {
              name: data.name,
              workCount: data.workCount || 0,
              mainCount: data.mainCount || 0,
              outCount: data.outCount || 0,
            },
          });
          this.removeTooltip = remove;
        } else if (this.controlActive == '04') {
          const { remove } = useRenderPopup(ProblemTool, lngLat, [40, 100], {
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
    /**
     * @description: 所级图层点击事件
     * @param {*} data 悬浮点所在区域的properties数据，可以从中拿取点击要素的数据请求详情
     * @param {*} isClose 是否为销毁弹窗 true为销毁，false为创建
     */
    finaLayerClick({ data, isClose }) {
      if (!isClose) {
        Object.keys(data)?.forEach((key) => {
          if (data[key] === 'null') {
            data[key] = null;
          } else if (data[key] === 'undefined') {
            data[key] = undefined;
          } else if (data[key] === '') {
            data[key] = null; // 空字符串也可以转为 null
          }
        });
        console.log('finaLayerClick====>', data);
        // 弹出前先销毁popup，防止图上出现多个
        this.removeToolPopup && this.removeToolPopup();
        let center = [];
        let component = null;
        if (data.popupType == 1) {
          if (!data.gpsLongitude || !data.gpsLatitude) return;
          center = [data.gpsLongitude, data.gpsLatitude];
          component = OrderTooltip;
        } else if (data.popupType == 2) {
          if (!data.longitude || !data.latitude) return;
          center = [data.longitude, data.latitude];
          component = PersonTooltip;
        }
        // 暴漏销毁方法，调用可销毁popup
        const lngLat = ref(center);
        const { remove } = useRenderPopup(component, lngLat, [40, 100], {
          props: {
            data,
          },
          on: {
            // 子组件暴露出关闭弹窗的方法
            close: () => {
              this.removeToolPopup && this.removeToolPopup();
              this.removeToolPopup = null;
            },
          },
        });
        this.removeToolPopup = remove;
      } else {
        this.removeToolPopup && this.removeToolPopup();
        this.removeToolPopup = null;
      }
    },
    initsourceMap() {
      // const mymap = sgMapInstance.value;
      // const geoJson = {
      //   value: {
      //     data: this.geoResult,
      //     id: 100000,
      //   },
      // };
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
      const { load, changeLayerSource, destory } = addCountyLayer(this.provinceGeo, {
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
        toggleLayer,
      } = addfinalLayer(
        this.boundaryGeo,
        {
          finalOrderGeo: this.finalOrderGeo,
          finalPersonGeo: this.finalPersonGeo,
        },
        {
          layerClick: this.finaLayerClick,
          layerPointHover: this.finalLayerPointHover,
        }
      );
      this.changeFinalLayerSource = changeFinalLayerSource;
      this.reloadFinalLayer = loadFinal;
      this.destoryFinalLayer = destoryFinal;
      this.toggleLayer = toggleLayer;
      const { flyToAsync } = useMapEvents(sgMapInstance);
      this.flyToAsync = flyToAsync;
      const { fitBounds } = useMapTools();
      this.fitBounds = fitBounds;
    },
    // 初始化时查询单位范围
    async getFirstOrgGeo() {
      let params = {
        // orgNo: "37101",
        orgNo: this.$store.state.UserData.orgId,
      };
      this.getBoundary(params);
      return;
      // let res = await API.getCurrentOrgGeo(params);
      // let { DTS, RT_F, RT_D } = res.data;
      // this.areaStack.push({ adcode: params.orgNo, FUNC_TYPE: this.funcType });
      // if (RT_F == 1 && DTS) {
      //   if (DTS?.funcType === "01" || DTS?.funcType === "02") {
      //     this.provinceGeo.data = DTS.geoJson;
      //     this.changeLayerSource(this.provinceGeo.data);
      //     this.getOrderPersonProblemCount(params.orgNo);
      //   } else {
      //     this.boundaryGeo.data = DTS.geoJson;
      //     const orderFeatures = [
      //       {
      //         type: "Feature",
      //         properties: {
      //           name: "电",
      //           id: 100801,
      //         },
      //         geometry: {
      //           type: "Point",
      //           coordinates: [118.74886210873177, 31.973794707067952],
      //         },
      //       },
      //       {
      //         type: "Feature",
      //         properties: {
      //           name: "采",
      //           id: 100802,
      //         },
      //         geometry: {
      //           type: "Point",
      //           coordinates: [118.7538988441629, 31.95955155490489],
      //         },
      //       },
      //     ];
      //     // 展示所级数据源
      //     this.finalOrderGeo.data = {
      //       type: "FeatureCollection",
      //       features: orderFeatures,
      //     };
      //     this.finalPersonGeo.data = {
      //       type: "FeatureCollection",
      //       features: personFeatures,
      //     };
      //     this.changeFinalLayerSource(this.boundaryGeo.data);
      //   }

      //   console.log("getCurrentOrgGeo geoResult====>", this.geoResult);
      // }
    },
    //报告生成
    report() {
      // console.log("报告生成");
      // this.$refs.Reporet.opan(this.form.orgNo);
      if (this.form.hasChildren) {
        // this.$refs.Reporetone.opan(this.form.orgNo);
        this.$refs.Reporet.opan(this.form.orgNo);
      } else {
        this.$refs.Reporetone.opan(this.form.orgNo);
      }
    },
    //页面跳转
    jumpPage(data, dateType) {
      let { id, tabsIndex, dateRange } = data;
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
        tabsIndex: tabsIndex || '', //物资01；车辆02；工器具03；设备04；票卡单05；
        timeData: [beginTime, endTime],
      };
      if (dateRange) params.dateRange = dateRange; //本周05；本月02；本年04；本日01；
      console.log(params, 'paramsparamsparams');
      //路由跳转并携带参数
      this.$router.push({ path: routers[id], query: params });
    },

    // 时间范围获取函数
    getDateRangeByType(dateType) {
      if (!dateType) return { beginTime: '', endTime: '' };
      const now = this.$moment();
      // 获取当前季度
      const getQuarter = (momentDate) => {
        return Math.floor(momentDate.month() / 3) + 1;
      };
      const dateconfig = {
        '01': { start: 'day', end: 'day' }, // 本日
        '02': { start: 'month', end: 'month' }, // 本月
        '03': 'quarter', // 本季
        '04': { start: 'year', end: 'year' }, // 本年
        '05': { start: 'week', end: 'week' }, // 本周
      };

      const config = dateconfig[dateType] || dateconfig['04'];

      if (dateType === '03') {
        // 处理季度逻辑
        const currentQuarter = getQuarter(now);
        const quarterStartMonth = (currentQuarter - 1) * 3;
        const quarterEndMonth = quarterStartMonth + 2;

        return {
          beginTime: now.clone().month(quarterStartMonth).startOf('month').format('YYYY-MM-DD'),
          endTime: now.clone().month(quarterEndMonth).endOf('month').format('YYYY-MM-DD'),
        };
      }

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
      if (this.fullScreen) {
        this.leftCardConfig.forEach((item) => (item.toggle = true));
        this.rightCardConfig.forEach((item) => (item.toggle = true));
      } else {
        this.leftCardConfig.forEach((item) => (item.toggle = false));
        this.rightCardConfig.forEach((item) => (item.toggle = false));
      }
    },
    //地图中间控件按钮点击事件
    controlClick(item) {
      let { id, event } = item;
      console.log('控件点击事件', item);
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
    //设置左右两侧卡片是否有收起的
    cardToggle(data) {
      let { type, toggle, is } = data;
      this[type].forEach((item) => {
        if (item.is == is) item.toggle = toggle;
      });
    },
  },
};
</script>
<style lang="scss">
.order-visual {
  .sgmap-map {
    .sgmap-popup {
      .sgmap-popup-tip {
        border: none;
      }
      .sgmap-popup-content {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        // background: transparent;
      }
    }
  }
}
</style>
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
    padding: 0 8px;
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
          .vue-treeselect__control {
            box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
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
            box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
          }
          .search-input {
            width: 230px;
            margin-left: 22px;
            .el-input__inner {
              box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
              padding-right: 0;
              padding-left: 20px;
            }
            .el-input-group__append {
              background-color: #009b83;
              color: #fff;
              height: 30px;
              line-height: 30px;
              padding: 0 12px;
              border-color: #c0c4cc;
            }
          }
        }
        .message-center {
          flex: 8;
        }
        .funbtn-right {
          flex: 8;
          height: 100%;
        }
      }
    }
    .el-main {
      overflow: hidden;
    }
    .el-row-main {
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
      .crad-left {
        // width: 446px;
        // height: 891px;
        flex-shrink: 0;
        pointer-events: all;
        overflow-y: auto;
        overflow-x: hidden;
        .el-container:last-child {
          margin-top: 12px;
        }
      }
      .control-center {
        flex: 1;
        display: flex;
        justify-content: space-between;
        pointer-events: all;
        height: 43px;
        padding: 0 8px;
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
        flex-shrink: 0;
        pointer-events: all;
        // width: 446px;
        // height: 891px;
        overflow-y: auto;
      }
    }
  }
}
.popover-content {
  .date-label {
    font-weight: 600;
    font-size: 18px;
    color: #009b83;
  }
  ::v-deep .el-tabs {
    margin-bottom: 20px;
    .el-tabs__header {
      margin: 12px 0 0 0;
      border: none;
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        line-height: 20px;
        background-color: #eee;
        padding: 0 1px;
      }
      .el-tabs__nav {
        border: none;
        .el-tabs__item {
          border: none;
          height: 20px;
          line-height: 20px;
          background: #eee;
          margin: 0 4.5px;
          border-radius: 4px;
        }
        .is-active {
          background-color: #ccf8e8;
        }
      }
    }
  }
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
.legend-box {
  height: 85%;
  .el-dialog__body {
    text-align: center;
    .legend-icon {
      width: 100%;
    }
  }
}
</style>
