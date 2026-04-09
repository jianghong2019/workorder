<template>
  <div class="new-safeweb-web">
    <!-- 下级单位工单管理组件 -->
    <div v-show="isCollapsed1" class="work-order-card" shadow="never">
      <!-- title部分 -->
      <div class="card-header">
        <span class="card-title"
          >工单管理
          <div :class="'arrow-down'" class="card-arrow" @click="toggleCollapse"></div
        ></span>

        <div class="header-right">
          <el-button-group class="date-selector">
            <el-button
              v-for="item in dateOptions"
              :key="item.value"
              :class="['date-btn', { active: selectedDate === item.value }]"
              size="small"
              @click="selectedDate = item.value"
            >
              {{ item.label }}
            </el-button>
          </el-button-group>
          <span class="more" @click="goNewPage('order')">更多</span>
        </div>
      </div>
      <!-- 内容 -->
      <div class="card-body">
        <!-- 工单情况 -->
        <div class="section1">
          <div class="titleContainer">
            <img src="@/assets/iconfont/icon/二级标题右.svg" alt="baobiao" width="20" height="20" />
            <div class="title-box">
              <span class="title-text">工单情况</span>
            </div>
          </div>
          <div class="sectionFirst">
            <div class="total">
              <!-- <img
                src="@/assets/iconfont/icon/工单总数.svg"
                alt="baobiao"
                width="77"
                height="77"
              /> -->
              <div>
                <div class="linenum">{{ totalCount }}<span class="danwei">条</span></div>
                <div class="linetext">待办总数</div>
              </div>
            </div>
            <div class="fiveLine">
              <img
                src="@/assets/iconfont/icon/已派工柱.svg"
                alt="baobiao"
                width="20"
                height="45px"
                style="margin-right: 10px"
              />
              <div>
                <div class="linenum">{{ dispatchedCount }}<span class="danwei">条</span></div>
                <div class="linetext">已派工</div>
              </div>
            </div>
            <div class="fiveLine">
              <img
                src="@/assets/iconfont/icon/未派工柱.svg"
                alt="baobiao"
                width="20"
                height="45px"
                style="margin-right: 10px"
              />
              <div>
                <div class="linenum3">{{ pendingDispatchCount }}<span class="danwei">条</span></div>
                <div class="linetext">未派工</div>
              </div>
            </div>
          </div>
          <div class="sectionFirst">
            <div class="twoLine">
              <div class="linetext">
                <img
                  src="@/assets/iconfont/icon/路径.svg"
                  alt="baobiao"
                  width="15"
                  height="15"
                />&nbsp; 工单完成数
              </div>
              <div class="linenum">{{ completedCount }}<span class="danwei">条</span></div>
            </div>
            <div class="threeLine">
              <div class="linetext">
                <img
                  src="@/assets/iconfont/icon/及时处理沙漏.svg"
                  alt="baobiao"
                  width="15"
                  height="15"
                />&nbsp; <span>及时处理数</span>
              </div>
              <div class="linenum">{{ timelyProcessedCount }}<span class="danwei">条</span></div>
            </div>
          </div>
        </div>
        <!-- 工单指标 -->
        <div v-loading="riskLoading" class="section2">
          <div class="tablebox">
            <img src="@/assets/iconfont/icon/二级标题右.svg" alt="baobiao" width="20" height="20" />
            <div class="newcontainer">
              <div class="titleContainer">
                <div class="title-box">
                  <span class="title-text">工单指标</span>
                </div>
              </div>
              <div class="funcontainer">
                <el-breadcrumb separator="|">
                  <el-breadcrumb-item
                    ><span
                      class="tab-text"
                      :class="{ 'tab-active': oneName == '01' }"
                      @click="handleOne('01')"
                      >环比</span
                    ></el-breadcrumb-item
                  >
                  <el-breadcrumb-item
                    ><span
                      class="tab-text"
                      :class="{ 'tab-active': oneName == '02' }"
                      @click="handleOne('02')"
                      >同比</span
                    ></el-breadcrumb-item
                  >
                </el-breadcrumb>
                <!-- <el-tabs
                class="tabsgroup"
                type="card"
                v-model="oneName"
                @tab-click="handleOne"
              >
                <el-tab-pane label="环比" name="01"></el-tab-pane>
                <el-tab-pane label="同比" name="02"></el-tab-pane>
              </el-tabs> -->
                <el-popover placement="bottom-end" title="" width="100" trigger="click">
                  <el-checkbox-group v-model="checkList" style="width: 100px; margin: 0 auto">
                    <el-checkbox
                      v-for="item in checkOptions"
                      :key="item"
                      :label="item"
                      :disabled="isDisabled(item)"
                    >
                      {{ item }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <i slot="reference" class="el-icon-circle-plus-outline iconstyle"></i>
                </el-popover>
              </div>
            </div>
          </div>

          <div class="indeicator">
            <div v-for="item in workOrder" :key="item.label" class="stat-item">
              <div class="stat-number">
                {{ item.value }}
                <span class="percent">%</span>
              </div>
              <img
                src="@/assets/iconfont/icon/工单指标图标.svg"
                alt="baobiao"
                width="100%"
                height="20"
              />
              <div class="stat-label">{{ item.label }}</div>
              <div :class="['stat-change', item.trend === 'up' ? 'green' : 'red']">
                <span>{{ acname }}</span>
                <img v-if="item.trend === 'up'" src="@/assets/iconfont/icon/icon-up.png" alt="" />
                <img v-else src="@/assets/iconfont/icon/icon-down.png" alt="" />
                <!-- <i
                  :class="
                    item.trend === 'up'
                      ? 'el-icon-arrow-up'
                      : 'el-icon-arrow-down'
                  "
                ></i> -->
                {{ item.change }}
              </div>
            </div>
          </div>
        </div>
        <!-- 成效比对 -->
        <div v-loading="qualityLoading" class="section3">
          <div class="tablebox">
            <img src="@/assets/iconfont/icon/二级标题右.svg" alt="baobiao" width="20" height="20" />
            <div class="newcontainer">
              <div class="titleContainer">
                <div class="title-box">
                  <span class="title-text">成效对比</span>
                </div>
              </div>
              <div class="funcontainer">
                <el-breadcrumb separator="|">
                  <el-breadcrumb-item
                    ><span
                      class="tab-text"
                      :class="{ 'tab-active': activeName == '01' }"
                      @click="handleClick('01')"
                      >工单生成量</span
                    ></el-breadcrumb-item
                  >
                  <el-breadcrumb-item
                    ><span
                      class="tab-text"
                      :class="{ 'tab-active': activeName == '02' }"
                      @click="handleClick('02')"
                      >工单直派率</span
                    ></el-breadcrumb-item
                  >
                  <el-breadcrumb-item
                    ><span
                      class="tab-text"
                      :class="{ 'tab-active': activeName == '03' }"
                      @click="handleClick('03')"
                      >工单及时率</span
                    ></el-breadcrumb-item
                  >
                </el-breadcrumb>
                <!-- <el-tabs
                class="tabsgroup"
                type="card"
                v-model="activeName"
                @tab-click="handleClick"
              >
                <el-tab-pane label="工单生成量" name="01"></el-tab-pane>
                <el-tab-pane label="工单直派率" name="02"></el-tab-pane>
                <el-tab-pane label="工单及时率" name="03"></el-tab-pane>
              </el-tabs> -->
              </div>
            </div>
          </div>
          <div v-if="xData.length" id="chengxiao"></div>
          <el-empty v-else description="暂无数据" class="chengxiao-empty"></el-empty>
        </div>
        <!-- 管辖单位指标情况 -->
        <div class="section4">
          <!-- style="width: 200px; overflow: auto" 管理单位指标情况
        工单完成率 工单直派率 工单及时率 工单超期率-->
          <div class="newcontainer">
            <div class="titleContainer">
              <img
                src="@/assets/iconfont/icon/二级标题右.svg"
                alt="baobiao"
                width="20"
                height="20"
              />
              <div class="title-box">
                <span class="title-text">管辖单位指标情况</span>
              </div>
            </div>
            <div class="funcontainer">
              <el-tabs
                v-model="fourName"
                class="tabsgroup"
                type="card"
                style="width: 200px; overflow: auto"
                @tab-click="handlefour"
              >
                <el-tab-pane label="工单完成率" name="05"></el-tab-pane>
                <el-tab-pane label="工单直派率" name="02"></el-tab-pane>
                <el-tab-pane label="工单及时率" name="03"></el-tab-pane>
                <el-tab-pane label="工单超期率" name="04"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="from">
            <div class="tabTitle">
              <div style="width: 32%">序号</div>
              <div style="width: 32%">单位</div>
              <div style="width: 32%">{{ fourtitle }}</div>
            </div>
            <div class="tabContentContainer">
              <div v-for="(item, index) in groupByOrgArray" :key="index" class="tabContent">
                <div style="width: 32%">{{ index + 1 }}</div>
                <div :title="item.orgName" style="width: 32%" class="table-column">
                  {{ item.orgName }}
                </div>
                <div style="width: 32%">{{ item.metricsRate }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isCollapsed2" class="mincard">
      <div>工</div>
      <div>单</div>
      <div>管</div>
      <div>理</div>
      <div class="card-arrow" @click="toggleCollapse"></div>
    </div>
  </div>
</template>

<script>
import API from '@/api/hierarchicalControl/secondlevel.js';
import { getUserOrgInfo } from '@/api/common/index.js';
import * as echarts from 'echarts';
export default {
  name: 'WorkOrderManageNext',
  props: {
    orgNo: {
      type: String,
      default: '',
    },
    screensize: {
      type: Boolean,
      default: true,
    },
    cardId: {
      type: String,
    },
  },
  data() {
    return {
      qualityLoading: false, //成效对比loading状态
      riskLoading: false, //指标loading状态
      acname: '环比',
      checkList: ['工单直派率', '工单完成率', '工单及时率', '工单超期率'], // 默认工单指标配置
      checkOptions: [
        '工单直派率',
        '工单完成率',
        '工单及时率',
        '工单超期率',
        '工单复发率',
        '工单规范率',
      ], //配置项
      groupByOrgArray: [], //管辖单位指标数组
      activeName: '01',
      oneName: '01',
      fourName: '05',
      fourtitle: '工单完成率', //管辖单位表头名
      isCollapsed1: true,
      isCollapsed2: false,
      selectedDate: '01',
      totalCount: 0, //工单总数
      dispatchedCount: 0, //已派工
      pendingDispatchCount: 0, //未派工
      completedCount: 0, //工单完成数
      timelyProcessedCount: 0, //及时处理数
      dateOptions: [
        { label: '今日', value: '01' },
        { label: '本月', value: '02' },
        { label: '本年', value: '04' },
      ],
      orderOptions: [
        { label: '工单生成量', value: 'today' },
        { label: '工单直派率', value: 'month' },
        { label: '工单生成率', value: 'year' },
      ],
      // 工单指标展示
      workOrder: [],
      workOrderGenStats: [],
      workOrderGenStatsAll: [
        { label: '工单直派率', value: '0', trend: 'up', change: '0%' },
        { label: '工单完成率', value: '0', trend: 'down', change: '0%' },
        { label: '工单及时率', value: '0', trend: 'up', change: '0%' },
        { label: '工单超期率', value: '0', trend: 'down', change: '0%' },
      ],
      xData: [], //成效对比x轴的数据
      valuesorder: [], //成效对比y轴的数据
      valuesrate: [], //成效对比y轴的数据
      averages: '', //平均值
      avgname: '近30天平均生成量', //平均值名称
      yname: '单位(个)', //平均值名称
      judgeavg: true,
      labelname: '工单生成量',
      myChart: null,
    };
  },
  computed: {},
  watch: {
    checkList: {
      // deep:true,
      handler(newVal) {
        // console.log(111111, newVal);
        // this.checkList = newVal
        let workOrder = [];
        if (this.oneName === '01') {
          workOrder = this.workOrderGenStats.filter((item) => newVal.includes(item.label));
        } else {
          workOrder = this.workOrderGenStatsAll.filter((item) => newVal.includes(item.label));
        }
        this.workOrder = workOrder;
        // console.log(222222, this.workOrder);
      },
    },
    orgNo(newVal) {
      this.getGroupByOrg();
      this.goGetstats();
      this.goGetquota();
      this.getIndicatorStats();
    },
    screensize(newVal) {
      if (newVal === true) {
        this.isCollapsed1 = true;
        this.isCollapsed2 = false;
      } else {
        this.isCollapsed1 = false;
        this.isCollapsed2 = true;
      }
    },
    selectedDate(newVal) {
      this.goGetstats();
      this.getGroupByOrg();
      this.goGetquota();
      if (newVal === '01') {
        this.avgname = '近30天平均生成量';
        this.getIndicatorStats();
      } else if (newVal === '02') {
        this.avgname = '近6个月平均生成量';
        this.getIndicatorStats();
      } else {
        this.avgname = '近3年平均生成量';
        this.getIndicatorStats();
      }
    },
  },
  mounted() {
    this.getGroupByOrg();
    this.goGetstats();
    this.goGetquota();
    this.getIndicatorStats();
  },
  methods: {
    // 数字超过1万百万千万转换
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      } else {
        return num;
      }
      return num;
    },
    handleClick(tab, event) {
      this.activeName = tab;
      if (tab === '01') {
        this.yname = '单位(个)';
        this.labelname = '工单生成量';
        this.judgeavg = true;
        this.getIndicatorStats();
      } else if (tab === '02') {
        this.yname = '单位(%)';
        this.labelname = '工单直派率';
        this.judgeavg = false;
        this.getIndicatorStats();
      } else {
        this.yname = '单位(%)';
        this.labelname = '工单及时率';
        this.judgeavg = false;
        this.getIndicatorStats();
      }
    },
    // 环比同比切换
    handleOne(tab, event) {
      this.oneName = tab;
      if (tab === '01') {
        this.acname = '环比';
      } else {
        this.acname = '同比';
      }
      this.changelis();
      // this.goGetquota();
      // if(tab.name==="01"){
      //   this.oneName
      // }
    },
    // 管辖单位指标情况切换
    handlefour(tab, event) {
      if (tab.name === '05') {
        this.fourtitle = '工单完成率';
      } else if (tab.name === '02') {
        this.fourtitle = '工单直派率';
      } else if (tab.name === '03') {
        this.fourtitle = '工单及时率';
      } else if (tab.name === '04') {
        this.fourtitle = '工单超期率';
      }
      this.getGroupByOrg();
    },
    // 卡片折叠
    toggleCollapse() {
      this.isCollapsed1 = !this.isCollapsed1;
      this.isCollapsed2 = !this.isCollapsed2;
      this.$emit('cardToggle', {
        type: 'leftCardConfig',
        toggle: this.isCollapsed1,
        is: this.cardId,
      });
    },
    // 成效对比折线图
    getChengXiao() {
      var chartDom = document.getElementById('chengxiao');
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(chartDom);
      let attr = this.activeName == '01' ? '个' : '%';
      console.log(attr);

      var option = {
        tooltip: {
          trigger: 'axis',
          formatter:
            // '{c}'+attr
            function (params) {
              var relVal = params[0].name;
              for (var i = 0, l = params.length; i < l; i++) {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  ' : ' +
                  params[i].value +
                  attr;
              }
              return relVal;
            },
        },
        legend: {
          top: 0,
          data: this.activeName === '01' ? ['工单生成量', '平均值'] : [this.labelname],
        },
        grid: {
          top: 30,
          bottom: 25,
          left: 10,
          right: 20,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          // boundaryGap: false,
          data: this.xData,
        },
        yAxis: {
          name: this.yname,
          type: 'value',
        },
        series:
          this.activeName === '01'
            ? [
                {
                  name: '工单生成量',
                  type: 'line',
                  data: this.valuesorder,
                  smooth: true,
                  lineStyle: {
                    color: '#3A82FF', // 蓝色线段
                    width: 3,
                    shadowColor: 'rgba(58,130,255,0.8)', // 线条阴影
                    shadowBlur: 15,
                    shadowOffsetY: 6,
                  },
                  itemStyle: {
                    color: '#3A82FF', // 节点内部为蓝色
                    borderColor: '#FFFFFF', // 节点外白色边框
                    borderWidth: 3,
                  },
                  symbol: 'circle',
                  symbolSize: 10, // 节点大小
                },
                {
                  name: '平均值', // 图例显示名称
                  type: 'line',
                  data: this.averages,
                  legendSymbol: 'line',
                  smooth: true,
                  lineStyle: {
                    color: 'rgba(252, 142, 50, 0.702)',
                    type: 'dashed', // 平均线虚线好看点，可改
                  },
                  itemStyle: {
                    color: 'rgba(252, 142, 50, 0.702)',
                    borderColor: '#FFFFFF', // 节点外白色边框
                    borderWidth: 3,
                  },
                  symbol: 'none', // 不要显示节点
                },
              ]
            : [
                {
                  name: this.labelname,
                  type: 'line',
                  data: this.valuesrate,
                  smooth: true,
                  lineStyle: {
                    color: '#3A82FF', // 蓝色线段
                    width: 3,
                    shadowColor: 'rgba(58,130,255,0.8)', // 线条阴影
                    shadowBlur: 15,
                    shadowOffsetY: 6,
                  },
                  itemStyle: {
                    color: '#3A82FF', // 节点内部为蓝色
                    borderColor: '#FFFFFF', // 节点外白色边框
                    borderWidth: 3,
                  },
                  symbol: 'circle',
                  symbolSize: 10, // 节点大小
                },
              ],
      };

      this.myChart.setOption(option);
    },
    // 工单情况
    async goGetstats() {
      let body = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      let res = await API.getstats(body);
      console.log(33333, res.data);

      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totalCount = this.formatNumber(DTS.totalCount);
        this.dispatchedCount = this.formatNumber(DTS.dispatchedCount);
        this.pendingDispatchCount = this.formatNumber(DTS.pendingDispatchCount);
        // this.completedCount = DTS.completedCount;
        this.completedCount = this.formatNumber(DTS.completedCount);
        this.timelyProcessedCount = this.formatNumber(DTS.timelyProcessedCount);
      } else {
        this.$message.error(RT_D);
      }
    },
    // 指标显示
    changelis() {
      let workOrder = [];
      if (this.oneName === '01') {
        workOrder = this.workOrderGenStats.filter((item) => this.checkList.includes(item.label));
      } else {
        workOrder = this.workOrderGenStatsAll.filter((item) => this.checkList.includes(item.label));
      }
      this.workOrder = workOrder;
    },
    // 指标情况
    async goGetquota() {
      this.riskLoading = true;
      let body = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      let res = await API.getquota(body).finally(() => (this.riskLoading = false));
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        let datelist = [];
        // if (this.oneName === "01") {
        this.workOrderGenStatsAll = [
          {
            label: '工单直派率',
            value: DTS.directDispatchRate,
            trend: DTS.directDispatchRateYoy > 0 ? 'up' : 'down',
            change: `${DTS.directDispatchRateYoy == null ? 0 : DTS.directDispatchRateYoy}%`,
          },
          {
            label: '工单完成率',
            value: DTS.completionRate,
            trend: DTS.completionRateYoy > 0 ? 'up' : 'down',
            change: `${DTS.completionRateYoy == null ? 0 : DTS.completionRateYoy}%`,
          },
          {
            label: '工单及时率',
            value: DTS.timelyRate,
            trend: DTS.timelyRateYoy > 0 ? 'up' : 'down',
            change: `${DTS.timelyRateYoy == null ? 0 : DTS.timelyRateYoy}%`,
          },
          {
            label: '工单超期率',
            value: DTS.overdueRate,
            trend: DTS.overdueRateYoy > 0 ? 'up' : 'down',
            change: `${DTS.overdueRateYoy == null ? 0 : DTS.overdueRateYoy}%`,
          },
          {
            label: '工单复发率',
            value: DTS.recurrenceRate,
            trend: DTS.recurrenceRateYoy > 0 ? 'up' : 'down',
            change: `${DTS.recurrenceRateYoy == null ? 0 : DTS.recurrenceRateYoy}%`,
          },
          {
            label: '工单规范率',
            value: DTS.standardRate,
            trend: DTS.standardRateYoy > 0 ? 'up' : 'down',
            change: `${DTS.standardRateYoy == null ? 0 : DTS.standardRateYoy}%`,
          },
        ];
        this.workOrderGenStats =
          // datelist
          [
            {
              label: '工单直派率',
              value: DTS.directDispatchRate,
              trend: DTS.directDispatchRateMom > 0 ? 'up' : 'down',
              change: `${DTS.directDispatchRateMom == null ? 0 : DTS.directDispatchRateMom}%`,
            },
            {
              label: '工单完成率',
              value: DTS.completionRate,
              trend: DTS.completionRateMom > 0 ? 'up' : 'down',
              change: `${DTS.completionRateMom == null ? 0 : DTS.completionRateMom}%`,
            },
            {
              label: '工单及时率',
              value: DTS.timelyRate,
              trend: DTS.timelyRateMom > 0 ? 'up' : 'down',
              change: `${DTS.timelyRateMom == null ? 0 : DTS.timelyRateMom}%`,
            },
            {
              label: '工单超期率',
              value: DTS.overdueRate,
              trend: DTS.overdueRateMom > 0 ? 'up' : 'down',
              change: `${DTS.overdueRateMom == null ? 0 : DTS.overdueRateMom}%`,
            },
            {
              label: '工单复发率',
              value: DTS.recurrenceRate,
              trend: DTS.recurrenceRateMom > 0 ? 'up' : 'down',
              change: `${DTS.recurrenceRateMom == null ? 0 : DTS.recurrenceRateMom}%`,
            },
            {
              label: '工单规范率',
              value: DTS.standardRate,
              trend: DTS.standardRateMom > 0 ? 'up' : 'down',
              change: `${DTS.standardRateMom == null ? 0 : DTS.standardRateMom}%`,
            },
          ];
        this.changelis();
      } else {
        this.$message.error(RT_D);
      }
    },
    // 成效对比
    async getIndicatorStats() {
      this.qualityLoading = true;
      let body = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
        indicatorType: this.activeName,
      };
      this.xData = [];
      this.valuesorder = [];
      this.valuesrate = [];
      this.averages = [];
      let res = await API.indicatorStats(body).finally(() => (this.qualityLoading = false));
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.averages = DTS.averages;
        if (DTS.timeSeriesData && DTS.timeSeriesData.length != 0) {
          this.xData = DTS.timeSeriesData.map((item) => item.timeLabel);
          this.valuesorder = DTS.timeSeriesData.map((item) => item.orderCount);
          this.valuesrate = DTS.timeSeriesData.map((item) => item.rate);
          this.averages = this.xData.map(() => DTS.averages);
          this.$nextTick(() => {
            this.getChengXiao();
          });
        }
      } else {
        this.$message.error(RT_D);
      }
    },
    // 查询管辖单位指标情况
    async getGroupByOrg() {
      let body = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
        indicatorType: this.fourName,
      };
      let res = await API.groupByOrg(body);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.groupByOrgArray = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 当已经选中 4 个并且该项还未被选中时，禁用它
    isDisabled(item) {
      return (
        (this.checkList.length >= 4 && !this.checkList.includes(item)) ||
        (this.checkList.length == 1 && this.checkList.includes(item))
      );
    },
    // 点击更多跳转
    goNewPage(pageIndex) {
      let parem = {
        id: pageIndex,
        dateRange: this.selectedDate,
      };
      this.$emit('goNewPage', parem, this.selectedDate);
    },
  },
};
</script>

