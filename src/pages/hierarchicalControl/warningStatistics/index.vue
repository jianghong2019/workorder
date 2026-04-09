<template>
  <el-container class="new-safeweb-web" style="height: 100%">
    <!-- 头 -->
    <el-header>
      <base-title-table title="预警统计">
        <template #right>
          <div class="flex-row-end">
            <el-button class="el-btn-new reset-btn" size="small" @click="goBack">
              <img src="@/assets/images/icon-img/icon-fanhui.png" alt="" />
              返回
            </el-button>
          </div>
        </template>
      </base-title-table>
    </el-header>
    <!-- 头 end -->
    <el-main class="cardbox-pd0 manage-main main">
      <div class="main-left">
        <div class="main-left-box1">
          <div class="box2">
            <div class="lineTitel_tiem">
              <div class="new-base-title">工作指标趋势</div>
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
            <div class="content">
              <lineChart linechart-id="lineChart" :config="lineConfig"></lineChart>
            </div>
          </div>
        </div>
        <!-- 左边大表格 -->
        <div class="main-left-box2">
          <div class="table">
            <bigTable
              :index="0"
              :date-range="dateRange"
              :org-id="orgId"
              @openOrder="openOrder"
            ></bigTable>
          </div>
        </div>
      </div>
      <div class="main-left">
        <div class="main-left-box1">
          <div class="box1">
            <div
              class="new-base-title process-title mb-10"
              style="height: 24px; margin-bottom: 12px"
            >
              预警分布
            </div>
            <div class="content">
              <div class="content-left">
                <pieChart pie-id="loginPie" :config="pieConfig"></pieChart>
              </div>
              <div class="content-right">
                <template v-for="item in pieConfig.data">
                  <el-row>
                    <el-col
                      :span="4"
                      class="icon"
                      :style="`background-color: ${item.color}`"
                    ></el-col>
                    <el-col :span="10">{{ item.name }}</el-col>
                    <el-col :span="7" style="text-align: center">{{ item.value }}</el-col>
                    <el-col :span="3" style="margin-left: 24px">{{ item.percent }}%</el-col>
                  </el-row>
                </template>
              </div>
              <div class="count">
                <span>{{ warnNum }}</span>
                <span>预警总数</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 左边大表格 -->
        <div class="main-left-box2">
          <div class="new-base-title process-title mb-10">预警情况</div>
          <div class="table">
            <bigTable :index="1" :org-id="orgId" @openOrder="openOrder"></bigTable>
          </div>
        </div>
      </div>
      <div class="main-right">
        <!-- 右侧数据模块 -->
        <div class="main-right-box1">
          <div class="new-base-title process-title mb-10" style="height: 24px; margin-bottom: 12px">
            资源预警
          </div>
          <div class="box1">
            <div class="box1-green">
              <div class="img">
                <img src="@/assets/images/hierarchicalControl/warningStatistics1.png" alt="" />
              </div>
              <div>
                <span>{{ resources.deviceNum }}</span>
                <span>工器具</span>
              </div>
            </div>
            <div class="box1-red">
              <div class="img">
                <img src="@/assets/images/hierarchicalControl/warningStatistics2.png" alt="" />
              </div>
              <div>
                <span>{{ resources.carNum }}</span>
                <span>车辆</span>
              </div>
            </div>
            <div class="box1-blue">
              <div class="img">
                <img src="@/assets/images/hierarchicalControl/warningStatistics3.png" alt="" />
              </div>
              <div>
                <span>{{ resources.suppliesNum }}</span>
                <span>物资</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧表格 -->
        <div class="main-right-box2">
          <div class="base-title process-title mb-10">
            工器具 <span @click="openDialog('工器具', '02')"> 详情 > </span>
          </div>
          <div>
            <smallTable :table="table1"></smallTable>
          </div>
        </div>
        <!-- 一阶段暂时不要 -->
        <!-- <div class="main-right-box3">
          <div class="base-title process-title mb-10">
            车辆 <span @click="openDialog('车辆', '02')"> 详情 > </span>
          </div>
          <div>
            <smallTable :table="table2"></smallTable>
          </div>
        </div> -->
        <div class="main-right-box3">
          <div class="base-title process-title mb-10">
            物资 <span @click="openDialog('物资', '02')"> 详情 > </span>
          </div>
          <div>
            <smallTable :table="table3"></smallTable>
          </div>
        </div>
      </div>
    </el-main>
    <!-- 弹窗表格 -->
    <warnDialog
      v-if="showWarnDialog"
      :show-dialog="showWarnDialog"
      :dialog-title="dialogTitle"
      :dialog-type="dialogType"
      :user-id="userId"
      :org-id="orgId"
      @close="showWarnDialog = false"
    ></warnDialog>
  </el-container>
