<template>
  <div class="pagesContent">
    <div v-if="backPageUrl" class="topback">
      <div style="cursor: pointer; color: #666666; position: absolute; right: 33px" @click="goBack">
        <i class="iconfont icon-fanhui"></i>
        返回
      </div>
    </div>
    <!-- tab -->
    <!-- <div class="Digitalsearch">
      <div class="Digitalcontent">
        <div class="tab">
          <div
            class="item"
            @click="tabClick(item)"
            v-for="item in tablist"
            :class="{ isActive: tabindex == item.id }"
            :key="item.id"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div> -->
    <!-- 头 -->
    <!-- con -->
    <div class="content">
      <keep-alive>
        <component
          :is="tabRouter"
          ref="selectTab"
          class="flex-bottom"
          :active-name="tabRouter"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import workOrderHangUpConfig from '@/pages/workOrderHangUp/components/workOrderHangUpConfig.vue'

export default {
  name: 'WorkOrderHangUp', //工单挂起
  components: {
    workOrderHangUpConfig,
  },
  data() {
    return {
      backPageUrl: null,
      tabRouter: 'workOrderHangUpConfig', //初始化tab页面 -工单挂起
      tabindex: '1', //初始化tab页面
      tablist: [
        { label: '首页', id: '0', prop: 'workOrderHangUpConfig' },
        { label: '工单挂起记录', id: '1', prop: 'workOrderHangUpConfig' },
      ],
    }
  },
  computed: {},
  watch: {},

  // 创建
  mounted() {},
  activated() {
    console.log('激活了-----工单挂起')
    // debugger
  },
  deactivated() {
    console.log('销毁了-----工单挂起')
  },
  methods: {
    // 切換tab頁面
    tabClick(item) {
      this.tabindex = item.id
      this.tabRouter = item.prop
    },
  },
}
</script>

<style lang="scss" scoped>
.Digitalsearch {
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  padding-top: 0px;
  width: 100%;
  z-index: 2;
  margin-bottom: 10px;
  .title {
    border-width: 0px;
    position: absolute;
    left: 20px;
    top: 20px;
    width: 196px;
    height: 35px;
    display: flex;
    font-size: 18px;
    font-family:
      Microsoft YaHei-Bold,
      Microsoft YaHei;
    font-weight: bold;
    color: #2ba174;
  }
  .searchinput {
    margin: 0px auto 0px;
    width: 639px;
    padding: 2px 0px 2px 0px;
    font-family: 'Microsoft JhengHei UI', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    letter-spacing: normal;
    color: #000000;
    vertical-align: none;
    text-align: left;
    text-transform: none;
    background-color: transparent;
    border-color: transparent;
    .searchinputList {
      position: absolute;
      z-index: 999;
      width: 560px;
      background-color: #fff;
      border-radius: 16px;
      padding: 10px;
      opacity: 1;
      border: 1px solid #e9e9e9;
      ::v-deep .el-divider--horizontal {
        margin: 10px 0;
      }
      .unitNumber {
        margin: 10px;
        justify-content: flex-start;
        flex-wrap: wrap;
        div {
          width: 50%;
          margin: 5px 0;
          cursor: pointer;
          span:nth-child(1) {
            color: #2ba174;
            font-size: 16px;
            margin-right: 10px;
          }
          span:nth-child(2) {
            color: #aaa;
            font-size: 14px;
          }
        }
      }
      .history {
        cursor: pointer;
        padding: 5px 10px;
        font-size: 14px;
        color: rgb(85, 85, 85);
      }
      .history:hover {
        background-color: #ccc;
      }
      .clear {
        float: right;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    ::v-deep .el-input-group--append .el-input__inner {
      border-radius: 60px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      height: 48px !important;
    }
    ::v-deep .el-input-group__append {
      border: none;
      background-color: #fff !important;
    }
    ::v-deep .el-input-group__append button.el-button {
      background: linear-gradient(90deg, #2ba174 0%, #51b377 100%);
      border-radius: 37px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding: 9px;
      width: 100px;
      color: #fff;
      height: 48px;
    }
  }
  ::v-deep .el-tabs__nav-scroll {
    margin: 0 20px;
  }
  ::v-deep .el-tabs__item {
    font-size: 18px;
    padding: 0 20px;
  }
  ::v-deep .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 0 1px;
  }

  ::v-deep .el-tabs__active-bar {
    display: none;
    border-radius: 6px;
    position: absolute;
    bottom: 0px;
    left: 0;
    height: 6px;
    background-color: #2ba174;
    background: linear-gradient(90deg, #2ba174 0%, #51b377 100%);
  }
  ::v-deep .el-tabs__nav-scroll {
    // margin: 0 20px;
    .el-tabs__item {
      padding: 0 20px;
    }
    .is-active {
      font-size: 18px;
      margin: 10px 0px 16px;
      font-weight: bold;
      color: #333333;
      &:after {
        display: block;
        content: '';
        background: linear-gradient(90deg, #2ba174 0%, #51b377 100%);
        height: 6px;
        border-radius: 3px;
        width: 20px;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: -15px;
      }
    }
  }
  .Digitalcontent {
    height: 38px;
    .tab {
      display: flex;
      align-items: center;
      height: 100%;
      margin-left: 10px;
      .item {
        cursor: pointer;

        font-size: 12px;
        background: #f5f7f7;
        color: #838383;
        margin-right: 5px;
        padding: 6px;
        border-radius: 4px;
      }
      .isActive {
        background: #e5f5f2;
        color: #31969a;
      }
    }
    .searchDom {
      padding-top: 20px;
    }
  }
}
.pagesContent {
  display: flex;
  flex-direction: column;
  height: 100%;
  .content {
    flex: 1;
  }
}
</style>
