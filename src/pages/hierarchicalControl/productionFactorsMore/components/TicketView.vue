<template>
  <el-container class="new-safeweb-web">
    <div class="ticket-view view-top">
      <el-header class="cardboxpd">
        <el-form
          id="searchData"
          ref="searchData"
          :model="searchData"
          label-width="80px"
          class="searchData search_input"
          action="http://"
          target="stop"
        >
          <div class="style-form">
            <el-form-item label="日期选择" prop="dateTime" class="date-box">
              <el-date-picker
                v-model="searchData.dateTime"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
              <i class="el-icon-date data-icon"></i>
            </el-form-item>
            <el-form-item v-if="!pageFlag" label="单位" prop="orgNo">
              <org-tree v-model="searchData.orgNo" :unit-data="unitData"></org-tree>
            </el-form-item>
            <el-form-item v-else label="姓名" prop="user">
              <el-input v-model="searchData.user" placeholder="请输入"></el-input>
            </el-form-item>
            <div class="flex-row-end search-buttons">
              <el-button class="el-btn-new reset-btn" plain size="small" @click="refresh"
                >重 置</el-button
              >
              <el-button
                class="el-btn-new search-btn"
                type="primary"
                plain
                :loading="loadingTable || loadingPie || loadingBar"
                size="small"
                @click="searchSubmit"
                >查 询
              </el-button>
            </div>
          </div>
        </el-form>
      </el-header>
      <div class="innerbox">
        <div class="innerbox-left">
          <div class="title-name">工作票类型</div>
          <!-- 工作票类型饼图 -->
          <div class="chart-row padding-chart">
            <!-- <div style="height:10px"></div> -->
            <div class="chart-item chart-item-left">
              <div v-loading="loadingPie" class="stylet">
                <div v-if="pieData.length" id="pie-chart" ref="pieChart" class="pie-chart"></div>
                <nullData v-else />
              </div>
            </div>
          </div>
        </div>

        <!-- 票卡分布柱状图 -->
        <div class="innerbox-right">
          <div class="clentt1">
            <div class="title-name title-no-padding-left">票卡单分布</div>
            <!-- 标签切换 -->
            <div class="btn-list">
              <div class="btn-box">
                <div
                  v-for="(label, key) in tabLabels"
                  :key="key"
                  class="btn-item"
                  :class="{ active: currentTab === key }"
                  @click="switchTab(key)"
                >
                  {{ label }}
                </div>
              </div>
            </div>
          </div>
          <div class="chart-row">
            <div class="chart-item chart-item-right">
              <div v-loading="loadingBar" class="bar-chart">
                <!-- ECharts 图表容器 -->
                <div v-if="xLabels.length" ref="chart" class="echarts-bar"></div>
                <nullData v-else />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ticket-view view-bottom">
      <!-- 查询表单 -->
      <div class="innerbox2">
        <!-- 各单位质量情况表格 -->
        <div class="table-container">
          <div class="table-name">
            <div class="title-name">票卡单明细列表</div>
            <el-button
              class="el-btn-new reset-btn"
              size="small"
              :disabled="loadingTable"
              @click="newExportClick"
            >
              <i class="iconfont icon-daochu1"></i>
              导出
            </el-button>
          </div>

          <div v-loading="loadingTable" class="table-box">
            <personTable
              :table-data="tableData"
              :columns="columns"
              :is-page="pageFlag"
              :table-count="tableCount"
              :page-index="pageIndex"
              :page-size="pageSize"
              @sizeChange="sizeChange"
              @pageChange="pageChange"
            ></personTable>
          </div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import {
  getWorkTicketTableList,
  getWorkTicketTypeList,
  getWorkTicketTypeChart,
  getWorkTicketTypePieChart,
  getWorkTicketBarChart,
  getWorkTicketDetailList,
} from '@/api/hierarchicalControl/productionFactorsMore.js';
import * as echarts from 'echarts';
import personTable from './personTable.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import { useUnitData } from '@/composables/useUnitData.js';
export default {
  components: {
    OrgTree,
    personTable,
    nullData: () => import('@/components/common/form/nullData.vue'),
  },
  props: {
    //判断是本级还是下级
    pageFlag: {
      type: Boolean,
      default: true,
    },
    //管理单位编码
    orgNo: {
      type: String,
      default: '',
    },
    //首页跳转传的时间
    dateTime: {
      type: Array,
      default: () => [],
    },
    //首页跳转传的时间
    // dateRange: {
    //   type: String,
    //   default: "",
    // },
  },
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
    };
  },
  data() {
    return {
      loadingPie: false,
      loadingBar: false,
      pieData: [],
      sumt: 0,
      barData: {
        tickets: [], //开票总数
        invalid: [], //不合格数
        rate: [], //不合格率
      },
      resizeObserverBar: null,
      resizeObserverPie: null,
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      currentTab: '07',
      tabLabels: {
        '07': '全部',
        '01': '变一',
        '02': '变二',
        '03': '配一',
        '04': '配二',
        '05': '低压票',
        '06': '作业票',
        // 可继续添加其他类型...
      },
      chartInstance: null,
      xLabels: [],
      unit: '',
      searchData: {
        orgNo: this.orgNo,
        dateTime: this.dateTime,
        user: '',
      },
      searchDatas: {
        orgNo: this.orgNo,
        dateTime: this.dateTime,
        user: '',
      },
      tableData: [],
      loadingTable: false,
      columns: [],
      barGroups: [
        { height: '80px', invalidHeight: '10px', rateHeight: '20px' },
        { height: '40px', invalidHeight: '5px', rateHeight: '15px' },
        // ...
      ],
      ticketTableData: [
        { unit: '浦东供电公司', total: 868, invalid: 10, rate: '0.2%' },
        { unit: '本级', total: 90, invalid: 0, rate: '0%' },
        // ...
      ],
      pieChart: null,
    };
  },
  mounted() {
    this.nowtimeTypeweek();
  },
  beforeDestroy() {
    this.destoryResizeObserver();
  },

  methods: {
    // 周第一天和最后一天
    nowtimeTypeweek() {
      let day = new Date().getDay();
      var nowTime = new Date().getTime();
      var oneDayTime = 24 * 60 * 60 * 1000;
      var MondayTime = nowTime - (day - 1) * oneDayTime;
      var SundayTime = nowTime + (7 - day) * oneDayTime;
      var beginTime = new Date(MondayTime);
      var endTime = new Date(SundayTime);
      let startDate = formatDate(beginTime);
      let endDate = formatDate(endTime);
      if (this.searchData.dateTime[0] || this.searchDatas.dateTime[0]) {
        console.log(1);
      } else {
        this.searchData.dateTime = [startDate, endDate];
        this.searchDatas.dateTime = [startDate, endDate];
      }

      if (this.pageFlag) {
        //本级
        this.getEchartFn();
        this.getWorkTicketDetailListFn();
      } else {
        //下级
        this.searchData.orgNo = this.orgNo;
        this.searchDatas.orgNo = this.orgNo;
        this.getWorkTicketTableListFn();
        this.getEchartsFn();
      }
    },
    //本级-票卡单明细
    getWorkTicketDetailListFn() {
      let params = {
        endDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[1]
            ? this.searchDatas.dateTime[1]
            : ''
          : '',
        startDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[0]
            ? this.searchDatas.dateTime[0]
            : ''
          : '',
        personName: this.searchDatas.user,
        orgNo: this.orgNo,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
      };
      this.loadingTable = true;
      getWorkTicketDetailList(params)
        .then((res) => {
          this.loadingTable = false;
          if (res.data.RT_F === 1) {
            let columnArr = [],
              list = res.data.DTS.list || [],
              tableArr = [];
            this.tableCount = res.data.DTS.total || 0;
            list.forEach((item, index) => {
              if (index === 0) {
                //column
                columnArr.push(
                  {
                    prop: 'personName',
                    label: '人员',
                    width: '100px',
                  },
                  {
                    prop: 'qty',
                    label: '总数',
                    width: '100px',
                  },
                  {
                    prop: 'unqualifiedQty',
                    label: '不合格数',
                    width: '120px',
                  },
                  {
                    prop: 'unqualifiedRatio',
                    label: '不合格率',
                    width: '120px',
                  }
                );
                item.wtTypes.forEach((ite, inde) => {
                  let columnObj = {
                    label: ite.wtTypeName,
                    children: [
                      {
                        prop: 'qty' + inde,
                        label: '总数',
                        width: '100px',
                      },
                      {
                        prop: 'unqualifiedQty' + inde,
                        label: '不合格数',
                        width: '100px',
                      },
                      {
                        prop: 'unqualifiedRatio' + inde,
                        label: '不合格率',
                        width: '120px',
                      },
                    ],
                  };
                  columnArr.push(columnObj);
                });
              }
              let obj = {
                personName: item.personName,
                qty: item.qty,
                unqualifiedQty: item.unqualifiedQty,
                unqualifiedRatio: item.unqualifiedRatio,
              };
              item.wtTypes.forEach((ite, inde) => {
                for (let it in ite) {
                  obj[it + inde] = ite[it];
                }
              });
              tableArr.push(obj);
            });
            this.columns = [...columnArr];
            this.tableData = [...tableArr];
          } else {
            this.tableCount = 0;
            this.tableData = [];
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.tableCount = 0;
          this.tableData = [];
          this.loadingTable = false;
        });
    },
    //本级-票卡单图表
    getEchartFn(e) {
      if (!e) {
        //工作票类型
        this.pieData = [];
        this.sumt = 0;
        this.loadingPie = true;
        getWorkTicketTypePieChart({
          orgNo: this.orgNo,
          endDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[1]
              ? this.searchDatas.dateTime[1]
              : ''
            : '',
          startDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[0]
              ? this.searchDatas.dateTime[0]
              : ''
            : '',
          personName: this.searchDatas.user,
        })
          .then((res) => {
            this.loadingPie = false;
            if (res.data.RT_F === 1) {
              let arr = res.data.DTS.items || [];
              this.pieData = arr.map((item) => {
                let obj = {
                    value: item.qty || 0,
                    name: item.wtName || '',
                  },
                  num = item.qty || 0;
                this.sumt += num;
                return obj;
              });
              this.$nextTick(() => {
                this.initCharts();
                this.initResizeObserver(1);
              });
            } else {
              this.$message({
                type: 'error',
                message: res.data.RT_D,
                showClose: true,
              });
            }
          })
          .catch(() => {
            this.loadingPie = false;
          });
      }
      //票卡单
      this.loadingBar = true;
      this.xLabels = [];
      this.barData = this.$options.data.call(this).barData;
      getWorkTicketBarChart({
        orgNo: this.orgNo,
        wtType: this.currentTab === '07' ? '' : this.currentTab,
        endDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[1]
            ? this.searchDatas.dateTime[1]
            : ''
          : '',
        startDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[0]
            ? this.searchDatas.dateTime[0]
            : ''
          : '',
        personName: this.searchDatas.user,
      })
        .then((res) => {
          this.loadingBar = false;
          if (res.data.RT_F === 1) {
            let obj = res.data.DTS || {};
            this.xLabels = obj.personNames || [];

            this.barData.tickets = obj.qtys || [];
            this.barData.invalid = obj.unqualifiedQtys || [];
            this.barData.rate = obj.unqualifiedRatios || [];
            this.$nextTick(() => {
              this.updateChart();
              this.initResizeObserver(2);
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.loadingBar = false;
        });
    },
    //下级-票卡单图表
    getEchartsFn(e) {
      if (!e) {
        //工作票类型
        this.pieData = [];
        this.sumt = 0;
        this.loadingPie = true;
        getWorkTicketTypeList({
          orgNo: this.searchDatas.orgNo,
          endDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[1]
              ? this.searchDatas.dateTime[1]
              : ''
            : '',
          startDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[0]
              ? this.searchDatas.dateTime[0]
              : ''
            : '',
        })
          .then((res) => {
            this.loadingPie = false;
            if (res.data.RT_F === 1) {
              let arr = res.data.DTS.workTicketStatsVoList || [];
              this.pieData = arr.map((item) => {
                let obj = {
                    value: item.totalQuantity || 0,
                    name: item.wtTypeName || '',
                  },
                  num = item.totalQuantity || 0;
                this.sumt += num;
                return obj;
              });
              this.$nextTick(() => {
                this.initCharts();
                this.initResizeObserver(1);
              });
            } else {
              this.$message({
                type: 'error',
                message: res.data.RT_D,
                showClose: true,
              });
            }
          })
          .catch(() => {
            this.loadingPie = false;
          });
      }
      //票卡单
      this.loadingBar = true;
      this.xLabels = [];
      this.barData = this.$options.data.call(this).barData;
      getWorkTicketTypeChart({
        orgNo: this.searchDatas.orgNo,
        workType: this.currentTab,
        endDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[1]
            ? this.searchDatas.dateTime[1]
            : ''
          : '',
        startDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[0]
            ? this.searchDatas.dateTime[0]
            : ''
          : '',
      })
        .then((res) => {
          this.loadingBar = false;
          if (res.data.RT_F === 1) {
            let obj = res.data.DTS || {};
            this.xLabels = obj.orgNames || [];
            console.log(111111111, this.xLabels);

            this.barData.tickets = obj.totalCounts || [];
            this.barData.invalid = obj.unqualifiedCounts || [];
            this.barData.rate = obj.unqualifiedRates || [];
            this.$nextTick(() => {
              this.updateChart();
              this.initResizeObserver(2);
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.loadingBar = false;
        });
    },
    //下级-票卡单-票卡单明细
    getWorkTicketTableListFn() {
      let params = {
        endDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[1]
            ? this.searchDatas.dateTime[1]
            : ''
          : '',
        startDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[0]
            ? this.searchDatas.dateTime[0]
            : ''
          : '',
        orgNo: this.searchDatas.orgNo,
      };
      this.loadingTable = true;
      getWorkTicketTableList(params)
        .then((res) => {
          this.loadingTable = false;
          if (res.data.RT_F === 1) {
            let columnArr = res.data.DTS.paramList || [],
              tableArr = res.data.DTS.fromData || [];
            this.columns = [
              { label: '单位', prop: 'orgName' },
              { label: '总数', prop: 'totalCount' },
              { label: '不合格数', prop: 'unqualifiedCount' },
              { label: '不合格率', prop: 'unqualifiedRate' },
              ...columnArr,
            ].map((item) => {
              item.width = item.label?.length <= 2 ? '100px' : ('120px' ?? '100px');
              if (item.children) {
                item.children.forEach((ite) => {
                  ite.width = ite.label?.length <= 2 ? '100px' : ('120px' ?? '100px');
                });
              }
              return item;
            });
            this.tableData = [...tableArr];
          } else {
            this.tableData = [];
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.tableData = [];
          this.loadingTable = false;
        });
    },
    initResizeObserver(type) {
      //type:1-饼图 2-柱状图
      if (type === 2) {
        //根据监听柱状图容器大小变化，实时更新图表大小
        this.resizeObserverBar = new ResizeObserver(() => {
          this.chartInstance.resize();
        });
        this.resizeObserverBar.observe(this.$refs.chart);
      }
      if (type === 1) {
        //根据监听饼图容器大小变化，实时更新图表大小
        this.resizeObserverPie = new ResizeObserver(() => {
          this.pieChart.resize();
        });
        this.resizeObserverPie.observe(this.$refs.pieChart);
      }
    },
    destoryResizeObserver() {
      if (this.resizeObserverBar) {
        this.resizeObserverBar.disconnect();
      }
      if (this.resizeObserverPie) {
        this.resizeObserverPie.disconnect();
      }
    },
    sizeChange(e) {
      this.pageIndex = 1;
      this.pageSize = e;
      this.getWorkTicketDetailListFn();
    },
    pageChange(e) {
      this.pageIndex = e;
      this.getWorkTicketDetailListFn();
    },
    //导出
    newExportClick() {
      if (!this.tableData.length) {
        return this.$message.error('暂无数据可以导出!');
      }
      this.exportClick();
    },
    exportClick() {
      let exportClickparams = {
          endDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[1]
              ? this.searchDatas.dateTime[1]
              : ''
            : '',
          startDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[0]
              ? this.searchDatas.dateTime[0]
              : ''
            : '',
        },
        url = null;
      if (this.pageFlag) {
        //本级
        exportClickparams = {
          ...exportClickparams,
          personName: this.searchDatas.user,
          orgNo: this.orgNo,
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
        };
        url = '/safemanage-evaluation/productionFactor/exportWorkTicketDetailList';
      } else {
        //下级
        exportClickparams = {
          ...exportClickparams,
          orgNo: this.searchDatas.orgNo,
        };
        url = '/safemanage-evaluation/productionFactorSub/workTicketTableListExport';
      }
      var form = document.createElement('form');
      form.style.display = 'none';
      form.action = url; // 测试时需要改动
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
    updateChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      let option = {
        grid: {
          left: '3%',
          right: '4%',
          top: 60,
          bottom: this.xLabels.length > 10 ? 50 : 30,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params) => {
            let str = params[0].name + '<br/>';
            params.forEach((item) => {
              str += `${item.marker} ${item.seriesName}：${item.value}${
                item.seriesName === '不合格率' ? '%' : ''
              }<br/>`;
            });
            return str;
          },
        },
        legend: {
          data: ['开票总数', '不合格数', '不合格率'],
          right: 20,
        },
        dataZoom: [
          // 外部滑块（可选，用于拖动）
          {
            // show: this.xLabels.length > 5 ? true : false,
            type: 'slider',
            start: 30,
            end: 70,
            showDetail: false, // 去掉细节提示，让滚动条简洁
            labelFormatter: () => '', // 隐藏标签，避免“明细”
            handleStyle: {
              color: '#c0c0c0', // 调整手柄样式，更柔和
            },
            bottom: 5, // 控制位置，不要太挤
            height: 8, // 默认高度，不要设太高
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: this.xLabels,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                width: 1,
                color: '#e6e6e6',
              },
            },
          },
          {
            type: 'value',
            name: '百分比(%)',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                width: 1,
                color: '#e6e6e6',
              },
            },
            min: 0,
            max: 100,
            interval: 20,
          },
        ],
        backgroundColor: 'rgba(2,155,130,0.03)',
        series: [
          {
            name: '开票总数',
            type: 'bar',
            barWidth: '30%',
            data: this.barData.tickets,
            barMaxWidth: 18,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#D4EEE7' },
                { offset: 1, color: '#14C893' },
              ]),
              borderRadius: [50, 50, 0, 0],
            },
          },
          {
            name: '不合格数',
            type: 'bar',
            barWidth: '30%',
            data: this.barData.invalid,
            barMaxWidth: 18,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#FCD9B9' },
                { offset: 1, color: '#F98A23' },
              ]),
              borderRadius: [50, 50, 0, 0],
            },
          },
          {
            name: '不合格率',
            type: 'line',
            yAxisIndex: 1,
            data: this.barData.rate,
            symbol: 'none',
            itemStyle: {
              color: '#F03123',
            },
          },
        ],
      };
      if (this.xLabels.length < 10) {
        option.dataZoom = [];
      }

      this.chartInstance.setOption(option);
    },

    switchTab(tabKey) {
      if (this.loadingBar) return;
      this.currentTab = tabKey;
      if (this.pageFlag) {
        //本级
        this.getEchartFn(1);
      } else {
        //下级
        this.getEchartsFn(1);
      }
    },
    searchSubmit() {
      this.searchDatas = { ...this.searchData };
      this.pageIndex = 1;
      if (this.pageFlag) {
        //本级
        this.getEchartFn();
        this.getWorkTicketDetailListFn();
      } else {
        //下级
        this.getWorkTicketTableListFn();
        this.getEchartsFn();
      }
    },
    refresh() {
      this.searchData = this.$options.data.call(this).searchData;
      this.searchSubmit();
    },
    initCharts() {
      this.pieChart = echarts.init(document.getElementById('pie-chart'));
      const option = {
        backgroundColor: 'rgba(2,155,130,0.03)',
        title: {
          text: this.sumt,
          subtext: '开票总数',
          left: 'center',
          top: '40%',
          textStyle: { fontSize: 16, fontWeight: 'bold' },
          subtextStyle: { fontSize: 16, color: '#333' },
        },
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: ['40%', '55%'],
            color: ['#2AE520', '#00E2A0', '#00E5E5', '#32BEFF', '#7A9DFF', '#B28CF3'],
            data: this.pieData,
            itemStyle: {
              normal: {
                borderColor: '#f7fcfb',
                borderWidth: 2,
                borderRadius: 4,
              },
            },
            labelLine: {
              length: 30,
              length2: 140,
            },
            label: {
              show: true,
              // formatter: "{b} {c} {d}%",
              padding: [0, -140, 20, -140], //调整文字和指示线距离
              rich: {
                a: {
                  color: '#2a2b2f',
                  fontSize: 14,
                  lineHeight: 32,
                  align: 'right',
                },
                b: {
                  fontSize: 14,
                  lineHeight: 32,
                  fontWeight: 'bold',
                  align: 'right',
                },
              },
              formatter: (e) => {
                return '{a|' + e.name + '}' + ' ' + '{b|' + e.value + ' ' + e.percent + '%}';
              },
            },
          },
        ],
      };
      this.pieChart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