<style lang="scss" scoped>
.mincard {
  width: 40px;
  height: 130px;
  font-size: 16px;
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  color: $font-color-dark;
  font-weight: bold;
  // background: linear-gradient(to bottom, $gradient-green-dark-end 0%, #ffffff 100%);
  background-image: url('~@/assets/iconfont/icon/标题背景.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 3px;
  .card-arrow {
    cursor: pointer;
    font-size: 14px;
    width: 10px;
    height: 10px;
    background-image: url('~@/assets/iconfont/icon/展开.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.work-order-card {
  height: 891px;
  width: 446px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
  .arrow-down {
    background-image: url('~@/assets/iconfont/icon/收起.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .arrow-up {
    background-image: url('~@/assets/iconfont/icon/展开.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .tabTitle {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-around;
    background-color: $color-gray2;
    font-size: 14px;
    border-radius: 5px;
    padding: 8px 0;
  }
  .tabContent {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-around;
    font-size: 14px;
    padding: 8px 0;
  }
  .date-selector {
    display: inline-flex;
    margin: 0;

    ::v-deep .el-button {
      padding: 5px 5px;
      font-size: 12px;
      border-color: #dcdfe6;
      background-color: #fff;
      color: #606266;
      margin-left: -1px;
      position: relative;
      z-index: 1;

      // &:first-child {
      //   margin-left: 0;
      //   border-top-left-radius: 10px;
      //   border-bottom-left-radius: 10px;
      // }

      // &:last-child {
      //   border-top-right-radius: 10px;
      //   border-bottom-right-radius: 10px;
      // }

      &:hover {
        z-index: 2;
      }

      &.active {
        background-color: #028671;
        border-color: #028671;
        color: #fff;
        z-index: 2;
      }

      &:hover:not(.active) {
        color: #028671;
        border-color: #028671;
        background-color: #fff;
      }
    }
  }
  .iconstyle {
    margin-left: 20px;
    color: $color-primary;
    font-size: 16px;
    cursor: pointer;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-image: url('~@/assets/iconfont/icon/标题背景.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    .card-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 700;
      color: #426170;
      // color: $color-primary;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
      .more {
        font-size: 14px;
        color: #647671;
        cursor: pointer;
        &::after {
          content: '>';
          margin-left: 5px;
          font-size: 16px;
        }
      }
    }

    .card-arrow {
      color: #909399;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.3s;
      width: 10px;
      height: 10px;
      margin-left: 10px;

      &:hover {
        color: #409eff;
      }
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    padding: 0 10px;
    .section1 {
      margin-bottom: 10px;
      .titleContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-box {
          flex: 1;
          background-image: url('~@/assets/iconfont/icon/二级标题背景.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 3px 10px 3px;
          .title-text {
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
        }
      }

      .sectionFirst {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .danwei {
          margin-left: 5px;
          font-size: 12px;
        }
        .oneLine {
          // width: 30%;
          text-align: center;
          padding: 10px;
          margin: 5px;
          border-radius: 5px;
          border: 1px solid $border-color-primary;
          .linenum {
            font-size: 24px;
            font-weight: 700;
            color: $color-primary-click;
            margin-bottom: 5px;
          }
          .linenum3 {
            font-size: 18px;
            font-weight: bold;
            color: $gradient-yellow-start;
            margin-bottom: 5px;
            .danwei {
              color: $gradient-yellow-start;
            }
          }
          .linetext {
            font-size: 14px;
            font-weight: bold;
          }
        }
        .total {
          // width: 50%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          margin: 5px;
          .linenum {
            font-size: 24px;
            font-weight: 700;
            color: black;
            margin-bottom: 8px;
          }
          .linetext {
            font-size: 14px;
            font-weight: bold;
          }
        }
        .fiveLine {
          // width: 30%;
          text-align: center;
          padding: 10px;
          margin: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          .linenum {
            font-size: 24px;
            font-weight: 700;
            color: $color-primary-click;
            margin-bottom: 8px;
          }
          .linenum3 {
            font-size: 24px;
            font-weight: 700;
            color: $gradient-yellow-start;
            margin-bottom: 8px;
            .danwei {
              color: $gradient-yellow-start;
            }
          }
          .linetext {
            font-size: 14px;
            font-weight: bold;
          }
        }
        .twoLine {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          text-align: center;
          padding: 10px 10px 10px 0px;
          height: 50px;
          box-sizing: border-box;
          // margin: 5px 5px 10px 5px;
          // background-image: url("~@/assets/iconfont/icon/工单完成数背景.svg");
          background-image: url('~@/assets/iconfont/icon/icontihuan/sv615151.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          .linenum {
            font-size: 24px;
            font-weight: 700;
            color: $color-primary-click;
          }
          .linetext {
            font-size: 14px;
            padding-left: 20px;
            display: flex;
            align-items: center;
          }
        }
        .threeLine {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          text-align: center;
          padding: 10px 10px 10px 0px;
          height: 50px;
          box-sizing: border-box;
          // margin: 5px 5px 10px 5px;
          background-image: url('~@/assets/iconfont/icon/及时处理数背景.svg');
          // background-image: url("~@/assets/iconfont/icon/icontihuan/sv615151.svg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          .linetext {
            display: flex;
            align-items: center;
            text-align: center;
            font-size: 14px;
          }
          .linenum {
            font-size: 24px;
            font-weight: 700;
            color: $gradient-blue-start;
            .danwei {
              color: $gradient-blue-start;
            }
          }
        }
      }
    }
    .section2 {
      .tablebox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
      }
      .newcontainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // margin-bottom: 5px;
        flex: 1;
        background-image: url('~@/assets/iconfont/icon/二级标题背景.svg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        .titleContainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          .title-box {
            padding: 3px 10px;
            .title-text {
              color: white;
              font-weight: bold;
              font-size: 14px;
            }
          }
        }
        .funcontainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          .tab-text {
            font-size: 12px;
            color: #99a09e;
            cursor: pointer;
          }
          .tab-active {
            color: #009b83;
          }
        }
      }
      .indeicator {
        width: 100%;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        margin: 10px 0;
        height: 115px;
      }

      .stat-item {
        box-sizing: border-box;
        margin-left: 3.5%;
        width: 21%;
        text-align: center;
        padding: 15px 5px;
        border-radius: 4px;
        background-image: url('~@/assets/iconfont/icon/工单指标背景.svg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        .stat-number {
          font-size: 18px;
          font-weight: bold;
          color: #303133;
          .percent {
            font-size: 12px;
          }
        }

        .stat-label {
          font-size: 12px;
          margin: 10px 0px;
        }

        .stat-change {
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;

          &.green {
            color: #67c23a;
          }

          &.red {
            color: #f56c6c;
          }
        }

        .stat-icon {
          font-size: 16px;
          margin-top: 5px;

          &.el-icon-warning {
            color: #e6a23c;
          }

          &.el-icon-info {
            color: #409eff;
          }
        }
      }
    }
    .section3 {
      .tablebox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
      }
      .newcontainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-image: url('~@/assets/iconfont/icon/二级标题背景.svg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        margin-bottom: 5px;
        width: 100%;
        .titleContainer {
          .title-box {
            flex: 1;

            padding: 3px 10px;
            .title-text {
              color: white;
              font-weight: bold;
              font-size: 14px;
            }
          }
        }
        .funcontainer {
          // display: flex;
          // align-items: center;
          // justify-content: space-between;
          position: relative;
          .tab-text {
            font-size: 12px;
            color: #99a09e;
            cursor: pointer;
          }
          .tab-active {
            color: #009b83;
          }
        }
      }
      #chengxiao,
      .chengxiao-empty {
        width: 100%;
        height: 212px;
      }
    }
    .section4 {
      .newcontainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        .titleContainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          .title-box {
            flex: 1;
            background-image: url('~@/assets/iconfont/icon/二级标题背景.svg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 3px 10px;
            .title-text {
              color: white;
              font-weight: 700;
              font-size: 14px;
            }
          }
        }
        .funcontainer {
          // display: flex;
          // align-items: center;
          // justify-content: space-between;
          position: relative;
          .tabsgroup {
            position: absolute;
            right: 0px;
            top: -10px;
            ::v-deep .el-tabs__item {
              height: 20px;
              line-height: 20px;
              padding: 0px 5px;
            }
            ::v-deep .el-tabs__nav-prev {
              height: 20px;
              line-height: 20px;
            }
            ::v-deep .el-tabs__nav-next {
              height: 20px;
              line-height: 20px;
            }
          }
        }
      }
      .from {
        margin-top: 10px;
        min-height: 200px;
        //
        //
        // overflow-y: scroll;
        .tabContentContainer {
          min-height: 200px;
          max-height: 210px;
          overflow-y: auto;
          .table-column {
            // color:#009b83;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
