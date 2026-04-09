<template>
  <!-- 问题监控组件 -->
  <el-container class="new-safeweb-web">
    <div v-show="isCollapsed1" class="work-order-card" shadow="never">
      <!-- title部分 -->
      <div class="card-header">
        <span class="card-title"
          >问题监控
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
          <span class="more" @click="goNewPage('problemmMoniMore')">更多></span>
        </div>
      </div>
      <!-- 内容 -->
      <div class="card-body">
        <!-- 处理质量 -->
        <div v-loading="qualityLoading" class="section3">
          <div class="titleContainer">
            <img src="@/assets/iconfont/icon/二级标题右.svg" alt="baobiao" width="20" height="20" />
            <div class="title-box">
              <span class="title-text">处理质量</span>
            </div>
          </div>
          <div id="zhiliang"></div>
        </div>
        <!-- 风险防范 -->
        <div v-loading="riskLoading" class="section2">
          <div class="newcontainer">
            <div class="titleContainer">
              <img
                src="@/assets/iconfont/icon/二级标题右.svg"
                alt="baobiao"
                width="20"
                height="20"
              />
              <div class="title-box">
                <span class="title-text">风险防范</span>
                <div class="funcontainer">
                  <el-breadcrumb separator="|">
                    <el-breadcrumb-item
                      ><span
                        class="tab-text"
                        :class="{ 'tab-active': activeName == '01' }"
                        @click="handleClick('01')"
                        >环比</span
                      ></el-breadcrumb-item
                    >
                    <el-breadcrumb-item
                      ><span
                        class="tab-text"
                        :class="{ 'tab-active': activeName == '02' }"
                        @click="handleClick('02')"
                        >同比</span
                      ></el-breadcrumb-item
                    >
                  </el-breadcrumb>
                  <!-- <el-tabs
                class="tabsgroup"
                type="card"
                v-model="activeName"
                @tab-click="handleClick"
              >
                <el-tab-pane label="环比" name="01"></el-tab-pane>
                <el-tab-pane label="同比" name="02"></el-tab-pane>
              </el-tabs> -->
                  <el-popover placement="bottom-end" trigger="click">
                    <el-checkbox-group v-model="checkList" class="checkbox-group-width">
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
          </div>
          <div class="stat-box">
            <div v-for="item in workOrderGenStats" :key="item.label" class="stat-item">
              <div class="stat-number">
                {{ item.value }}
                <span class="danwei">条</span>
              </div>
              <div class="stat-label">{{ item.label }}</div>
              <div :class="['stat-change', item.trend === 'up' ? 'green' : 'red']">
                <span style="color: black">{{ acname }}</span>
                <div :class="item.trend === 'up' ? 'upicon' : 'downicon'"></div>
                {{ item.change }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isCollapsed2" class="mincard">
      <div>问</div>
      <div>题</div>
      <div>监</div>
      <div>控</div>
      <div class="card-arrow" @click="toggleCollapse"></div>
    </div>
  </el-container>
</template>

<script>
import API from '@/api/hierarchicalControl/secondlevel.js';
import { getUserOrgInfo } from '@/api/common/index.js';
import * as echarts from 'echarts';
export default {
  name: 'WorkOrderManagement',
  props: {
    orgNo: {
      type: String,
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
      checkList: ['安全问题', '廉政问题', '服务问题'], //风险防范配置
      qualityLoading: false, //质量loading状态
      riskLoading: false, //风险loading状态
      checkOptions: ['安全问题', '廉政问题', '服务问题', '通报次数'], //配置项
      activeName: '01',
      isCollapsed1: true,
      isCollapsed2: false,
      selectedDate: '05',
      acname: '环比',
      dateOptions: [
        { label: '本周', value: '05' },
        { label: '本月', value: '02' },
        { label: '本年', value: '04' },
      ],
      workOrderGenStatsAll: [
        { label: '安全问题', value: '0', trend: '', change: '' },
        { label: '廉政问题', value: '0', trend: '', change: '' },
        { label: '服务问题', value: '0', trend: '', change: '' },
        { label: '通报次数', value: '0', trend: '', change: '' },
      ],
      myChart: null, //统计图实例
      xData: [], //x轴数据
      totalCount: [], //工单总数
      qualityProblemCount: [], //质量问题工单数
      qualityProblemRate: [], //质量问题工单占比
    };
  },
  computed: {
    workOrderGenStats() {
      return this.workOrderGenStatsAll.filter((item) => {
        return this.checkList.includes(item.label);
      });
    },
  },
  watch: {
    orgNo(newVal) {
      this.problemMonitor();
      this.riskPrevention();
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
      this.problemMonitor();
      this.riskPrevention();
    },
  },
  mounted() {
    this.problemMonitor();
    this.riskPrevention();
  },
  methods: {
    // 处理质量
    async problemMonitor() {
      let param = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      this.qualityLoading = true;
      let res = await API.problemMonitor(param).finally(() => (this.qualityLoading = false));
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.xData = DTS.map((item) => item.orgName);
        this.totalCount = DTS.map((item) => item.totalCount);
        this.qualityProblemCount = DTS.map((item) => item.qualityProblemCount);
        this.qualityProblemRate = DTS.map((item) => item.qualityProblemRate);
        this.getzhiliang();
      } else {
        this.$message.error(RT_D);
      }
    },
    // 风险防范
    async riskPrevention() {
      let param = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      this.riskLoading = true;
      let res = await API.riskPrevention(param).finally(() => (this.riskLoading = false));
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        if (this.activeName === '01') {
          this.workOrderGenStatsAll = [
            {
              label: '安全问题',
              value: DTS.safeProblemCount,
              trend: DTS.safeProblemMom > 0 ? 'up' : 'down',
              change: `${DTS.safeProblemMom}%`,
            },
            {
              label: '廉政问题',
              value: DTS.integrityProblemCount,
              trend: DTS.integrityProblemMom > 0 ? 'up' : 'down',
              change: `${DTS.integrityProblemMom}%`,
            },
            {
              label: '服务问题',
              value: DTS.serverProblemCount,
              trend: DTS.serverProblemMom > 0 ? 'up' : 'down',
              change: `${DTS.serverProblemMom}%`,
            },
            {
              label: '通报次数',
              value: DTS.notifyCount,
              trend: DTS.notifyMom > 0 ? 'up' : 'down',
              change: `${DTS.notifyMom}%`,
            },
          ];
        } else {
          this.workOrderGenStatsAll = [
            {
              label: '安全问题',
              value: DTS.safeProblemCount,
              trend: DTS.safeProblemYoy > 0 ? 'up' : 'down',
              change: `${DTS.safeProblemYoy}%`,
            },
            {
              label: '廉政问题',
              value: DTS.integrityProblemCount,
              trend: DTS.integrityProblemYoy > 0 ? 'up' : 'down',
              change: `${DTS.integrityProblemYoy}%`,
            },
            {
              label: '服务问题',
              value: DTS.serverProblemCount,
              trend: DTS.serverProblemYoy > 0 ? 'up' : 'down',
              change: `${DTS.serverProblemYoy}%`,
            },
            {
              label: '通报次数',
              value: DTS.notifyCount,
              trend: DTS.notifyYoy > 0 ? 'up' : 'down',
              change: `${DTS.notifyYoy}%`,
            },
          ];
        }
      } else {
        this.$message.error(RT_D);
      }
    },
    // 环比同比切换
    handleClick(tab) {
      this.activeName = tab;
      if (tab === '01') {
        this.acname = '环比';
      } else {
        this.acname = '同比';
      }
      this.riskPrevention();
    },
    // 卡片折叠
    toggleCollapse() {
      this.isCollapsed1 = !this.isCollapsed1;
      this.isCollapsed2 = !this.isCollapsed2;
      this.$emit('cardToggle', {
        type: 'rightCardConfig',
        toggle: this.isCollapsed1,
        is: this.cardId,
      });
    },
    // 处理质量统计图
    getzhiliang() {
      var chartDom = document.getElementById('zhiliang');
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(chartDom);

      var option = {
        tooltip: {
          position: 'bottom',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (params) {
            let result = params[0].name + '<br/>';
            params.forEach((item) => {
              switch (item.seriesType) {
                case 'line':
                  result += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
                  break;
                case 'bar':
                  result += `${item.marker} ${item.seriesName}: ${item.value}个<br/>`;
                  break;
              }
            });
            return result;
          },
        },
        legend: {
          data: ['完成工单总数', '质量问题数', '问题占比'],
          top: '10',
          right: '5',
        },
        grid: {
          top: 45, // 距离容器上方的距离
          bottom: 5, // 距离容器下方的距离
          left: 10, // 留给y轴刻度
          right: 10, // 留点空间给右侧
          containLabel: true, // 让标签也在grid里
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisPointer: {
              type: 'shadow',
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e6e6e6',
              },
            },
            axisLabel: {
              color: '#2A2B2F',
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位(个)',
            nameTextStyle: {
              color: '#2A2B2F',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e6e6e6',
              },
            },
            axisTick: {
              show: true,
            },
            axisLabel: {
              color: '#2A2B2F',
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                width: 1,
              },
            },
          },
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: '{value} %',
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '完成工单总数',
            type: 'bar',
            data: this.totalCount,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
              color: {
                type: 'linear',
                x: 0, // 渐变起始x
                y: 0, // 渐变起始y
                x2: 0, // 渐变结束x
                y2: 1, // 渐变结束y
                colorStops: [
                  {
                    offset: 0,
                    color: '#029C84', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#54C8B6', // 100% 处的颜色
                  },
                ],
              },
            },
          },
          {
            name: '质量问题数',
            type: 'bar',
            data: this.qualityProblemCount,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
              color: {
                type: 'linear',
                x: 0, // 渐变起始x
                y: 0, // 渐变起始y
                x2: 0, // 渐变结束x
                y2: 1, // 渐变结束y
                colorStops: [
                  {
                    offset: 0,
                    color: '#FC8E32', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(252, 142, 50, 0.702)', // 100% 处的颜色
                  },
                ],
              },
            },
          },
          {
            name: '问题占比',
            type: 'line',
            yAxisIndex: 1,
            data: this.qualityProblemRate,
            lineStyle: {
              color: 'rgba(252, 142, 50, 0.702)', // 蓝色线段
              width: 3,
              shadowColor: 'rgba(252, 142, 50, 0.702)', // 线条阴影
              shadowBlur: 15,
              shadowOffsetY: 6,
            },
            itemStyle: {
              color: 'rgba(252, 142, 50, 0.702)', // 节点内部为蓝色
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
    // 当已经选中 3 个并且该项还未被选中时，禁用它
    isDisabled(item) {
      return (
        (this.checkList.length >= 3 && !this.checkList.includes(item)) ||
        (this.checkList.length == 1 && this.checkList.includes(item))
      );
    },
    // 点击更多跳转
    goNewPage(pageIndex) {
      this.$emit('goNewPage', { id: pageIndex }, this.selectedDate);
    },
  },
};
</script>

