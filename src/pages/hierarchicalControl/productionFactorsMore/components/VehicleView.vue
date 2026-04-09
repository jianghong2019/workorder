<template>
  <div class="new-safeweb-web">
    <div class="headstyle">
      <!-- 车辆实时情况 -->
      <div class="real-time-status">
        <div class="boxcontain">
          <div class="title-name">车辆实时情况</div>
          <div class="boxtext">
            <div class="status-card">
              <div class="icon-wrapper">
                <img src="@/assets/iconfont/icon/生产要素-车辆1.svg" alt="" />
                <!-- <img src="@/assets/images/uer-portrait/touxiang.png" /> -->
              </div>
              <div class="backgroundicon">
                <div>
                  <div class="total">200<b class="unit">辆</b></div>

                  <div class="desc">车辆总数</div>
                </div>
              </div>
            </div>

            <div class="carbox">
              <div class="stat-item1">车辆实时状态</div>

              <div class="stat-item2">
                <div class="iconstyle">
                  <img src="@/assets/iconfont/icon/生产要素-车辆小汽车.svg" alt="" />

                  <div>使用中数量</div>
                </div>

                <div class="text">
                  <div><strong :title="'123'" class="bg1">165</strong> 辆</div>
                </div>
              </div>

              <div class="stat-item2">
                <div class="iconstyle">
                  <img src="@/assets/iconfont/icon/生产要素-车辆时钟.svg" alt="" />

                  <div>空闲数量</div>
                </div>

                <div class="text">
                  <div><strong :title="'123'" class="bg2">35</strong> 辆</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <!-- 图表标题 -->
          <div class="chart-header">
            <div class="title-name">车辆申请情况</div>
            <div class="time-picker">
              <span class="time">时间选择：</span>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="~"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="updateChart"
              ></el-date-picker>
            </div>
          </div>

          <!-- ECharts 图表容器 -->
          <div class="echarts-container">
            <div class="stats">
              <div class="stat-item">
                <img src="@/assets/iconfont/icon/生产要素-车辆4.svg" alt="" class="icon" />
                <div class="text-stack">
                  <span>235</span>
                  <div class="label">车辆申请次数</div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="stat-item">
                <img src="@/assets/iconfont/icon/生产要素-车辆审批1.svg" alt="" class="icon" />

                <div class="label">审批通过<span class="no-bracket">占</span></div>
                <div class="bg1">765</div>
              </div>
              <div class="stat-item">
                <img src="@/assets/iconfont/icon/生产要素-车辆审批2.svg" alt="" class="icon" />

                <div class="label">审批不通过</div>
                <div class="bg2">70</div>
              </div>
            </div>
            <div class="echarts-box">
              <div ref="chart" class="chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 查询表单 -->
    <el-header class="cardboxpd">
      <el-form
        id="searchData"
        ref="searchData"
        :model="searchData"
        :label-width="pageFlag ? '110px' : '80px'"
        class="searchData search_input"
        target="stop"
      >
        <div class="style-form">
          <el-form-item v-if="!pageFlag" label="日期选择：" prop="dateTime" class="date-box">
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
          <el-form-item v-if="!pageFlag" label="单位：" prop="orgId">
            <org-tree v-model="searchData.orgId" :unit-data="unitData"></org-tree>
          </el-form-item>
          <el-form-item v-if="pageFlag" label="审批状态：">
            <el-select v-model="searchData.devStatus" placeholder="请选择" clearable>
              <el-option label="已发放" value="02"></el-option>
              <el-option label="未发放" value="01"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="pageFlag" label="车牌号：">
            <el-input v-model="searchData.createUser" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="pageFlag" label="申请时间：" prop="dateTime" class="date-box">
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
          <el-form-item v-if="pageFlag" label="申请人：">
            <el-input v-model="searchData.assetNo" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="pageFlag" label="申请人电话：">
            <el-input v-model="searchData.imeiNo" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="pageFlag" label="用车事由：">
            <el-select v-model="searchData.useRecord" placeholder="请选择" clearable>
              <el-option label="启用" value="1"></el-option>
              <el-option label="未启用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="pageFlag" label="用车人：">
            <el-input v-model="searchData.manageUser" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <div class="flex-row-end search-buttons">
            <el-button class="el-btn-new reset-btn" plain size="small" @click="refresh"
              >重 置</el-button
            >
            <el-button
              class="el-btn-new search-btn"
              type="primary"
              plain
              size="small"
              @click="searchSubmit"
              >查 询
            </el-button>
          </div>
        </div>
      </el-form>
    </el-header>

    <!-- 表格 -->
    <!-- 各单位质量情况表格 -->
    <div class="table-container">
      <div class="table-name">
        <div class="title-name">车辆申请记录</div>
        <el-button class="el-btn-new reset-btn" size="small" @click="newExportClick">
          <i class="iconfont icon-daochu1"></i>
          导出
        </el-button>
      </div>
      <div class="table-box">
        <personTable
          :table-data="tableData"
          :columns="getColumns()"
          :table-count="tableCount"
          :page-index="pageIndex"
          :page-size="pageSize"
          @sizeChange="sizeChange"
          @pageChange="pageChange"
        ></personTable>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import personTable from './personTable.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import { useUnitData } from '@/composables/useUnitData.js';
