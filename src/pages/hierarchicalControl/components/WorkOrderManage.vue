<template>
  <!-- 本级单位工单管理 -->
  <el-container class="new-safeweb-web">
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
        <!-- 待办工单 -->
        <div class="section2">
          <div class="titleContainer">
            <img src="@/assets/iconfont/icon/二级标题右.svg" alt="baobiao" width="20" height="20" />
            <div class="title-box">
              <span class="title-text">待办工单</span>
            </div>
          </div>
          <div class="sectioncontainer">
            <div class="ordertotal">
              <!-- <img
                src="@/assets/iconfont/icon/工单总数.svg"
                alt="baobiao"
                width="50"
                height="50"
              /> -->
              <div class="totalnum">{{ daibantotal }}<span class="totaldanwei">条</span></div>
              <div>待办总数</div>
            </div>
            <div class="detilflext">
              <div class="detilflex">
                <div class="daycontainer daycon">
                  <!-- <img class="icon" src="@/assets/images/icon-36381.png" alt=""> -->
                  <div class="daytext">
                    <div class="toptext">
                      计量 <span class="firstnum">{{ jiliangnum }}</span
                      ><span class="onetiao">条</span>
                    </div>
                    <div class="generate">
                      生成数&nbsp;&nbsp;<span class="gnum">{{ jiliangday }}</span>
                    </div>
                  </div>
                  <div class="daytext">
                    <div class="toptext">
                      反窃查违 <span class="firstnum">{{ fanqienum }}</span
                      ><span class="onetiao">条</span>
                    </div>
                    <div class="generate">
                      生成数&nbsp;&nbsp;<span class="gnum">{{ fanqieday }}</span>
                    </div>
                  </div>
                </div>
                <div class="daycontainer">
                  <div class="daytext">
                    <div class="toptext">
                      采集 <span class="firstnum">{{ caijinum }}</span
                      ><span class="onetiao">条</span>
                    </div>
                    <div class="generate">
                      生成数&nbsp;&nbsp;<span class="gnum">{{ caijiday }}</span>
                    </div>
                  </div>
                  <div class="daytext">
                    <div class="toptext">
                      线损 <span class="firstnum">{{ xiansunnum }}</span
                      ><span class="onetiao">条</span>
                    </div>
                    <div class="generate">
                      生成数&nbsp;&nbsp;<span class="gnum">{{ xiansunday }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="qitacls">
                <div class="daytext">
                  其他类型 <span class="firstnum">{{ qitanum }}</span
                  ><span class="onetiao">条</span>
                </div>
                <div class="generate">
                  生成数&nbsp;&nbsp;<span class="gnum">{{ qitaday }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 工单派发 -->
        <div class="section3">
          <div class="titleContainer">
            <img src="@/assets/iconfont/icon/二级标题右.svg" alt="baobiao" width="20" height="20" />
            <div class="title-box">
              <span class="title-text">工单派发</span>
            </div>
          </div>
          <div class="sectioncontainer">
            <div class="ordertotal">
              <img src="@/assets/iconfont/icon/已派发.svg" alt="baobiao" width="50" height="50" />
              <div class="textdiv">
                <span class="num1">{{ dispatchedCount }}</span
                >&nbsp;&nbsp;<span class="danwei1">条</span>
                <div class="name">已派发</div>
              </div>
              <div class="hengshu"></div>
              <div class="textdiv">
                <span class="num2">{{ dispatchedFieldCount }}</span
                >&nbsp;&nbsp;<span class="danwei2">条</span>
                <div class="name">派发现场</div>
              </div>
              <div class="textdiv textser" @click="goColloctDialog">
                <span class="num3">{{ dispatchedAdminCount }}</span
                >&nbsp;&nbsp;<span class="danwei3">条</span>
                <div class="name">派发管理员</div>
              </div>
            </div>

            <div class="daycontainer">
              <el-dialog
                append-to-body
                title="提示"
                :visible.sync="centerDialogVisible"
                width="20%"
                center="ture"
                class="dialogclass"
              >
                <div class="dlialog">
                  <i class="el-icon-warning-outline"></i>
                  <div class="dialogtext">
                    <div class="dialtop">
                      存在<span class="collred">{{ undispatchedCount }}</span
                      >条工单未派发,
                    </div>
                    <div class="dialtop">
                      涉及<span class="collred">{{ unmaintainedTransformerAreaCount }}</span
                      >个台区及<span class="collred">{{ unmaintainedHighVoltageUserCount }}</span
                      >个高压用户未维护责任人!
                    </div>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button style="width: 95px" size="mini" type="primary" @click="gopaigong()"
                    >去派工</el-button
                  >
                  <el-button style="width: 95px" size="mini" type="primary" @click="gorouter()"
                    >维护责任田</el-button
                  >
                </div>
              </el-dialog>
              <img
                src="@/assets/images/icon-img/icon-weipaifa.png"
                alt="baobiao"
                width="50"
                height="50"
              />
              <div class="undispatchedCount>0 ?'xiaos':''" @click="lookUndispatch">
                <div v-if="specificUnDispatchedCount > 0" class="text">责任田未维护</div>
                <span class="num0">{{ undispatchedCount }}</span
                >&nbsp;&nbsp;<span class="danwei0">条</span>
                <div class="name0">未派发</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 工单处理 -->
        <div class="section4">
          <div class="titleContainer">
            <img src="@/assets/iconfont/icon/二级标题右.svg" alt="baobiao" width="20" height="20" />
            <div class="title-box">
              <span class="title-text">工单处理</span>
            </div>
          </div>
          <div class="sectioncontainer">
            <div class="ordertotal">
              <img src="@/assets/iconfont/icon/已处理.svg" alt="baobiao" width="50" height="50" />
              <div>
                <span class="num1">{{ processedCount }}</span
                >&nbsp;&nbsp;<span class="danwei1">条</span>
                <div class="mintext">已处理</div>
              </div>
            </div>
            <div class="hengshu"></div>
            <div class="ordertotal">
              <img src="@/assets/iconfont/icon/未处理.svg" alt="baobiao" width="50" height="50" />
              <div>
                <span class="num2">{{ unprocessedCount }}</span
                >&nbsp;&nbsp;<span class="danwei2">条</span>
                <div class="mintext">未处理</div>
              </div>
            </div>
            <div class="hengshu"></div>
            <div class="ordertotal">
              <img src="@/assets/iconfont/icon/自愈合.svg" alt="baobiao" width="50" height="50" />
              <div>
                <span class="num3">{{ selfHealingCount }}</span
                >&nbsp;&nbsp;<span class="danwei3">条</span>
                <div class="mintext">自愈合</div>
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
    <ColloctDialog ref="ColloctDialog"></ColloctDialog>
    <!-- 单独派工弹框 -->
    <el-dialog
      append-to-body
      title="提示"
      :visible.sync="centerDialogVisibles"
      width="20%"
      center="ture"
      class="dialogclass"
    >
      <div class="dlialog">
        <i class="el-icon-warning-outline"></i>
        <div class="dialogtext">
          <div class="dialtop">
            存在<span class="collred">{{ undispatchedCount }}</span
            >条工单未派发!
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 95px" size="mini" type="primary" @click="gopaigong()"
          >去派工</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import API from '@/api/hierarchicalControl/firstlevel.js';
import { getUserOrgInfo } from '@/api/common/index.js';
import ColloctDialog from './ColloctDialog.vue';
export default {
  name: 'WorkOrderManage',
  components: { ColloctDialog },
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
      daibantotal: 0, //待办总数
      jiliangday: 0, //计量每日生成
      caijiday: 0, //采集每日生成
      fanqieday: 0, //反窃每日生成
      xiansunday: 0, //线损每日生成
      jiliangnum: 0,
      caijinum: 0,
      fanqienum: 0,
      xiansunnum: 0,
      qitaday: 0, //其他每日生成
      qitanum: 0, //其他总数
      activeName: 'first',
      isCollapsed1: true,
      isCollapsed2: false,
      selectedDate: '01',
      dateOptions: [
        { label: '今日', value: '01' },
        { label: '本月', value: '02' },
        { label: '本年', value: '04' },
      ],
      processedCount: 0, //已处理
      unprocessedCount: 0, //未处理
      selfHealingCount: 0, //自愈合
      dispatchedCount: 0, //已派发
      dispatchedFieldCount: 0, //派发现场
      dispatchedAdminCount: 0, //派发管理员
      undispatchedCount: 0, //未派发
      unmaintainedTransformerAreaCount: 0, //涉及台区
      unmaintainedHighVoltageUserCount: 0, //涉及未维护人
      centerDialogVisible: false, //弹出框
      specificUnDispatchedCount: 0, //弹框判断区别
      centerDialogVisibles: false,
    };
  },
  watch: {
    orgNo(newVal) {
      this.getOrderStats();
      this.getProcessstats();
      this.getDispatchstats();
    },
    selectedDate(newVal) {
      this.getOrderStats();
      this.getProcessstats();
      this.getDispatchstats();
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
  },
  mounted() {
    this.getOrderStats();
    this.getProcessstats();
    this.getDispatchstats();
  },
  // computed(){

  // },
  methods: {
    // 数字超过1万转换
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(2) + '万';
      } else {
        return num;
      }
      return num;
    },

    //  // 时间范围获取函数
    //   getDateRangeByType(dateType) {
    //     if (!dateType) return { beginTime: "", endTime: "" };
    //     const now = this.$moment();
    //     const dateConfig = {
    //       "01": { start: "day", end: "day" }, // 本日
    //       "02": { start: "month", end: "month" }, // 本月
    //       "04": { start: "year", end: "year" }, // 本年
    //     };
    //     const config = dateConfig[dateType] || dateConfig["04"];
    //     return {
    //       beginTime: now.startOf(config.start).format("YYYY-MM-DD"),
    //       endTime: now.endOf(config.end).format("YYYY-MM-DD"),
    //     };
    //   },
    // 时间范围获取函数
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
    // 工单中心
    gopaigong() {
      this.centerDialogVisible = false;
      this.centerDialogVisibles = false;
      let prame = {};
      if (this.$store.state.UserData.function.includes('04')) {
        prame = {
          orgId: this.orgNo,
          isSelf: '2',
          wkstStatus: ['01'],
          insertTimeList: [],
          mastFinishTime: this.getDateRangeByType(this.selectedDate),
        };
      } else {
        prame = {
          wkstStatus: ['01'],
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
    // 责任田
    gorouter() {
      //
      this.centerDialogVisible = false;

      // this.$router.push({ path: '/responsibilityFied'});
      localStorage.setItem(
        'UnifiedAnalysisJump',
        JSON.stringify({
          wkstStatus: '01',
        })
      );
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/#/responsibilityFied`;
      } else {
        window.parent.openNewTab(
          {
            text: '责任田管理',
            name: 'XB_ZRTGL',
          },
          {
            text: '责任田配置管理',
            name: 'XB_ZRTPZ',
            url: '/workorderMapVisual_front/workorderMapVisual_front/index.html#/responsibilityFied',
          }
        );
      }
    },
    // 派发管理员弹框
    goColloctDialog() {
      this.$refs.ColloctDialog.opan(this.orgNo, this.selectedDate);
    },
    // 待办工单
    async getOrderStats() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      let res = await API.getOrderStats(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        // this.daibantotal = DTS.totalCount;
        this.daibantotal = this.formatNumber(DTS.totalCount);
        this.jiliangnum = DTS.profTypeCounts['01'];
        this.caijinum = DTS.profTypeCounts['02'];
        this.fanqienum = DTS.profTypeCounts['04'];
        this.xiansunnum = DTS.profTypeCounts['03'];
        this.jiliangday = DTS.currentGeneCounts['01'];
        this.caijiday = DTS.currentGeneCounts['02'];
        this.fanqieday = DTS.currentGeneCounts['04'];
        this.xiansunday = DTS.currentGeneCounts['03'];
        this.qitanum = DTS.profTypeCounts['99'];
        this.qitaday = DTS.currentGeneCounts['99'];
      } else {
        this.$message.error(RT_D);
      }
    },
    // 工单处理
    async getProcessstats() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      // demo
      let res = await API.processstats(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.processedCount = DTS.processedCount;
        this.unprocessedCount = DTS.unprocessedCount;
        this.selfHealingCount = DTS.selfHealingCount;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 工单派发
    async getDispatchstats() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      // demo
      let res = await API.dispatchstats(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.dispatchedCount = DTS.dispatchedCount;
        this.dispatchedFieldCount = DTS.dispatchedFieldCount;
        this.dispatchedAdminCount = DTS.dispatchedAdminCount;
        this.undispatchedCount = DTS.undispatchedCount;
        this.unmaintainedTransformerAreaCount = DTS.unmaintainedTransformerAreaCount;
        this.unmaintainedHighVoltageUserCount = DTS.unmaintainedHighVoltageUserCount;
        this.specificUnDispatchedCount = DTS.specificUnDispatchedCount;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 未派发查看
    lookUndispatch() {
      // console.log(this.specificUnDispatchedCount);
      if (this.undispatchedCount > 0) {
        if (this.specificUnDispatchedCount > 0) {
          this.centerDialogVisible = true;
        } else {
          this.centerDialogVisibles = true;
        }
      }
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
.new-safeweb-web {
}
.xiaos {
  cursor: pointer;
}
:deep(.el-dialog__footer) {
  justify-content: center;
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
// 未派发弹框
.dlialog {
  display: flex;
  align-items: center;
  justify-content: center;
  .dialogtext {
    text-align: center;
    .dialtop {
      padding: 5px 0px;
      color: black;
      .collred {
        color: red;
      }
    }
  }
  .el-icon-warning-outline {
    color: white;
    background-color: red;
    font-size: 30px;
    border-radius: 50%;
    margin-right: 20px;
  }
}
.work-order-card {
  height: 471px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 446px;
  height: 471px;
  box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
  .dialogclass .el-dialog__title::before {
    display: none;
  }

  .num0 {
    font-size: 16px;
    font-weight: bold;
    color: $gradient-yellow-start;
    cursor: pointer;
  }
  .danwei0 {
    font-size: 12px;
    color: $gradient-yellow-start;
  }
  .name0 {
    font-size: 14px;
    padding-top: 10px;
  }
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
      // padding: 10px;
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
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    padding: 0 10px;
    .section2 {
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
      .sectioncontainer {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        // border:1px solid black;

        .ordertotal {
          width: 32%;
          // height: 100%;
          text-align: center;
          background-image: url('~@/assets/iconfont/icon/工单总数背景.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 0;
          font-size: 14px;
          .totalnum {
            padding: 5px 0;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 25px;
            .totaldanwei {
              font-size: 14px;
              margin-left: 5px;
            }
          }
        }
        .detilflext {
          width: 65%;
          .detilflex {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .qitacls {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: rgba(216, 216, 216, 0.3);
            padding: 3px 5px 3px 0;
            .daytext {
              width: 48%;
              font-size: 14px;
              .firstnum {
                font-size: 20px;
                font-weight: bold;
                color: $color-primary;
              }
              .onetiao {
                color: $color-primary;
                margin-left: 5px;
              }
            }
            .generate {
              width: 48%;
              background-image: url('~@/assets/iconfont/icon/本日生成背景.svg');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              // margin-left: 5px;
              padding: 5px 0;
              font-size: 12px;
              .gnum {
                font-size: 14px;
                color: $color-primary;
              }
            }
          }
        }
        // .daycon {
        //   margin-left: 8%;
        // }
        .daycontainer {
          // margin-left: 5%;
          width: 48%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          font-size: 14px;
          // padding: 7px 0;

          .daytext:first-child {
            margin-bottom: 8px;
          }

          .generate {
            width: 100%;
            background-image: url('~@/assets/iconfont/icon/本日生成背景.svg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            // margin-left: 5px;
            padding: 5px 0;
            font-size: 12px;
            .gnum {
              font-size: 14px;
              color: $color-primary;
            }
          }
          .daytext {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            .toptext {
              width: 100%;
              margin-bottom: 2px;
            }
            .firstnum {
              font-size: 20px;
              font-weight: bold;
              color: $color-primary;
            }
            .onetiao {
              color: $color-primary;
              margin-left: 5px;
            }
          }
        }
      }
      .stat-item {
        width: 30%;
        text-align: center;
        padding: 10px 5px;
        background-color: #f5f7fa;
        border-radius: 4px;

        .stat-number {
          font-size: 20px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 12px;
          color: #909399;
          margin-bottom: 5px;
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
      .sectioncontainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        .ordertotal {
          width: 68%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
          text-align: center;
          background-image: url('~@/assets/iconfont/icon/工单总数背景.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          .hengshu {
            width: 1px;
            height: 40px;
            background-color: #d0deda;
          }
          .textdiv {
            // padding: 10px;
            text-align: left;
            .num1 {
              font-size: 16px;
              font-weight: bold;
              // color: $color-primary;
            }
            .danwei1 {
              font-size: 12px;
              // color: $color-primary;
            }
            .num2 {
              font-size: 16px;
              font-weight: bold;
              color: $color-primary;
            }
            .danwei2 {
              font-size: 12px;
              color: $color-primary;
            }
            .num3 {
              font-size: 16px;
              font-weight: bold;
              color: $gradient-blue-start;
            }
            .danwei3 {
              font-size: 12px;
              color: $gradient-blue-start;
            }
            .name {
              font-size: 14px;
              padding-top: 10px;
              // margin: 5px 0;
            }
          }
          .textser {
            cursor: pointer;
          }
        }
        .daycontainer {
          width: 28%;
          height: 80px;
          text-align: center;
          display: flex;
          // justify-content: space-between;
          align-items: center;
          background-color: rgba(0, 155, 131, 0.06);
          // padding: 0 10px;
          padding-left: 10px;
          .text {
            width: 60px;
            font-size: 10px;
            color: $gradient-yellow-start;
            position: relative;
            top: -15px;
            right: -0px;
          }
        }
      }
    }
    .section4 {
      // margin-bottom: 10px;
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
      .sectioncontainer {
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 10px 10px 10px;
        background-image: url('~@/assets/iconfont/icon/工单总数背景.svg');
        .hengshu {
          width: 1px;
          height: 40px;
          background-color: #d0deda;
        }
        .ordertotal {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 60px;
          text-align: center;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          width: 30%;
          .num1 {
            font-size: 16px;
            font-weight: bold;
            color: $color-primary;
          }
          .danwei1 {
            font-size: 12px;
            // font-weight:bold;
            color: $color-primary;
          }
          .num2 {
            font-size: 16px;
            font-weight: bold;
            color: $gradient-yellow-start;
          }
          .danwei2 {
            font-size: 12px;
            // font-weight:bold;
            color: $gradient-yellow-start;
          }
          .num3 {
            font-size: 16px;
            font-weight: bold;
            color: $gradient-blue-start;
          }
          .danwei3 {
            font-size: 12px;
            // font-weight:bold;
            color: $gradient-blue-start;
          }
          .mintext {
            font-size: 14px;
            padding-top: 5px;
          }
        }
        .daycontainer {
          width: 70px;
          height: 70px;
          text-align: center;
          .daytext {
            height: 48%;
            margin-bottom: 2%;
          }
        }
      }
    }
  }
}
</style>
