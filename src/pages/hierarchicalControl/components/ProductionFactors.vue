<!--
 * @Author: 杨舒文 874021960@qq.com
 * @Date: 2025-11-25 18:16:44
 * @LastEditors: 杨舒文 874021960@qq.com
 * @LastEditTime: 2025-12-06 15:45:59
 * @FilePath: \workordermapvisual_front\src\components\pages\hierarchicalControl\components\ProductionFactorsCopy.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 本级单位生产要素 -->
  <div class="productionFactors">
    <!-- 主体内容 -->
    <div v-if="visible" class="container">
      <div class="container-header">
        <div class="header-label">
          <span>生产要素</span>
          <span class="label-arrow" @click="toggleCollapse"></span>
        </div>
        <!-- 能力按钮区域 -->
        <div class="ability">
          <el-breadcrumb separator="|">
            <el-breadcrumb-item v-for="tab of tabList" :key="tab.value"
              ><span
                class="tab-text"
                :class="{ 'tab-active': tab.value == tabActive }"
                @click="tabClick(tab)"
                >{{ tab.label }}</span
              ></el-breadcrumb-item
            >
          </el-breadcrumb>
          <span class="more" @click="more">更多</span>
        </div>
      </div>
      <div v-if="info" v-loading="loading" class="container-main">
        <el-tabs
          v-if="info.hasTab"
          v-model="info.active"
          type="card"
          :text-end="info.textEnd"
          @tab-click="mainTabClick"
        >
          <el-tab-pane
            v-for="tab of info.tabList"
            :key="tab.typeCode"
            :label="tab.typeName"
            :name="tab.typeCode"
          ></el-tab-pane>
        </el-tabs>
        <div class="table-header">
          <span
            v-for="item of info.tableHeader"
            :key="item.prop"
            class="table-column"
            :style="{ width: item.width }"
            >{{ item.name }}</span
          >
        </div>
        <div class="table-tbody">
          <template v-if="tableData.length">
            <div v-for="(data, index) of tableData" :key="index" class="table-row">
              <span
                v-for="item of info.tableHeader"
                :key="item.prop + index"
                class="table-column"
                :style="{ width: item.width }"
                :title="data[item.prop]"
                >{{ data[item.prop] || 0 }}{{ item.unit ? item.unit : '' }}</span
              >
            </div>
          </template>
          <el-empty v-else :image-size="100" description="暂无数据"></el-empty>
        </div>
      </div>
    </div>
    <!-- 收起内容 -->
    <div v-else class="mincard">
      <div>生</div>
      <div>产</div>
      <div>要</div>
      <div>素</div>
      <div class="card-arrow" @click="toggleCollapse"></div>
    </div>
  </div>
</template>

