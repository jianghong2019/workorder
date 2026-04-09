<template>
  <el-container class="new-safeweb-web">
    <div class="main">
      <div class="main-left">
        <div
          v-for="item in tabs"
          :key="item.value"
          :class="item.value === activeTab ? 'active' : ''"
          @click="tabsClick(item.value)"
        >
          {{ item.name }}
        </div>
      </div>
      <el-main class="manage-main main-right">
        <qulityPerformanceConfig v-if="activeTab === 'tab1'" />
        <workloadCapacityConfig v-if="activeTab === 'tab2'" />
        <keep-alive><riskConfig v-if="activeTab === 'tab3'" /></keep-alive>
        <toolsEquipmentConfig v-if="activeTab === 'tab4'" />
        <vehicleConfig v-if="activeTab === 'tab5'" />
        <materialsSuppliesConfig v-if="activeTab === 'tab6'" />
        <workOvertimeConfig v-if="activeTab === 'tab7'" />
        <workOrderOvertimeConfig v-if="activeTab === 'tab8'" />
        <qualityDeviationConfig v-if="activeTab === 'tab9'" />
      </el-main>
    </div>
  </el-container>
</template>
<script>
import qulityPerformanceConfig from './qulityPerformanceConfig.vue';
import workloadCapacityConfig from './workloadCapacityConfig.vue';
import riskConfig from './riskConfig.vue';
import toolsEquipmentConfig from './toolsEquipmentConfig.vue';
import vehicleConfig from './vehicleConfig.vue';
import materialsSuppliesConfig from './materialsSuppliesConfig.vue';
import workOvertimeConfig from './workOvertimeConfig.vue';
import workOrderOvertimeConfig from './workOrderOvertimeConfig.vue';
import qualityDeviationConfig from './qualityDeviationConfig.vue';
export default {
  components: {
    qulityPerformanceConfig,
    workloadCapacityConfig,
    riskConfig,
    toolsEquipmentConfig,
    vehicleConfig,
    materialsSuppliesConfig,
    workOvertimeConfig,
    workOrderOvertimeConfig,
    qualityDeviationConfig,
  },
  data() {
    return {
      activeTab: 'tab1',
      tabs: [
        {
          name: '质效预警配置',
          value: 'tab1',
        },
        {
          name: '承载力预警配置',
          value: 'tab2',
        },
        {
          name: '风险预警配置',
          value: 'tab3',
        },
        {
          name: '工器具配置',
          value: 'tab4',
        },
        {
          name: '车辆预警配置',
          value: 'tab5',
        },
        {
          name: '物资预警配置',
          value: 'tab6',
        },
        {
          name: '作业超时预警配置',
          value: 'tab7',
        },
        {
          name: '工单超期预警配置',
          value: 'tab8',
        },
        {
          name: '质量偏差预警配置',
          value: 'tab9',
        },
      ],
    };
  },
  methods: {
    tabsClick(val) {
      this.activeTab = val;
    },
  },
};
</script>

<style scoped lang="scss">
div {
  box-sizing: border-box;
}
.new-safeweb-web {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .main {
    height: 100%;
    width: 100%;
    display: flex;
    .main-left {
      width: 228px;
      height: 100%;
      padding: 24px 6px;
      background-color: #fff;
      border-radius: 4px;
      margin-right: 16px;
      div {
        font-size: 16px;
        height: 39px;
        line-height: 39px;
        cursor: pointer;
        color: #426170;
        text-align: left;
        padding-left: 22px;
      }
      .active {
        background: rgba(4, 209, 104, 0.102);
        color: #009b83;
        font-weight: bold;
      }
    }
    .main-right {
      flex: 1;
      height: 100%;
      overflow-y: hidden;
      margin-top: 0px;
    }
  }
}
</style>