@import './style.scss';
.table-container {
  /* margin-top: 10px;
  border: 1px dashed #e6e6e6;
  border-radius: 4px;
  overflow: hidden; */
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 0 20px 0;
  .table-box {
    flex: 1;
    overflow: hidden;
  }

  .table-name {
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-button {
    border: 2px dashed #dee0e6;
  }
}
.new-safeweb-web {
  // display: unset !important;

  display: flex;
  flex-direction: column;
  // flex: 1;
  // width: 100%;
  // height: 100%;
  // flex-grow: 1;
  // text-align: center;
  justify-items: center;
}
.ticket-view {
  display: flex;
  flex-direction: column;
  background: #fff;
}
.view-top {
  border-radius: 0 0 4px 4px;
  margin-bottom: 20px;
}
.view-bottom {
  border-radius: 4px;
}
.innerbox {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  padding-bottom: 20px;
  overflow: auto;
  & > div {
    overflow: hidden;
    box-sizing: border-box;
  }
  .innerbox-left {
    flex: 1;
    min-width: 700px;
  }
  .innerbox-right {
    flex: 2;
    padding: 0 20px;
    min-width: 900px;
  }
  // align-items:center;
  //   justify-content: space-between;
  // text-align: center;
  // justify-items: center;
}
.style-form {
  display: flex;
  border-bottom: 1px solid #e9ebef;
  flex-wrap: wrap;
  .flex-row-end {
    flex: 1;
    margin-bottom: 20px;
  }
}
.innerbox2 {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  .cardboxpd {
    margin-top: 20px;
    border-radius: 4px 4px 0 0;
  }
}
.padding-chart {
  padding: 0 20px;
}
.chart-row {
  width: 100%;
  .chart-item {
    background: white;
    border-radius: 8px;
    width: 100%;
    .pie-chart {
      height: 300px;
      width: 100%;
    }
    .nullData {
      height: 300px;
    }
    .bar-chart {
      width: 100%;
      height: 300px;
    }
  }
  .chart-item-right {
    flex-grow: 1;
    .echarts-bar {
      height: 300px;
      width: 100%;
    }
  }
}

// h3 {
//   margin: 16px 0px 10px 25px !important;
// }
.clentt {
  color: #009b83;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  padding: 0 0px;
}
.clentt1 {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  padding: 0 0px;
  .btn-list {
    margin-left: 20px;
    display: flex;
    align-items: center;
    .btn-box {
      display: flex;
      flex-wrap: nowrap;
      color: #7b807e;
      font-size: 12px;
      background: #efefef;
      border-radius: 12px;
      .btn-item {
        padding: 0 9px;
        border-radius: 12px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
      }
      .active {
        background: #2ba174;
        color: #fff;
      }
    }
  }
}
.stylet {
  display: flex;
  justify-content: center;
  text-align: center;
  justify-items: center;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: bold;
  color: #333;
}

.segment {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
}

.green {
  background: #409eff;
}
.blue {
  background: #66b1ff;
}
.teal {
  background: #13ce66;
}
.orange {
  background: #ffb900;
}
.purple {
  background: #9a66ff;
}

.labels {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.ticket-chart {
  margin-top: 20px;
}

.axis-y {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.bars {
  display: flex;
  justify-content: space-around;
  margin-left: 40px;
  width: calc(100% - 40px);
}

.bar {
  width: 20px;
  background: #ccc;
  margin: 0 2px;
}

.green {
  background: #409eff;
}
.orange {
  background: #ffb900;
}
.red {
  background: #f56c6c;
}

.x-axis {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}
</style>
