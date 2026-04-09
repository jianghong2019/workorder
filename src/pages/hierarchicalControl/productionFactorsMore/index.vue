<template>
  <el-container class="new-safeweb-web">
    <div class="new-safeweb-web-box">
      <div class="title box-linear-gradient">
        <el-tabs v-model="activeIndex" class="tabs" @tab-click="tabClick">
          <el-tab-pane
            v-for="item in tabs"
            :key="item.value"
            class="tab"
            :label="item.label"
            :name="item.value"
          >
            <span slot="label">
              <span>{{ item.label }}</span>
            </span>
          </el-tab-pane>
        </el-tabs>
        <div class="flex-row-end">
          <el-button class="el-btn-new reset-btn" size="small" @click="goBack">
            <img src="@/assets/images/icon-img/icon-fanhui.png" alt="" />
            返回
          </el-button>
        </div>
      </div>

      <el-main class="work-reminders">
        <!-- 内容区域 -->
        <div class="tab-content">
          <keep-alive>
            <components
              :is="activeIndex"
              :org-no="orgNo"
              :page-flag="pageFlag"
              :date-time="dateTime"
              :date-range="dateRange"
            ></components>
          </keep-alive>
        </div>
      </el-main>
    </div>
  </el-container>
</template>

<script>
import MaterialView from './components/MaterialView.vue';
import VehicleView from './components/VehicleView.vue';
import ToolView from './components/ToolView.vue';
import DeviceView from './components/DeviceView.vue';
import TicketView from './components/TicketView.vue';
export default {
  name: 'WorkReminder',
  components: {
    MaterialView,
    VehicleView,
    ToolView,
    DeviceView,
    TicketView,
  },
  data() {
    return {
      dateRange: '',
      dateTime: [],
      pageFlag: false,
      orgNo: '32101',
      activeIndex: 'MaterialView',
      tabsObj: {
        '01': 'MaterialView',
        // "02": "VehicleView",
        '03': 'ToolView',
        '04': 'DeviceView',
        '05': 'TicketView',
      },
      tabs: [
        {
          label: '物资',
          value: 'MaterialView',
        },
        // {
        //   label: "车辆",
        //   value: "VehicleView",
        // },
        {
          label: '工器具',
          value: 'ToolView',
        },
        {
          label: '设备',
          value: 'DeviceView',
        },
        {
          label: '票卡单',
          value: 'TicketView',
        },
      ],
      types: [],
      searchData: {
        surpervisionTitle: '',
        type: '',
        dateTime: [],
      },
      boxClickIndex: '01',
      checkingNum: '11',
      checkedNum: '11',
      reminders: [
        {
          title: '消息提醒',
          text: '当前夏季用电高峰临近，局部区域可能出现时段性电力缺口。为保障电网安全稳定运行，请做好供电服务巡视工作，优先满足民生与重点领域用电需求',
          orderType: '2025091500000001',
          text1: '根据现场反馈情况，需要额外申请，防止物资不足',
          name: '刘吉吉',
          time: '2025-10-15 10:00',
          num: -11,
        },
      ],
    };
  },
  computed: {
    handleTabClick(tab) {
      console.log('切换到:', tab.name);
    },
  },
  watch: {
    //监听路由，判断是本级还是下级
    '$route.query': {
      handler(val) {
        if (val.orgType) {
          //true是本级，false是下级
          this.pageFlag = val.orgType === '02' ? true : false;
          this.orgNo = val.orgId;
          this.activeIndex = this.tabsObj[val.tabsIndex] || 'MaterialView';
          if (val.timeData) {
            this.dateTime = val.timeData;
            this.dateRange = val.dateRange || '';
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    tabClick() {},
    refresh() {},
    searchSubmit() {},
    boxClick(index) {
      this.boxClickIndex = index;
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.new-safeweb-web {
  height: 100%;
  width: 100%;
  .new-safeweb-web-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    .work-reminders {
      .tab-content {
        height: 100%;
        overflow: auto;
      }
    }
  }
}

// ::v-deep .el-main .el-main-wrap{
//   background-color: white !important;
// }
.box-linear-gradient {
  border-radius: 12px 12px 0 0;
}
.title {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
  padding-left: 20px;
  border-bottom: 1px solid;
  box-sizing: border-box;

  border-image: linear-gradient(90deg, #fff 0%, #e9ebef 44%, #e9ebef 100%);
  :deep(.is-top:nth-child(2)) {
    padding-left: 20px;
  }
  :deep(.is-top:last-child) {
    padding-right: 20px;
  }
}
// :deep(.tabNum) {
//   width: 24px;
//   height: 24px;
//   font-size: 18px;
//   padding: 0 4px;
//   border-radius: 50%;
//   background-color: #f00;
//   color: #fff;
//   position: relative;
//   top: -12px;
//   right: -12px;
// }
.check-box {
  height: 32px;
  display: flex;
  div {
    width: 102px;
    margin-left: 18px;
    background: #f5f7f7;
    color: #666666;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
  }
  div.check-box-click {
    background: rgba(0, 155, 131, 0.1);
    color: #009b83;
  }
}
.work-reminder {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #e9ebef;
  padding: 24px 24px 12px 24px;
  .work-reminder-left {
    width: 60%;
    .work-reminder-left1 {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      line-height: 18px;
      color: #426170;
      .img {
        width: 18px;
        height: 18px;
        margin-right: 12px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .card {
        background: #fae9e9;
        width: 72px;
        height: 20px;
        border-radius: 4px;
        color: #e73434;
        font-size: 12px;
        font-weight: normal;
        line-height: 20px;
        text-align: center;
        margin-left: 12px;
      }
    }
    .work-reminder-left2 {
      font-size: 14px;
      font-weight: normal;
      line-height: 18px;
      color: #426170;
      margin: 12px;
      span {
        margin-right: 48px;
      }
      .green {
        color: #009b83;
      }
      .red {
        color: #f03123;
      }
    }
    .work-reminder-left3 {
      font-size: 12px;
      font-weight: normal;
      color: #99a09e;
      display: flex;
      align-items: center;
      & > div {
        margin-right: 24px;
        display: flex;
        align-items: center;
      }
      .img {
        width: 14px;
        height: 14px;
        margin-right: 12px;
      }
    }
  }
}
// ::v-deep body ,::v-deep html,::v-deep.el-main,::v-deep.el-main .el-main-wrap {background-color: white !important;}
// ::v-deep .el-tabs,::v-deep.el-tabs_hrader {background-color: white !important;}
:deep(.el-tabs) {
  height: 60px;
}
:deep(.el-tabs__header) {
  margin: 0;
  height: 60px;
  div {
    height: 100%;
  }
  .el-tabs__active-bar {
    height: 2px;
  }
}
:deep(.el-tabs__nav-wrap::after) {
  opacity: 0;
}
:deep(.el-tabs__item) {
  width: 120px;
  text-align: center;
  line-height: 60px;
  font-size: 18px;
}
:deep(.el-tabs__item.is-active) {
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  font-weight: 700;
}
</style>
