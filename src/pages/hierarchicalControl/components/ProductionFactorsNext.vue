<template>
  <el-container class="new-safeweb-web">
    <!-- 下级单位生产要素 -->
    <div v-show="isCollapsed1" class="work-order-card" shadow="never">
      <div class="card-header">
        <span class="card-title"
          >生产要素
          <div :class="'arrow-down'" class="card-arrow" @click="toggleCollapse"></div
        ></span>

        <div class="header-right">
          <div class="tabclass">
            <div
              v-for="(item, index) in divList"
              :key="index"
              :class="{ active: activeIndex === index }"
              class="tabname"
              @click="handleTab(index, item)"
            >
              {{ item.label }}
            </div>
          </div>
          <span
            style="font-size: 14px; color: gray; cursor: pointer"
            @click="goNewPage('productionFactorsMore')"
            >更多></span
          >
        </div>
      </div>
      <div class="card-body">
        <div style="width: 100%">
          <el-tabs
            v-if="materialshow || metersshow"
            v-model="fourName"
            class="tabsgroup"
            type="card"
            style="width: 300px; overflow: auto; margin: 0 auto"
            @tab-click="handlefour"
          >
            <el-tab-pane
              v-for="(item, index) in getMaterialTypeArray"
              :key="index"
              :label="item.typeName"
              :name="item.typeCode"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <!-- 物资 -->
        <div v-if="materialshow" class="section2">
          <div class="tabTitle">
            <div>单位名称</div>
            <div>库存</div>
            <div>预警天数</div>
            <div style="width: 30%">理论可持续天数</div>
          </div>
          <div style="overflow-y: scroll; height: 180px">
            <div v-for="(item, index) in materialArray" :key="index" class="tabContent">
              <div>{{ item.orgName }}</div>
              <div>{{ item.stockQuantity }}</div>
              <div>{{ item.warningDays }}</div>
              <div :class="item.sustainableDays < 30 ? 'redback' : ''">
                {{ item.sustainableDays }}
              </div>
            </div>
          </div>
        </div>
        <!-- 工器具 -->
        <div v-if="metersshow" class="section2">
          <div class="tabTitle">
            <div>单位名称</div>
            <div>领用数量</div>
            <div>在用数量</div>
            <div>使用率</div>
          </div>
          <div style="overflow-y: scroll; height: 180px">
            <div v-for="(item, index) in metersArray" :key="index" class="tabContent">
              <div>{{ item.orgName }}</div>
              <div>{{ item.receivedCount }}</div>
              <div>{{ item.inUseCount }}</div>
              <div>{{ item.usageRate }}%</div>
            </div>
          </div>
        </div>
        <!-- 票卡单 -->
        <div v-if="workTicketStatsshow" class="section2">
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
          <div class="tabTitle">
            <div>票卡单类型</div>
            <div>开票数</div>
            <div>不合格数</div>
            <div>不合格率</div>
          </div>
          <div v-for="(item, index) in workTicketStatsArray" :key="index" class="tabContent">
            <div>{{ item.wtTypeName }}</div>
            <div>{{ item.totalQuantity }}</div>
            <div>{{ item.unqualifiedQuantity }}</div>
            <div>{{ item.unqualifiedRate }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isCollapsed2" class="mincard">
      <div>预</div>
      <div>警</div>
      <div>情</div>
      <div>况</div>
      <div class="card-arrow" @click="toggleCollapse"></div>
    </div>
  </el-container>
</template>

<script>
import API from '@/api/hierarchicalControl/secondlevel.js';
import { getUserOrgInfo } from '@/api/common/index.js';
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
  },
  data() {
    return {
      dateOptions: [
        { label: '本周', value: '05' },
        { label: '本月', value: '02' },
        { label: '本年', value: '04' },
      ], //日期选择
      fourName: '',
      activeIndex: 0, // 默认第一个绿色
      materialshow: true, //物资展示
      metersshow: false, //工器具展示
      workTicketStatsshow: false, //票展示
      // 生产要素
      divList: [
        { label: '物资', value: 'A' },
        // { label: "车辆", value: "B" },
        { label: '工器具', value: 'C' },
        { label: '设备', value: 'D' },
        { label: '票卡单', value: 'E' },
      ],
      materialArray: [], //物资数组
      metersArray: [], //工器具数组
      workTicketStatsArray: [], //票数组
      getMaterialTypeArray: [], //物资类型数组
      activeName: 'first',
      isCollapsed1: true,
      isCollapsed2: false,
      selectedDate: '05',
    };
  },
  watch: {
    selectedDate(newVal) {
      this.getWorkTicketStats();
    },
    orgNo(newVal) {
      this.goGetMaterialType();
      // this.getMaterial();
      this.handlefour();
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
    this.goGetMaterialType();
    this.getMaterial();
  },
  methods: {
    // 管辖单位指标情况切换
    handlefour(tab, event) {
      this.getMaterial();
      this.getMeters();
    },
    // 下级：物资查询
    async getMaterial() {
      let params = {
        orgNo: this.orgNo,
        typeCode: this.fourName,
      };
      let res = await API.material(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.materialArray = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 下级：工器具查询
    async getMeters() {
      let params = {
        orgNo: this.orgNo,
        instrumentType: this.fourName,
      };
      let res = await API.meters(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.metersArray = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 票查询
    async getWorkTicketStats() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      let res = await API.workTicketStats(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.workTicketStatsArray = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 查询物资类型信息
    async goGetMaterialType() {
      let res = await API.getMaterialType();
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.getMaterialTypeArray = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 要素切换
    handleTab(index, item) {
      // 切换颜色
      this.activeIndex = index;
      if (item.label === '物资') {
        this.materialshow = true;
        this.metersshow = false;
        this.workTicketStatsshow = false;
        // this.getMaterial();
        this.handlefour();
      } else if (item.label === '工器具') {
        this.materialshow = false;
        this.metersshow = true;
        this.workTicketStatsshow = false;
        this.getMaterialTypeArray = [
          { typeName: '背夹', typeCode: '01' },
          { typeName: '掌机', typeCode: '02' },
          { typeName: '现场校验仪', typeCode: '03' },
          { typeName: '供电服务记录仪', typeCode: '04' },
        ];
        this.fourName = '01';
        this.getMeters();
      } else if (item.label === '票卡单') {
        this.materialshow = false;
        this.metersshow = false;
        this.workTicketStatsshow = true;
        this.getWorkTicketStats();
      }
    },
    // 卡片折叠
    toggleCollapse() {
      this.isCollapsed1 = !this.isCollapsed1;
      this.isCollapsed2 = !this.isCollapsed2;
    },
    // 点击更多跳转
    goNewPage(pageIndex) {
      this.$emit('goNewPage', pageIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
.new-safeweb-web {
  display: flex;
  align-items: center;
  justify-content: right;
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
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  .redback {
    color: red;
  }
  .tabsgroup {
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
  .tabContent {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-around;
    font-size: 14px;
    padding: 8px 0;
    div {
      width: 24%;
    }
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

      &:first-child {
        margin-left: 0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }

      &:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }

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
      font-size: 16px;
      font-weight: 500;
      color: $color-primary;
    }

    .header-right {
      display: flex;
      align-items: center;
      .tabclass {
        display: flex;
        align-items: center;
        margin-right: 15px;
        color: gray;
        .tabname {
          cursor: pointer;
          padding: 5px;
          transition: 0.3s;
          border-right: 1px solid $color-gray2;
        }
        .tabname.active {
          color: $color-primary;
          // background-color: $color-primary;
        }
        .tabname:hover {
          opacity: 0.8;
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
      padding-bottom: 5px;
      width: 100%;
      .tabTitle {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-around;
        background-color: $color-gray2;
        font-size: 14px;
        border-radius: 5px;
        padding: 8px 0;
        div {
          width: 24%;
        }
      }
    }
  }
}
</style>