<style lang="scss" scoped>
.upicon {
  width: 4px;
  height: 11px;
  background-image: url('~@/assets/iconfont/icon/上升.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.downicon {
  width: 4px;
  height: 11px;
  background-image: url('~@/assets/iconfont/icon/降低.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.new-safeweb-web {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 16px;
  pointer-events: all;
}
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
  width: 446px;
  height: 493px;
  background-color: #fff;
  border-radius: 10px;
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
    background-color: #d3f4ed;
    font-size: 14px;
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
    border-radius: 10px;
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
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
      .more {
        font-size: 14px;
        color: gray;
        cursor: pointer;
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
    }
  }
  .card-body {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    padding: 0 10px;
    height: 100%;
    .section2 {
      flex: 1;
      padding-bottom: 16px;
      .newcontainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        height: 24px;
        .titleContainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          .title-box {
            display: flex;
            justify-content: space-between;
            flex: 1;
            background-image: url('~@/assets/iconfont/icon/二级标题背景.svg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
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
      .stat-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: calc(100% - 29px);
        .stat-item {
          width: 30%;
          height: 100%;
          text-align: center;
          border-radius: 4px;
          background-image: url('~@/assets/iconfont/icon/作业问题背景.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          .stat-number {
            font-size: 18px;
            font-weight: bold;
            color: #303133;
            padding: 30px 0;
            .danwei {
              font-size: 12px;
            }
          }

          .stat-label {
            font-size: 14px;
            padding-bottom: 13px;
          }
          .stat-change {
            font-size: 12px;
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
    }
    .section3 {
      margin-bottom: 18px;
      .titleContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 24px;
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
      #zhiliang {
        width: 100%;
        height: 217px;
      }
    }
  }
}
.checkbox-group-width {
  width: 100px;
}
</style>
