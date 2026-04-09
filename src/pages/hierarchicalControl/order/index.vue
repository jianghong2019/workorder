<template>
  <!-- 下级 -->
  <el-container class="new-safeweb-web">
    <base-title-table title="工单总览">
      <template #right>
        <div class="flex-row-end">
          <el-button class="el-btn-new reset-btn" size="small" @click="goBack">
            <img src="@/assets/images/icon-img/icon-fanhui.png" alt="" />
            返回
          </el-button>
        </div>
      </template>
    </base-title-table>
    <!-- 头 -->
    <el-header class="cardboxpd">
      <el-form
        id="searchData"
        ref="searchData"
        :model="searchData"
        label-position="right"
        label-width="100px"
        class="searchData search_input"
        action="http://"
        target="stop"
      >
        <div class="flex-row-bw flex-wrap">
          <el-form-item v-if="isOrg" label="单位" prop="orgId" class="form-item-new">
            <org-tree v-model="searchData.orgId" :unit-data="unitData"></org-tree>
          </el-form-item>
          <el-form-item v-else label="姓名" prop="personName" class="form-item-new">
            <el-input
              v-model="searchData.personName"
              class="input-box"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="日期选择" prop="dateTime" class="date-box form-item-new">
            <el-date-picker
              v-model="searchData.dateTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              @change="dateTimeFinish"
            >
            </el-date-picker>
            <i class="el-icon-date data-icon"></i>
          </el-form-item>
          <div class="flex-row-end search-buttons form-item-btn30">
            <el-button class="el-btn-new reset-btn" plain size="small" @click="refresh()"
              >重 置</el-button
            >
            <el-button
              class="el-btn-new search-btn"
              type="primary"
              plain
              size="small"
              @click="searchSubmit(true)"
              >查 询
            </el-button>
          </div>
        </div>
      </el-form>
    </el-header>
    <!-- 头 end -->
    <!-- 总数及环状图 -->
    <el-main class="manage-main">
      <div class="main">
        <div class="main-left">
          <h4 class="new-base-title">工单处理情况</h4>
          <div class="main-left-content">
            <div class="main-left-content-left">
              <div class="content">
                <span> {{ orderProcessData.totalCount || 0 }} <span>条</span></span>
                <span class="titlle">待办总数</span>
              </div>
            </div>
            <div class="main-left-content-main">
              <div>
                <div>
                  <div class="img">
                    <img src="@/assets/images/hierarchicalControl/order2.png" alt="" />
                  </div>
                  <div class="order">
                    <span>
                      {{ orderProcessData.dispatchedCount || 0 }}
                      <span>条</span></span
                    >
                    <span class="titlle">已派发</span>
                  </div>
                </div>
                <div>
                  <div>
                    <span>
                      {{ orderProcessData.autoDispatchCount || 0 }}
                      <span>条</span></span
                    >
                    <span class="titlle">自动派发</span>
                  </div>
                  <div>
                    <span>
                      {{ orderProcessData.manualDispatchCount || 0 }}
                      <span>条</span></span
                    >
                    <span class="titlle">手动</span>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div class="img">
                    <img src="@/assets/images/hierarchicalControl/order3.png" alt="" />
                  </div>
                  <div class="order">
                    <span>
                      {{ orderProcessData.processedCount || 0 }}
                      <span>条</span></span
                    >
                    <span class="titlle">已处理</span>
                  </div>
                </div>
                <div>
                  <div>
                    <span>
                      {{ orderProcessData.selfHealingCount || 0 }}
                      <span>条</span></span
                    >
                    <span class="titlle">自愈合</span>
                  </div>
                  <div>
                    <span>
                      {{ orderProcessData.unprocessedCount || 0 }}
                      <span>条</span></span
                    >
                    <span class="titlle">未处理</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="main-left-content-right">
              <div>
                <div>
                  <div class="img">
                    <img src="@/assets/images/hierarchicalControl/order4.png" alt="" />
                  </div>
                  <div>
                    <span class="redNum">
                      {{
                        orderProcessData.unDispatchedCount ||
                        orderProcessData.undispatchedCount ||
                        0
                      }}
                      <span>条</span></span
                    >
                    <span class="titlle">未派发</span>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div class="img">
                    <img src="@/assets/images/hierarchicalControl/order5.png" alt="" />
                  </div>
                  <div>
                    <span class="redNum">
                      {{
                        orderProcessData.overdueCount || orderProcessData.overdueProcessedCount || 0
                      }}
                      <span>条</span></span
                    >
                    <span class="titlle">超期处理</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-right">
          <div class="main-right-title">
            <h4 class="new-base-title">工单专业分布</h4>
            <!-- <div>
              <span
                :class="orderProfessActive == '01' ? 'is-active' : ''"
                @click="orderProfess('01')"
                >同比</span
              >
              :
              <span
                :class="orderProfessActive == '02' ? 'is-active' : ''"
                @click="orderProfess('02')"
                >环比</span
              >
            </div> -->
          </div>
          <div class="main-right-content">
            <!-- 换状图 -->
            <div class="ring-char">
              <pieChart pie-id="loginPie" :config="pieConfig"></pieChart>
            </div>
            <!-- 换状图对应数据 -->
            <div class="ring-data">
              <!-- 图例数据区域 -->
              <div v-if="pieConfig.data.length > 0" class="chart-legend">
                <div v-for="(item, index) in pieConfig.data" :key="index" class="legend-item">
                  <div class="legend-title">
                    <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                    <div class="legend-name">{{ item.name }}</div>
                  </div>
                  <div class="legend-content">
                    <div class="legend-value">
                      {{ item.value }}
                      <span>数量</span>
                    </div>
                    <div class="legend-value">
                      {{ item.percent }}%
                      <span>占比</span>
                    </div>
                  </div>
                  <div class="legend-change">
                    <!-- <span>{{ orderProfessActive == '01' ? "同比" : "环比" }}</span>
                    <div :class="getChangeClass(item.change)">
                      <i :class="getChangeIcon(item.change)"></i>
                      {{ item.change }}%
                    </div> -->
                    <span>生成</span>
                    <div class="legend-change--positive">
                      {{ item.change }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-main class="cardbox-pd0 manage-main echarts-box">
      <!-- 省市县柱状图 -->
      <div v-if="isOrg" class="bar-main">
        <div class="new-base-title">各单位指标情况</div>
        <div class="bar-chart">
          <barChart barchart-id="barchart" :config="barConfig1"></barChart>
        </div>
      </div>
      <!-- 本级柱状图 -->
      <div v-else class="bar-main">
        <div class="lineTitel_tiem">
          <div class="new-base-title">工单完成情况</div>
          <div class="time_1">
            <div
              v-for="(item, index) in timeList"
              :key="index + ''"
              :class="checkIndex_1 === index ? 'checkTimeName_1' : 'timeName_1'"
              @click="handleTime_1(index)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="bar-chart">
          <barChart barchart-id="professionalBarchart" :config="barConfig2"></barChart>
        </div>
      </div>
    </el-main>
    <!-- 表格区域 -->
    <el-main class="cardbox-pd0 manage-main">
      <div class="table">
        <div class="table-title">
          <div class="new-base-title process-title mb-10">
            {{ isOrg ? '各单位工单处理情况' : '各人员工单处理情况' }}
          </div>
          <div>
            <el-button class="el-btn-new reset-btn" size="small" @click="newExportClick">
              <i class="iconfont icon-daochu1"></i>
              导出
            </el-button>
          </div>
        </div>
        <!-- 省市县表格 -->
        <div v-if="isOrg" class="table-box">
          <orgTable
            :table-data="tableData"
            @openOrder="openOrder"
            @changeOrg="changeOrg"
          ></orgTable>
        </div>
        <!-- 本级表格 -->
        <div v-else class="table-box">
          <personTable
            :table-data="tableData"
            :page-index="pageIndex"
            :page-size="pageSize"
            :table-count="tableCount"
            @openOrder="openOrder"
            @sizeChange="sizeChange"
            @pageChange="pageChange"
          ></personTable>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BaseTitleTable from '@/components/common/form/base-title-table/index.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import pieChart from './components/pieChart.vue';
import barChart from './components/barChart.vue';
import orgTable from './components/orgTable.vue';
import personTable from './components/personTable.vue';
import { useUnitData } from '@/composables/useUnitData.js';
import API from '@/api/hierarchicalControl/order.js';

export default {
  name: 'Order',
  components: {
    BaseTitleTable,
    OrgTree,
    pieChart,
    barChart,
    orgTable,
    personTable,
  },
  data() {
    return {
      isOrg: true, // 省市县/本级 标识符
      orgId: '', // 首页带过来的单位ID
      selectedDate: '', // 时间范围标识符
      searchData: {
        // 查询条件合集
        orgId: '',
        personName: '',
        dateTime: [],
      },
      // orderProfessActive: "01", // 同比环比激活表示符
      orderProcessData: {}, // 工单处理情况数据
      pieConfig: {
        // 环状图数据
        data: [
          {
            name: '计量',
            color: '#39B9FD',
            value: 0,
            percent: 0,
            change: 0,
          },
          {
            name: '采集',
            color: '#4AE7CE',
            value: 0,
            percent: 0,
            change: 0,
          },
          {
            name: '线损',
            color: '#FDDD39',
            value: 0,
            percent: 0,
            change: 0,
          },
          {
            name: '反窃查违',
            color: '#FFA029',
            value: 0,
            percent: 0,
            change: 0,
          },
          {
            name: '其他',
            color: '#EEE',
            value: 0,
            percent: 0,
            change: 0,
          },
        ],
      },
      barConfig1: {
        // 省市县柱状图数据
        nameY: '单位（%）',
        grid: {
          left: 100,
          right: 20,
          bottom: 45,
          top: 40,
        },
        barData: [
          {
            name: '完成率',
            value: [],
          },
          {
            name: '直派率',
            value: [],
          },
          {
            name: '及时率',
            value: [],
          },
          {
            name: '超期率',
            value: [],
          },
        ],
        barX: [],
        customColors: [
          ['#039DEE', '#C2E6F9'], // 第二个系列的渐变色
          ['#04D169', '#D5FCD5'], // 第一个系列的渐变色
          ['#F98A23', '#FCD9B9'], // 第三个系列的渐变色（备用）
          ['#FA9090', '#F6BEBE'], // 第四个系列的渐变色（备用）
        ],
        barMaxWidth: 15,
        percentage: true,
        showSlider: true,
      },
      barConfig2: {
        // 本级柱状图数据
        nameY: '单位（条）',
        grid: {
          left: 100,
          right: 20,
          bottom: 45,
          top: 40,
        },
        barData: [
          {
            name: '已处理',
            value: [],
          },
          {
            name: '未处理',
            value: [],
          },
        ],
        barX: [],
        customColors: [
          ['#039DEE', '#C2E6F9'], // 第二个系列的渐变色
          ['#F98A23', '#FCD9B9'], // 第三个系列的渐变色（备用）
        ],
        barMaxWidth: 18,
        showSlider: true,
      },
      timeList: [
        // 本级柱状图按钮合集
        { name: '全部' },
        { name: '计量' },
        { name: '采集' },
        { name: '防窃违查' },
        { name: '线损' },
        { name: '其他' },
      ],
      checkIndex_1: 0,

      tableData: [], // 表格数据
      pageIndex: 1,
      pageSize: 10,
      tableCount: 0,
    };
  },
  mounted() {
    let data = this.$route.query || {};
    this.orgId = data.orgId ? data.orgId : this.$store.state.UserData.orgId; // 保留一开始进来的单位id 用于重置按钮
    this.searchData.orgId = data.orgId ? data.orgId : this.$store.state.UserData.orgId;
    this.selectedDate = data?.dateRange;
    this.searchData.dateTime = data.timeData ? data.timeData : [];
    this.isOrg = data.orgType === '01'; // 省市县/本级 标识符

    this.searchSubmit();
  },
  // 单位树数据合集
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
    };
  },
  methods: {
    // 下钻上钻
    changeOrg(orgId) {
      console.log(orgId, '单位变化');
      this.refresh(orgId);
    },
    // 时间选择限制
    dateTimeFinish() {
      if (this.searchData.dateTime && this.searchData.dateTime.length > 0) {
        const start = +new Date(this.searchData.dateTime[0]);
        const end = +new Date(this.searchData.dateTime[1]);
        if (end > start + 3600 * 1000 * 24 * 365) {
          this.searchData.dateTime = [];
          return this.$message.error('选择的时间跨度不能超过12个月');
        }
      }
    },
    refresh(orgId) {
      this.searchData = {
        orgId: orgId || this.orgId,
        personName: '',
        dateTime: [],
      };
      this.pageIndex = 1;
      this.pageSize = 10;
      this.checkIndex_1 = 0;
      this.searchSubmit();
    },
    // 查询数据
    searchSubmit(btnclick) {
      if (btnclick) {
        this.pageIndex = 1;
      }
      if (this.isOrg) {
        this.getWorkOrderProcess();
        this.getProfTypeCount();
        this.getUnitMetrics();
        this.getUnitProcessGroupByOrg();
      } else {
        this.getProcess();
        this.getProf();
        this.getFinish();
        this.getPerson();
      }
    },
    // 获取工单处理情况（省市县）
    getWorkOrderProcess() {
      let params = {
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.workOrderProcess(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.orderProcessData = DTS;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取工单处理情况（所级）
    getProcess() {
      let params = {
        operatorName: this.searchData.personName,
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.process(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.orderProcessData = DTS;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取工单专业分布情况（省市县）
    getProfTypeCount() {
      let params = {
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.profTypeCount(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.pieConfig.data.forEach((item, index) => {
            if (index === 4) {
              item.value = DTS?.profTypeCounts?.[`99`] ?? 0;
              item.percent = DTS?.profTypeRate?.[`99`] ?? 0;
              item.change = DTS?.currentGeneCounts?.[`99`] ?? 0;
            } else {
              item.value = DTS?.profTypeCounts?.[`0${index + 1}`] ?? 0;
              item.percent = DTS?.profTypeRate?.[`0${index + 1}`] ?? 0;
              item.change = DTS?.currentGeneCounts?.[`0${index + 1}`] ?? 0;
            }
          });
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取工单专业分布情况（所级）
    getProf() {
      let params = {
        operatorName: this.searchData.personName,
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.prof(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.pieConfig.data.forEach((item, index) => {
            item.value = DTS?.[index]?.pendingCount ?? 0;
            item.percent = DTS?.[index]?.pendingRatio ?? 0;
            item.change = DTS?.[index]?.generateCount ?? 0;
          });
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 查询各单位的指标情况（省市县）
    getUnitMetrics() {
      let params = {
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.unitMetrics(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          // 柱状图数据处理
          let barX = [];
          let value1 = [];
          let value2 = [];
          let value3 = [];
          let value4 = [];
          DTS?.[0]?.metricsGroupByOrgVoList.forEach((item) => {
            barX.push(item.orgName);
            value1.push(item.metricsRate);
          });
          DTS?.[1]?.metricsGroupByOrgVoList.forEach((item) => {
            value2.push(item.metricsRate);
          });
          DTS?.[2]?.metricsGroupByOrgVoList.forEach((item) => {
            value3.push(item.metricsRate);
          });
          DTS?.[3]?.metricsGroupByOrgVoList.forEach((item) => {
            value4.push(item.metricsRate);
          });
          this.barConfig1.barX = barX;
          this.barConfig1.barData[0].value = value1;
          this.barConfig1.barData[1].value = value2;
          this.barConfig1.barData[2].value = value3;
          this.barConfig1.barData[3].value = value4;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 查询人员工单情况（所）
    getFinish() {
      let clickNames = ['', '01', '02', '04', '03', '99'];
      let params = {
        operatorName: this.searchData.personName,
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
        profType: clickNames[this.checkIndex_1],
      };
      API.finish(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          // 柱状图数据处理
          this.barConfig2.barX = DTS?.operatorNames ?? [];
          this.barConfig2.barData[0].value = DTS?.processedCounts ?? [];
          this.barConfig2.barData[1].value = DTS?.unprocessCounts ?? [];
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 各单位工单处理情况列表数据（省市县）
    getUnitProcessGroupByOrg() {
      let params = {
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.unitProcessGroupByOrg(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 各人员工单处理情况列表数据（所）
    getPerson() {
      let params = {
        operatorName: this.searchData.personName,
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
      };
      API.person(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.list;
          this.tableCount = DTS?.total;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 本级柱状图按钮点击
    handleTime_1(index) {
      this.checkIndex_1 = index;
      this.getFinish();
    },
    // 跳转工单中心
    openOrder(data, columnName, index) {
      console.log(data, columnName, index, '跳转工单中心数据');
      // 判断待办总数的点击才跳转
      if (columnName !== 'pendingCount') return;
      let prame = {};
      if (this.$store.state.UserData.function.includes('04')) {
        prame = {
          orgId: data.orgNo ? data.orgNo : this.orgId,
          isSelf: index && index !== '1' ? '0' : '2',
          manage: data.operatorName ? data.operatorName : '',
          wkstStatus: ['01', '02'],
          insertTimeList: [],
          mastFinishTime: this.getDateRangeByType(this.selectedDate),
        };
      } else {
        prame = {
          wkstStatus: ['01', '02'],
          insertTimeList: [],
          mastFinishTime: this.getDateRangeByType(this.selectedDate),
        };
      }
      // 跳转工单中心
      localStorage.setItem('UnifiedAnalysisJump', JSON.stringify(prame));
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/#/pages/workPlanManagementModule/workOrderManagement`;
      } else {
        window.parent.openNewTab(
          {
            text: '工单管理',
            name: 'XB_GDZX',
          },
          {
            text: '工单中心',
            name: 'XB_GDZX',
            url: '/siteOperationPlatform_front/siteOperationPlatform_front/index.html#/pages/workPlanManagementModule/workOrderManagement',
          }
        );
      }
    },
    getDateRangeByType(dateType) {
      if (!dateType) return { beginTime: '', endTime: '' };

      const now = this.$moment();
      const lastYear = now.clone().subtract(1, 'year');

      // 开始时间固定为去年1月1日
      const beginTime = lastYear.startOf('year').format('YYYY-MM-DD');

      let endTime = '';

      // 只处理本日、本月、本年
      if (dateType === '01') {
        // 本日
        endTime = now.endOf('day').format('YYYY-MM-DD');
      } else if (dateType === '02') {
        // 本月
        endTime = now.endOf('month').format('YYYY-MM-DD');
      } else if (dateType === '04') {
        // 本年
        endTime = now.endOf('year').format('YYYY-MM-DD');
      }
      return [beginTime, endTime];
    },
    // 同比环比按钮切换
    // orderProfess(val) {
    //   this.orderProfessActive = val;
    // },
    // 上升下降颜色
    // getChangeClass(change) {
    //   if (change > 0) return "legend-change--positive";
    //   if (change < 0) return "legend-change--negative";
    //   return "legend-change--neutral";
    // },
    // 上升下降图标
    // getChangeIcon(change) {
    //   if (change > 0) return "el-icon-caret-top";
    //   if (change < 0) return "el-icon-caret-bottom";
    //   return "";
    // },
    sizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getPerson();
    },
    pageChange(val) {
      this.pageIndex = val;
      this.getPerson();
    },
    // 导出
    newExportClick() {
      if (!this.tableData.length) {
        return this.$message.error('暂无数据可以导出!');
      }
      this.exportClick();
    },
    exportClick() {
      let orgPrams = {
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      let personPrams = {
        operatorName: this.searchData.personName,
        orgNo: this.searchData.orgId,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      };
      let exportClickparams = this.isOrg ? orgPrams : personPrams;
      let exportUrl = this.isOrg
        ? '/safemanage-evaluation/workOrderSub/exportList'
        : '/safemanage-evaluation/workOrderManagement/person/condition/exportList';
      var form = document.createElement('form');
      form.style.display = 'none';
      form.action = exportUrl;
      form.method = 'post';
      document.body.appendChild(form);
      for (let key in exportClickparams) {
        let input = document.createElement('input');
        input.input = 'hidden';
        input.name = key;
        input.value = exportClickparams[key];
        form.appendChild(input);
      }
      // // 添加排序 和 查询条件
      form.submit();
      form.remove();
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  height: 260px;
  background-color: rgba(0, 0, 0, 0);
  .main-left {
    width: 800px;
    padding: 20px;
    margin-right: 12px;
    background-color: #ffff;
    .main-left-content {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      .main-left-content-left {
        text-align: center;
        width: 175px;
        height: 185px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: url('~@/assets/images/hierarchicalControl/order1.png');
        margin-right: 8px;
        .content {
          width: 60%;
          display: flex;
          flex-direction: column;
          margin-top: 20px;
          & > span {
            font-size: 24px;
            font-weight: bold;
            color: #029b82;
            margin-bottom: 6px;
            span {
              font-weight: 400;
              font-size: 16px;
            }
          }
          .titlle {
            font-size: 16px;
            color: #426170;
          }
        }
      }
      .main-left-content-main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 416px;
        margin-right: 8px;
        & > div {
          height: 86px;
          display: flex;
          justify-content: space-between;
          background: #f1fffa;
          padding: 0 12px;
          & > div {
            display: flex;
            align-items: center;
            width: 50%;
            .img {
              width: 66px;
              height: 66px;
              margin-right: 24px;
            }
            .order {
              width: 45%;
              border-right: 1px solid #d8d8d8;
            }
            & > div {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              width: 50%;
              & > span {
                font-size: 20px;
                font-weight: bold;
                color: #029b82;
                margin-bottom: 6px;
                span {
                  font-weight: 400;
                  font-size: 14px;
                }
              }
              .titlle {
                font-size: 14px;
                font-weight: 500;
                color: #426170;
              }
            }
          }
        }
      }
      .main-left-content-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 180px;
        & > div {
          height: 86px;
          display: flex;
          justify-content: space-between;
          background: #f1fffa;
          & > div {
            display: flex;
            align-items: center;
            padding: 0 12px;
            .img {
              width: 66px;
              height: 66px;
              margin-right: 24px;
            }
            & > div {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              & > span {
                font-size: 20px;
                font-weight: bold;
                color: #029b82;
                margin-bottom: 6px;
                span {
                  font-weight: 400;
                  font-size: 14px;
                }
              }
              .titlle {
                font-size: 14px;
                font-weight: 500;
                color: #426170;
              }
            }
          }
        }
        .redNum {
          color: #fe3333;
        }
      }
    }
  }
  .main-right {
    flex-grow: 1;
    padding: 20px;
    background-color: #ffff;
    .main-right-title {
      // display: flex;
      // justify-content: space-between;
      margin-bottom: 12px;
      // span {
      //   cursor: pointer;
      // }
      // span.is-active {
      //   color: #2ba174;
      // }
    }
    .main-right-content {
      display: flex;
      justify-content: space-between;
      .ring-char {
        width: 200px;
        margin-right: 12px;
      }
      .ring-data {
        flex-grow: 1;
      }
    }
  }
}
.chart-legend {
  height: 190px;
  display: flex;
  justify-content: space-between;
  .legend-item {
    width: 145px;
    background-color: #f1fffa;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 10px;
    .legend-title {
      display: flex;
      align-items: center;
      margin-right: 12px;
      .legend-color {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .legend-name {
        font-size: 18px;
        font-weight: 700;
        color: #3d3d3d;
      }
    }
    .legend-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .legend-value,
      .legend-percent {
        font-size: 16px;
        color: #303133;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      span {
        display: block;
        margin-top: 20px;
        color: #999;
      }
    }
    .legend-change {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      padding: 0 20px;
      line-height: 44px;
      background-color: #fff;
    }
    .legend-change--positive {
      font-size: 18px;
      font-weight: bold;
      color: #3ed79e;
      // color: #67c23a;
    }

    .legend-change--negative {
      color: #f56c6c;
    }

    .legend-change--neutral {
      color: #909399;
    }
  }
}
.bar-main {
  padding: 20px;
  height: 320px;
  .bar-chart {
    height: 300px;
  }
}
.table {
  padding: 20px;
  .table-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
}
.lineTitel_tiem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .time_1 {
    display: flex;
    justify-content: space-between;
    width: 320px;
    height: 24px;
    background: rgba(255, 255, 255, 1);
    border-radius: $border-radio-md;
  }

  .timeName_1 {
    font-size: 12px;
    width: 50px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #7b807e;
    cursor: pointer;
  }

  .checkTimeName_1 {
    width: 50px;
    height: 24px;
    background: #2ba174;
    /* box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16); */
    border-radius: $border-radio-md;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 24px;
    cursor: pointer;
  }
}
.echarts-box {
  overflow: visible !important;
}
</style>