export default {
  components: {
    OrgTree,
    personTable,
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
  },
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
    };
  },
  data() {
    return {
      resizeObserverBar: null,
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      dateRange: ['2022-07-17', '2022-07-17'],
      chartInstance: null,
      chartData: [
        { date: '10-8', value: 75 },
        { date: '10-9', value: 30 },
        { date: '10-10', value: 60 },
        { date: '10-11', value: 25 },
        { date: '10-12', value: 70 },
        { date: '10-13', value: 70 },
        { date: '10-14', value: 70 },
        { date: '10-15', value: 70 },
      ],
      searchData: {},
      unit: '',
      dateRange: '',
      barGroups: [
        { height: '80px' },
        { height: '40px' },
        { height: '60px' },
        { height: '30px' },
        { height: '70px' },
        { height: '80px' },
        { height: '70px' },
        { height: '80px' },
        { height: '60px' },
        { height: '70px' },
      ],
      xLabels: ['10-8', '10-9', '10-10', '10-11', '10-12', '10-13', '10-14', '10-15'],
      tableData: [
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
        { index: 123 },
      ],
      column: [
        {
          label: '单位',
          prop: 'index',
          width: '120',
        },
        {
          label: '车辆总数',
          prop: 'index1',
          width: '120',
        },
        {
          label: '理论出车次数',
          prop: 'index2',
          width: '120',
        },
        {
          label: '实际出车次数',
          prop: 'index3',
          width: '120',
        },
        {
          label: '日均使用次数',
          prop: 'index4',
          width: '120',
        },
        {
          label: '车辆申请次数',
          prop: 'index5',
          width: '120',
        },
        {
          label: '用车总时长',
          prop: 'index6',
          width: '120',
        },
      ],
      columns: [
        {
          label: '车牌号',
          prop: 'index',
          width: '120',
        },
        {
          label: '申请时间',
          prop: 'index1',
          width: '120',
        },
        {
          label: '申请人',
          prop: 'index2',
          width: '120',
        },
        {
          label: '申请人电话',
          prop: 'index3',
          width: '120',
        },
        {
          label: '计划用车时间',
          prop: 'index4',
          width: '120',
        },
        {
          label: '用车事由',
          prop: 'index5',
          width: '120',
        },
        {
          label: '用车人',
          prop: 'index6',
          width: '120',
        },
        {
          label: '用车人电话',
          prop: 'index7',
          width: '120',
        },
        {
          label: '审批状态',
          prop: 'index8',
          width: '120',
        },
      ],
    };
  },
  computed: {
    getColumns() {
      return () => {
        return this.pageFlag ? this.columns : this.column;
      };
    },
  },
  mounted() {
    this.updateChart();
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destoryResizeObserver();
  },
  methods: {
    sizeChange() {},
    pageChange() {},
    newExportClick() {},
    refresh() {},
    searchSubmit() {},
    initResizeObserver(type) {
      //根据监听柱状图容器大小变化，实时更新图表大小
      this.resizeObserverBar = new ResizeObserver(() => {
        this.chartInstance.resize();
      });
      this.resizeObserverBar.observe(this.$refs.chart);
    },
    destoryResizeObserver() {
      this.resizeObserverBar.disconnect();
    },
    updateChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      const option = {
        grid: {
          left: 60,
          right: 20,
          bottom: 30,
          top: 40,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['申请数'],
          right: 28,
          top: 10,
          textStyle: {
            fontSize: 12,
            color: '#666',
          },
        },
        xAxis: {
          type: 'category',
          data: this.chartData.map((item) => item.date),
          axisLabel: {
            color: '#666',
            fontSize: 12,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          name: '单位 (次)',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              width: 1,
              color: '#e6e6e6',
            },
          },
          axisLabel: {
            color: '#2a2b2f',
            fontSize: 12,
          },
          axisLine: {
            lineStyle: {
              color: '#2a2b2f',
            },
          },
        },
        series: [
          {
            name: '申请数',
            type: 'bar',
            barWidth: '20',
            color: '#009b83',
            data: this.chartData.map((item) => item.value),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#0ABCA1' },
                { offset: 1, color: '#7EDCCE' },
              ]),
              borderRadius: [6, 6, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#7EDCCE' },
                  { offset: 1, color: '#0ABCA1' },
                ]),
              },
            },
          },
        ],
        animation: true,
        animationDuration: 1000,
      };

      this.chartInstance.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './style.scss';