<script>
import API from '@/api/hierarchicalControl/secondlevel.js';
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
      tabList: [
        { label: '物资', value: '01', prop: '' },
        // { label: "车辆", value: "02", prop: "" },//功能暂缺
        { label: '工器具', value: '03', prop: '' },
        { label: '设备', value: '04', prop: '' },
        { label: '票卡单', value: '05', prop: '' },
      ],
      tabActive: '01',
      visible: true, //控制收起展开状态,true:展开;false:收起
      main: {
        '01': {
          //物资
          hasTab: false,
          tableHeader: [
            {
              name: '物资类型',
              prop: 'typeName',
              width: 'calc(100% / 3)',
            },
            {
              name: '当前库存',
              prop: 'quantity',
              width: 'calc(100% / 3)',
            },
            {
              name: '申领未用',
              prop: 'unusedQty',
              width: 'calc(100% / 3)',
            },
          ],
          api: 'material', //接口名称
          apiMethod: 'handlerCommon', //数据处理方法
        },
        '02': {
          //车辆
          hasTab: false,
          tableHeader: [
            {
              name: '车辆类型',
              prop: 'carname',
              width: '25%',
            },
            {
              name: '车辆总数',
              prop: 'cartotal',
              width: '25%',
            },
            {
              name: '已出车数量',
              prop: 'isdrive',
              width: '25%',
            },
            {
              name: '可用数',
              prop: 'isuse',
              width: '25%',
            },
          ],
          api: 'carData',
        },
        '03': {
          //工器具
          hasTab: false,
          tableHeader: [
            {
              name: '工具类型',
              prop: 'deviceName',
              width: '25%',
            },
            {
              name: '总数量',
              prop: 'totalQuantity',
              width: '25%',
            },
            {
              name: '当前库存',
              prop: 'currentStock',
              width: '25%',
            },
            {
              name: '领用数量',
              prop: 'usedQuantity',
              width: '25%',
            },
          ],
          api: 'meters', //接口名称
          apiMethod: 'handlerCommon', //数据处理方法
        },
        '04': {
          //设备
          hasTab: false,
          tableHeader: [
            {
              name: '设备类型',
              prop: 'devTypeName',
              width: 'calc(100% / 3)',
            },
            {
              name: '安装设备数',
              prop: 'installQty',
              width: 'calc(100% / 3)',
            },
            {
              name: '拆除设备数',
              prop: 'uninstallQty',
              width: 'calc(100% / 3)',
            },
          ],
          api: 'getEquip',
          apiMethod: 'handlerCommon',
        },
        '05': {
          //票卡单
          hasTab: true,
          textEnd: 'end',
          tabList: [
            { typeCode: '05', typeName: '本周' },
            { typeCode: '02', typeName: '本月' },
            { typeCode: '04', typeName: '本年' },
          ],
          tableHeader: [
            {
              name: '票卡单类型',
              prop: 'wtTypeName',
              width: '25%',
            },
            {
              name: '开票数',
              prop: 'totalQuantity',
              width: '25%',
              unit: '个',
            },
            {
              name: '不合格数',
              prop: 'unqualifiedQuantity',
              width: '25%',
              unit: '个',
            },
            {
              name: '不合格率',
              prop: 'unqualifiedRate',
              width: '25%',
              unit: '%',
            },
          ],
          active: '05',
          api: 'workTicketStats', //接口名称
          apiMethod: 'handlerCommon', //数据处理方法
          field: 'dateRange', //接口入参字段
        },
      },
      loading: false, //loading效果
      tableData: [],
      info: null, //当前展示的表格数据
      carData: [{ carname: '工程车', cartotal: '0', isdrive: '0', isuse: '0' }], //为应付项目验收车辆模拟数据
    };
  },
  watch: {
    screensize: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
    },
    orgNo: {
      handler() {
        this.queryData();
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    //页面初始化
    async init() {
      //初始化页面表格数据
      this.info = this.main[this.tabActive];
      this.queryData();
    },
    //类型切换
    tabClick(tab) {
      this.tabActive = tab.value;
      this.info = this.main[this.tabActive];
      this.queryData();
    },
    //字典项切换
    mainTabClick() {
      this.queryData();
    },
    //更多点击事件
    more() {
      let dateType = null;
      let params = {
        id: 'productionFactorsMore',
        tabsIndex: this.tabActive,
      };
      if (this.tabActive == '05') {
        dateType = this.info.active;
        params.dateRange = this.info.active;
      }
      this.$emit('goNewPage', params, dateType);
    },
    //元素折叠
    toggleCollapse() {
      this.visible = !this.visible;
      this.$emit('cardToggle', { type: 'rightCardConfig', toggle: this.visible, is: this.cardId });
    },
    //接口请求
    queryData() {
      let { api, apiMethod, field, active } = this.info; //从当前页面展示配置项中获取api接口名以及接口数据处理方法
      if (api == 'carData') return (this.tableData = this[api]);
      let params = { orgNo: this.orgNo };
      field && (params[field] = active); //给指定字段赋值选中类型
      this.loading = true;
      this.tableData = [];
      API[api](params)
        .then((res) => {
          this[apiMethod](res);
        })
        .finally(() => (this.loading = false));
    },
    //公共数据处理方法
    handlerCommon(res) {
      let { DTS, RT_F } = res.data;
      if (RT_F !== 1) return;
      this.tableData = DTS;
    },
  },
};
</script>

<style lang="scss" scoped>
.productionFactors {
  display: flex;
  pointer-events: all;
  justify-content: end;
  .container {
    width: 446px;
    height: 382px;
    box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
    .container-header {
      height: 60px;
      background-image: url('~@/assets/iconfont/icon/标题背景.svg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      box-sizing: border-box;
      .header-label {
        font-size: 18px;
        font-weight: 700;
        color: #426170;
        .label-arrow {
          display: inline-block;
          cursor: pointer;
          font-size: 14px;
          width: 10px;
          height: 10px;
          background-image: url('~@/assets/iconfont/icon/收起.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      .ability {
        display: flex;
        align-items: center;
        cursor: pointer;
        .tab-text {
          font-size: 12px;
          color: #99a09e;
          cursor: pointer;
        }
        .tab-active {
          color: #009b83;
        }
        .more {
          margin-left: 10px;
          font-size: 14px;
          color: #647671;
          &::after {
            content: '>';
            margin-left: 5px;
            font-size: 16px;
          }
        }
      }
    }
    .container-main {
      height: calc(100% - 60px);
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      ::v-deep .el-tabs[text-end='end'] .el-tabs__nav-scroll {
        display: flex;
        justify-content: end;
      }
      ::v-deep .el-tabs__header {
        margin-bottom: 18px;
        border: none;
        .el-tabs__nav-prev,
        .el-tabs__nav-next {
          line-height: 20px;
          background-color: #eee;
          padding: 0 1px;
        }
        .el-tabs__nav {
          border: none;
          .el-tabs__item {
            border: none;
            height: 20px;
            line-height: 20px;
            background: #eee;
            margin: 0 4.5px;
            border-radius: 4px;
          }
          .is-active {
            background-color: #ccf8e8;
          }
        }
      }
      .table-header {
        height: 36px;
        line-height: 36px;
        background: rgba(181, 199, 211, 0.2);
        font-size: 14px;
        color: #2a2b2f;
        white-space: nowrap;
        .table-column {
          display: inline-block;
          text-align: center;
        }
      }
      .table-tbody {
        flex: 1;
        overflow-y: auto;
        .table-row {
          padding: 12px 0;
          display: flex;
          align-items: center;

          .table-column {
            font-size: 14px;
            display: inline-block;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .table-row:nth-child(even) {
          background: #f9fafa;
        }
      }
    }
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
}
</style>