</template>

<script>
import BaseTitleTable from '@/components/common/form/base-title-table/index.vue';
import pieChart from '../order/components/pieChart.vue';
import lineChart from './components/lineChart.vue';
import smallTable from './components/smallTable.vue';
import bigTable from './components/bigTable.vue';
import warnDialog from './components/warnDialog.vue';
import API from '@/api/hierarchicalControl/warningStatistics.js';

export default {
  name: 'WarningStatistics',
  components: {
    BaseTitleTable,
    pieChart,
    lineChart,
    smallTable,
    bigTable,
    warnDialog,
  },
  data() {
    return {
      orgId: '', // 首页带进来的单位ID
      timeList: [{ name: '今日' }, { name: '本月' }, { name: '本年' }],
      checkIndex_1: 0,
      dateRange: '01',
      warnNum: 0, // 预警总数
      resources: {
        // 资源预警数据
        deviceNum: 0,
        carNum: 0,
        suppliesNum: 0,
      },
      // 环状图颜色合集
      colors: [
        '#83E4A6',
        '#3AE1C3',
        '#6FB9FF',
        '#869AFF',
        '#36D4ED',
        '#FA6114',
        '#FE9D24',
        '#FFCF24',
        '#ADE45C',
      ],
      pieConfig: {
        // 环状配置及数据
        data: [],
      },
      lineConfig: {
        // 折线图配置及数据
        grid: {
          left: 50,
          right: 50,
          bottom: 30,
          top: 45,
        },
        lineData1: [],
        lineData2: [],
        lineData3: [],
        lineData4: [],
        lineX: [],
      },
      table1: {
        // 物资表格数据
        tableData: [],
        tableList: [
          {
            prop: 'deviceName',
            label: '工器具名称',
            width: '150px',
          },
          {
            prop: 'receivedNum',
            label: '领用数量',
            width: '100px',
          },
          {
            prop: 'currentUseNum',
            label: '在用数量',
            width: '100px',
          },
          {
            prop: 'useRate',
            label: '使用率',
            width: '90px',
          },
          {
            prop: 'needFinishTime',
            label: '预警状态',
            width: '100px',
          },
        ],
      },
      table2: {
        // 车辆表格数据
        tableData: [],
        tableList: [
          {
            prop: 'formNum',
            label: '总数',
            width: '120px',
          },
          {
            prop: 'formTitle',
            label: '空闲数量',
            width: '100px',
          },
          {
            prop: 'content',
            label: '申请数量',
            width: '100px',
          },
          {
            prop: 'createTime',
            label: '预警时段',
            width: '100px',
          },
          {
            prop: 'needFinishTime',
            label: '预警状态',
            width: '100px',
          },
        ],
      },
      table3: {
        // 工器具表格数据
        tableData: [],
        tableList: [
          {
            prop: 'typeName',
            label: '物资名称',
            width: '120px',
          },
          {
            prop: 'quantity',
            label: '库存量',
            width: '90px',
          },
          {
            prop: 'dayNeedNum',
            label: '日需求量',
            width: '100px',
          },
          {
            prop: 'keepDay',
            label: '预警天数',
            width: '100px',
          },
          {
            prop: 'maintainDay',
            label: '可维持天数',
            width: '120px',
          },
          {
            prop: 'needFinishTime',
            label: '预警状态',
            width: '100px',
          },
        ],
      },
      dialogTitle: '', // 弹窗标题
      dialogType: '', // 弹窗来源 (表格/标题)
      showWarnDialog: false,
      userId: '', // 大表格选中人员id
    };
  },
  created() {
    let data = this.$route.query || {};
    this.orgId = data.orgId ? data.orgId : this.$store.state.UserData.orgId; // 保留一开始进来的单位id
    this.dateRange = data.dateRange || '01';
    this.checkIndex_1 = data.dateRange === '01' ? 0 : data.dateRange === '02' ? 1 : 2;
  },
  mounted() {
    this.getWarningDistribution();
    this.getOrderMetricTrend();
    this.getIndexDeviceWaringList();
    this.getIndexSuppliesWarning();
  },
  methods: {
    handleTime_1(index) {
      this.checkIndex_1 = index;
      this.dateRange = index === 0 ? '01' : index === 1 ? '02' : '04';
      this.getOrderMetricTrend();
    },
    // 获取资源预警数据 / 环状图数据
    getWarningDistribution() {
      let params = {
        orgNo: this.orgId,
      };
      API.warningDistribution(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.resources.deviceNum = DTS?.deviceNum;
          this.resources.carNum = DTS?.carNum;
          this.resources.suppliesNum = DTS?.suppliesNum;
          this.warnNum = DTS?.total;
          this.pieConfig.data = DTS?.data?.map((item, index) => ({
            name: item.warningName,
            value: item.warningNum,
            color: this.colors[index],
            percent: item.rate,
          }));
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取折线图数据
    getOrderMetricTrend() {
      let params = {
        orgNo: this.orgId, // 需要首页传参
        dateRange: this.dateRange,
      };
      API.orderMetricTrend(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.lineConfig.lineData1 = DTS?.finishRate;
          this.lineConfig.lineData2 = DTS?.standardRate;
          this.lineConfig.lineData3 = DTS?.overdueRate;
          this.lineConfig.lineData4 = DTS?.relapseRate;
          this.lineConfig.lineX = DTS?.dateStrArray;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取物资表格数据
    getIndexDeviceWaringList() {
      let params = {
        orgNo: this.orgId,
        current: 1,
        pageSize: 999,
      };
      API.indexDeviceWaringList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.table1.tableData = DTS;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取工器具表格数据
    getIndexSuppliesWarning() {
      let params = {
        orgNo: this.orgId,
        current: 1,
        pageSize: 999,
      };
      API.indexSuppliesWarning(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.table3.tableData = DTS?.data;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 表格打开弹窗 需要看下要不要直接使用下面这个方法
    openOrder(prop, type, userId) {
      this.userId = userId;
      this.openDialog(prop, type);
    },
    // 打开弹窗
    openDialog(title, type) {
      this.dialogTitle = title;
      this.dialogType = type;
      this.showWarnDialog = true;
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
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  background-color: rgba(0, 0, 0, 0);
  overflow: visible !important;
  .main-left {
    width: 630px;
    margin-right: 16px;
    display: flex;
    flex-direction: column;
    height: 99%;
    .main-left-box1 {
      background-color: #fff;
      display: flex;
      padding: 20px;
      & > .box1 {
        width: 100%;
        margin-right: 8px;
        .content {
          height: 200px;
          display: flex;
          background: rgba(2, 155, 130, 0.03);
          position: relative;
          .content-left {
            width: 200px;
          }
          .content-right {
            padding: 20px 40px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            & > div {
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: space-around;
              font-size: 16px;
              font-weight: bold;
              color: #666;
              border-bottom: 1px solid #e7ecee;
              & > div:nth-child(2) {
                font-weight: normal;
                margin-left: 12px;
              }
            }
            .icon {
              width: 12px;
              height: 12px;
              border-radius: 3px;
            }
          }
          .count {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            top: 70px;
            left: 63px;
            span:nth-child(1) {
              font-size: 24px;
              font-weight: bold;
              color: #3d3d3d;
              margin-bottom: 6px;
            }
            span:nth-child(2) {
              font-size: 18px;
              font-weight: 500;
              color: #666;
            }
          }
        }
      }
      & > .box2 {
        width: 100%;
        .content {
          height: 200px;
          background: rgba(2, 155, 130, 0.03);
        }
      }
    }
    .main-left-box2 {
      background-color: #fff;
      margin-top: 12px;
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      .table {
        flex: 1;
      }
    }
  }
  .main-right {
    background-color: #fff;
    flex: 1;
    height: 94%;
    overflow-y: auto;
    padding: 20px;
    .base-title {
      font-size: 16px;
      font-weight: bold;
      color: #426170;
      display: flex;
      justify-content: space-between;
      span {
        color: #009b83;
        font-weight: normal;
        cursor: pointer;
      }
    }
    & > div {
      margin-bottom: 24px;
    }
    .box1 {
      height: 115px;
      display: flex;
      justify-content: space-between;
      & > div {
        width: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        .img {
          width: 66px;
          height: 66px;
          margin-right: 12px;
        }
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 16px;
          color: #333;
          & > span:nth-child(1) {
            font-size: 28px;
            font-weight: bold;
            color: #3d3d3d;
            margin-bottom: 6px;
          }
        }
      }
      .box1-green {
        background:
          radial-gradient(
            37% 53% at 83% 100%,
            rgba(255, 255, 255, 0.66) 0%,
            rgba(255, 255, 255, 0) 100%
          ),
          linear-gradient(180deg, #dcfcf6 0%, #e8fcf4 100%);
      }
      .box1-red {
        background:
          radial-gradient(
            37% 53% at 83% 100%,
            rgba(255, 255, 255, 0.66) 0%,
            rgba(255, 255, 255, 0) 100%
          ),
          linear-gradient(180deg, #fcebdc 0%, #fcf7e8 100%);
      }
      .box1-blue {
        background:
          radial-gradient(
            37% 53% at 83% 100%,
            rgba(255, 255, 255, 0.66) 0%,
            rgba(255, 255, 255, 0) 100%
          ),
          linear-gradient(180deg, #dcf1fc 0%, #e8f6fc 100%);
      }
    }
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
    width: 100px;
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
</style>