h4 {
  margin: 16px 0px 10px 25px !important;
}
.table-container {
  background: white;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  border-radius: 0 0 4px 4px;
  .table-box {
    flex: 1;
    overflow: hidden;
    .style-table {
      :deep(.table-wrap) {
        padding: 0;
      }
    }
  }
  .table-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-name {
      padding-left: 0;
    }
  }
  .el-button {
    border: 2px dashed #dee0e6;
  }
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 0 20px 0 0;
  .title-name {
    padding-left: 0;
  }
}
.carbox {
  background: Linear-gradient(90deg, rgba(2, 156, 132, 0.1) 0%, rgba(84, 200, 182, 0.08) 100%);
  border-radius: 2px;
  padding: 16px 20px;
  width: 325px;
  box-sizing: border-box;
  .stat-item1 {
    font-size: 16px;
    margin-bottom: 16px;
    color: #426170;
  }
  .stat-item2 {
    display: flex;
    align-items: center;
    background-color: white;
    height: 60px;
    justify-content: space-between;
    padding: 0 32px 0 12px;
    &:nth-child(2) {
      margin-bottom: 12px;
    }
    .text {
      font-size: 14px;
      color: #3d3d3d;
      flex: 1;
      overflow: hidden;
      & > div {
        white-space: nowrap;
        display: flex;
        align-items: end;
      }
      strong {
        font-size: 24px;
        font-weight: bold;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        display: inline-block;
        text-align: right;
        margin-right: 8px;
      }
      .bg1 {
        color: #ff981b;
      }
      .bg2 {
        color: #3ed79e;
      }
    }
    .iconstyle {
      display: flex;
      align-items: center;
      margin-right: 20px;
      div {
        font-size: 14px;
        font-weight: bold;
        color: #2a2b2f;
        margin-left: 10px;
      }
    }
  }
}
.echarts-container {
  display: flex;
  box-sizing: border-box;
  height: 234px;
  .echarts-box {
    flex: 1;
    min-width: 906px;
    display: flex;
    background: #f7fcfb;
    margin-right: 20px;
    .chart {
      flex: 1;
      height: 234px;
    }
  }
}
.time-picker {
  display: flex;
  align-items: center;
  .time {
    color: #2a2b2f;
    font-size: 14px;
    line-height: 14px;
  }
  .el-date-editor {
    width: 260px;
  }
}

.new-safeweb-web {
  .headstyle {
    background: #fff;
    border-radius: 0 0 4px 4px;
  }
}

.real-time-status {
  display: flex;
  overflow: auto;
  .boxcontain {
    padding: 0 20px 20px 20px;
    .title-name {
      padding: 20px 0;
    }
    /* height: 100%; */
    /* border: 1px solid black; */
    .boxtext {
      background: #f7fcfb;
      height: 234px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 20px;
    }
  }
  .chart-container {
    // width: 48%;
    /* height: 100%; */
    flex: 1;
    background: white;
    // border: 1px dashed #e6e6e6;
    padding: 0px;
    border-radius: 8px;
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  }
}
.cardboxpd {
  margin-top: 20px;
  border-radius: 4px 4px 0 0;
  .style-form {
    display: flex;
    border-bottom: 1px solid #e9ebef;
    flex-wrap: wrap;
    .flex-row-end {
      flex: 1;
      margin-bottom: 20px;
    }
  }
}
.status-card {
  text-align: center;
  margin-right: 30px;
}

.icon-wrapper {
  /* width: 80px;
  height: 80px; */
  margin-bottom: 10px;
  width: 206px;
  box-sizing: border-box;
  border: 3px dashed #dee0e6;
}

.icon-wrapper img {
  width: 100%;
  /* height: 100%; */
  object-fit: cover;
}

.text {
  text-align: center;
}
.backgroundicon {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   height: 100%;
  text-align: center;
  height: 82px;
  background-image: url('~@/assets/iconfont/icon/生产要素-车辆背景图.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.total {
  font-size: 32px;
  font-weight: bold;
  color: #009b83;
  margin-bottom: 10px;
}

.unit {
  margin-left: 5px;
  font-size: 16px;
  font-weight: 400;
}

.desc {
  font-size: 18px;
  color: #426170;
}

.status-info {
  display: flex;

  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.icon-wrapper {
  margin-bottom: 6px;
}
.txt {
  text-align: center;
}
.total,
desc {
  text-align: center;
}
.item {
  flex: 1;
  text-align: center;
}

.label {
  font-size: 12px;
  color: #3ed79e;
}

.stats {
  background: #f7fcfb;
  width: 260px;
  padding: 20px;
  margin-right: 20px;
  .stat-item {
    display: flex;
    align-items: center;
    text-align: center;
    border-radius: 8px;
    .no-bracket {
      visibility: hidden;
    }
    .bg2 {
      font-size: 28px;
      font-weight: bold;
      color: #009b83;
      margin-left: 18px;
    }
    .bg1 {
      font-size: 28px;
      font-weight: bold;
      color: #ff981b;
      margin-left: 18px;
    }
    &:nth-child(1) {
      margin-bottom: 24px;
    }
    &:nth-child(3) {
      margin: 20px 0;
    }
  }
  .divider {
    height: 1px;
    background-color: rgba(0, 155, 131, 0.48);
  }
  .text-stack {
    display: flex;
    flex-direction: column;
    text-align: left;
    span {
      font-size: 28px;
      font-weight: bold;
      color: #1e4339;
      margin-bottom: 8px;
    }
  }

  .icon {
    margin-right: 12px;
  }
  .label {
    font-size: 14px;
    color: #426170;
  }
  .value {
    font-size: 16px;
    font-weight: bold;
    color: #ff981b;
  }
}

.bar-chart {
  position: relative;
  height: 200px;
  margin-top: 10px;
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

.bar-group {
  position: relative;
  width: 20px;
}

.bar {
  width: 100%;
  background: #409eff;
  margin: 0 2px;
  transition: all 0.3s ease;
}

.x-axis {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.table-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
}
</style>
