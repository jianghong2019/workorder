<template>
  <!-- 人员情况 -->
  <div class="person-status">
    <!-- 主体内容 -->
    <div v-if="visible" class="container">
      <div class="container-header">
        <div class="header-label">
          <span>人员情况</span>
          <span class="label-arrow" @click="toggleCollapse"></span>
        </div>
        <!-- 能力按钮区域 -->
        <div class="ability">
          <span class="more" @click="more">更多</span>
        </div>
      </div>
      <!-- 人员组成 -->
      <div class="container-compose">
        <header class="sub-title">
          <img class="title-img" src="@/assets/iconfont/icon/二级标题右.svg" />
          <span class="title-label">人员组成</span>
        </header>
        <!-- 人员组成主体页面 -->
        <main v-loading="composeConfig.loading" class="compose-main">
          <div class="total-left">
            <img class="total-img" src="@/assets/iconfont/icon/人员情况总数.svg" />
            <div class="total-main">
              <span class="total-num">{{ composeConfig.value }}</span>
              <span class="total-unit">{{ composeConfig.unit }}</span>
              <div class="total-label">{{ composeConfig.label }}</div>
            </div>
          </div>
          <img src="@/assets/iconfont/icon/include.svg" class="compose-include" />
          <el-row class="type-right">
            <el-col
              v-for="item of composeConfig.typeList"
              :key="item.prop"
              :span="12"
              :style="{ 'margin-bottom': item.marginBottom }"
            >
              <img :src="item.icon" class="type-icon" />
              <span class="type-label">{{ item.label }}</span>
              <span class="type-num" :style="{ color: item.color }">{{ item.value }}</span>
              <span class="type-unit" :style="{ color: item.color }">{{ item.unit }}</span>
            </el-col>
          </el-row>
        </main>
      </div>
      <!-- 综合评价 -->
      <div class="container-evaluate">
        <header class="sub-title">
          <img class="title-img" src="@/assets/iconfont/icon/二级标题右.svg" />
          <div class="title-label">
            <span>综合评价</span>
            <div class="date-gruop">
              <span
                v-for="date of evaluateConfig.dateList"
                :key="date.value"
                :class="{ 'is-active': date.value == evaluateConfig.dateRange }"
                class="gruop-btn"
                @click="dateClick(date)"
                >{{ date.label }}</span
              >
              <img
                v-if="isJumpFlag"
                class="setting-icon"
                src="@/assets/iconfont/icon/setting.svg"
                @click="jumpPage"
              />
            </div>
          </div>
        </header>
        <!-- top5排名 -->
        <main v-loading="evaluateConfig.loading" class="evaluate-main">
          <!-- 类型选择器 -->
          <el-tabs v-model="evaluateConfig.pointTerm" type="card" @tab-click="mainTabClick">
            <el-tab-pane
              v-for="tab of evaluateConfig.pointTermList"
              :key="tab.value"
              :label="tab.label"
              :name="tab.value"
            ></el-tab-pane>
          </el-tabs>
          <div class="table-header">
            <span
              v-for="item of evaluateConfig.tableHeader"
              :key="item.prop"
              class="table-column"
              :style="{ width: item.width }"
              >{{ item.name }}</span
            >
          </div>
          <div class="table-tbody">
            <template v-if="evaluateConfig.tableData.length">
              <div v-for="(data, index) of evaluateConfig.tableData" :key="index" class="table-row">
                <span
                  v-for="item of evaluateConfig.tableHeader"
                  :key="item.prop + index"
                  class="table-column"
                  :style="{ width: item.width, color: item.color }"
                >
                  <span v-if="item.prop == 'rank'" class="rank-box">
                    <img :src="loadImage(data.ranking)" class="rank-icon" />
                    <span class="rank-label">{{ data.ranking }}</span>
                  </span>
                  <span v-else @click="jumpPeopleEdit(item, data)"
                    >{{ data[item.prop] }}{{ item.unit ? item.unit : '' }}</span
                  >
                </span>
              </div>
            </template>
            <el-empty v-else :image-size="100" description="暂无数据"></el-empty>
          </div>
        </main>
      </div>
    </div>
    <!-- 收起内容 -->
    <div v-else class="mincard">
      <div>人</div>
      <div>员</div>
      <div>情</div>
      <div>况</div>
      <div class="card-arrow" @click="toggleCollapse"></div>
    </div>
  </div>
</template>
<script>
import API from '@/api/hierarchicalControl/firstlevel.js';
import { mapState } from 'vuex';
export default {
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
  watch: {
    screensize: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
    },
    orgNo: {
      handler() {
        this.init();
      },
    },
  },
  computed: {
    ...mapState({
      UserData: (state) => state.UserData,
    }),
    isJumpFlag() {
      //是否具备跳转能力
      return this.orgNo == this.UserData.orgId;
    },
  },
  data() {
    return {
      visible: true, //主体内容展开还是收起
      composeConfig: {
        //人员组成配置
        value: '0',
        prop: 'totalCount',
        unit: '人',
        label: '人员总数',
        typeList: [
          //分类配置
          {
            icon: require('@/assets/iconfont/icon/主业人员.svg'),
            label: '主业人员',
            unit: '人',
            value: '0',
            prop: 'mainBusinessCount',
            color: '#009b83',
            marginBottom: '10px',
          },
          {
            icon: require('@/assets/iconfont/icon/外包人员.svg'),
            label: '外包人员',
            unit: '人',
            value: '0',
            prop: 'outsourcedCount',
            color: '#15acfc',
            marginBottom: '10px',
          },
          {
            icon: require('@/assets/iconfont/icon/管理人员.svg'),
            label: '管理人员',
            unit: '人',
            value: '0',
            prop: 'managerCount',
            color: '#15ddc2',
          },
          {
            icon: require('@/assets/iconfont/icon/作业人员.svg'),
            label: '作业人员',
            unit: '人',
            value: '0',
            prop: 'workerCount',
            color: '#15ddc2',
          },
        ],
        loading: false,
      },
      evaluateConfig: {
        //综合评价
        dateList: [
          { label: '本月', value: '02' },
          { label: '本季', value: '03' },
          { label: '本年', value: '04' },
        ],
        dateRange: '02',
        pointTermList: [
          { label: '总积分', value: '00' },
          { label: '工作量', value: '01' },
          { label: '工作质量', value: '02' },
          { label: '工作规范', value: '03' },
          { label: '工作效率', value: '04' },
          { label: '风险防范', value: '05' },
        ],
        tableHeader: [
          {
            name: '排名',
            prop: 'rank',
            width: 'calc(100% / 3)',
          },
          {
            name: '姓名',
            prop: 'personName',
            width: 'calc(100% / 3)',
          },
          {
            name: '积分',
            prop: 'totalPoints',
            width: 'calc(100% / 3)',
          },
        ],
        tableData: [],
        pointTerm: '00',
        loading: false,
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.personStats();
      this.pointRank();
    },
    loadImage(ranking) {
      return require(`@/assets/iconfont/icon/rank-${ranking}.svg`);
    },
    toggleCollapse() {
      this.visible = !this.visible;
      this.$emit('cardToggle', { type: 'rightCardConfig', toggle: this.visible, is: this.cardId });
    },
    //更多
    more() {
      this.$emit(
        'goNewPage',
        { id: 'personnelStatistics', dateRange: this.evaluateConfig.dateRange },
        this.evaluateConfig.dateRange
      );
    },
    //日期维度点击
    dateClick(date) {
      this.evaluateConfig.dateRange = date.value;
      this.pointRank();
    },
    //评分类型切换
    mainTabClick() {
      this.pointRank();
    },
    //跳转五维评价规则配置页面
    jumpPage() {
      if (!this.isJumpFlag) return;
      window.parent.openNewTab(
        { text: '五维评价管理', name: 'XB_WUWEI' },
        {
          text: '评价规则配置',
          name: 'XB_PJGZPZ',
          url: '/workorderMapVisual_front/workorderMapVisual_front/index.html#/ruleConfiguration',
        }
      );
    },
    //跳转人员能力画像页面
    jumpPeopleEdit(item, data) {
      console.log('跳转人员能力画像页面', data, item);
      let { prop } = item;
      if (prop !== 'personName') return;
      let dateType = this.evaluateConfig.dateRange,
        dimension = '';
      if (dateType == '02') {
        dimension = '1';
      } else if (dateType == '03') {
        dimension = '2';
      } else if (dateType == '04') {
        dimension = '3';
      }
      this.$router.push({
        path: '/fiveDimensionEvaluation/workerCapabilityProfile',
        query: {
          userId: data.personId,
          orgNo: data.orgNo,
          dateType: dimension,
        },
      });
    },
    //人员情况查询
    personStats() {
      this.composeConfig.loading = true;
      API.personStats({ orgNo: this.orgNo })
        .then((res) => {
          let { DTS, RT_F } = res.data;
          if (RT_F !== 1) return;
          this.composeConfig.value = DTS[this.composeConfig.prop];
          this.composeConfig.typeList.forEach((item) => (item.value = DTS[item.prop]));
        })
        .finally(() => (this.composeConfig.loading = false));
    },
    //综合评价数据查询
    pointRank() {
      let { dateRange, pointTerm } = this.evaluateConfig;
      //由于总积分pointTerm需要传空,但是el-tab组件v-model绑定会默认将空字符串转为"0"所以页面使用"00"代表总积分，但请求接口时将00转为空字符串
      if (pointTerm == '00') pointTerm = '';
      let params = {
        orgNo: this.orgNo,
        dateRange,
        pointTerm,
      };
      this.evaluateConfig.loading = true;
      this.evaluateConfig.tableData = [];
      API.pointRank(params)
        .then((res) => {
          let { RT_F, DTS } = res.data;
          if (RT_F !== 1) return;
          this.evaluateConfig.tableData = DTS;
        })
        .finally(() => (this.evaluateConfig.loading = false));
    },
  },
};
</script>
<style lang="scss" scoped>
.person-status {
  // height: 493px;
  display: flex;
  justify-content: end;
  margin-bottom: 16px;
  pointer-events: all;
  .container {
    box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
    width: 446px;
    height: 493px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
    .sub-title {
      height: 20px;
      display: flex;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      .title-img {
        height: 100%;
      }
      .title-label {
        padding-left: 10px;
        flex: 1;
        line-height: 20px;
        background-image: url('~@/assets/iconfont/icon/二级标题背景.svg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
    .container-header {
      height: 60px;
      line-height: 60px;
      background-image: url('~@/assets/iconfont/icon/标题背景.svg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
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
        .more {
          margin-left: 28px;
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
    .container-compose {
      padding: 0 8px;
      .compose-main {
        color: #426170;
        display: flex;
        align-items: center;
        margin: 5px 0;
        .total-left {
          flex-shrink: 0;
          display: flex;
          .total-img {
            height: 86px;
          }
          .total-main {
            padding-top: 10px;
            .total-num {
              font-size: 24px;
              font-weight: 700;
              color: #2a2b2f;
            }
            .total-unit {
              font-size: 12px;
            }
            .total-label {
              margin-top: 12px;
              font-size: 14px;
            }
          }
        }
        .compose-include {
          margin: 0 8px 0 6px;
        }
        .type-right {
          white-space: nowrap;
          .type-icon {
            vertical-align: middle;
          }
          .type-label {
            font-size: 14px;
          }
          .type-num {
            font-size: 18px;
            font-weight: 700;
          }
          .type-unit {
            font-size: 12px;
          }
        }
      }
    }
    .container-evaluate {
      flex: 1;
      padding: 0 8px;
      .title-label {
        display: flex;
        justify-content: space-between;
        .date-gruop {
          .gruop-btn {
            display: inline-block;
            width: 49px;
            text-align: center;
            color: #7b807e;
            font-size: 12px;
            font-weight: 400;
            height: 20px;
            line-height: 20px;
            cursor: pointer;
          }
          .gruop-btn.is-active {
            background-color: #009b83;
            color: #fff;
            border-radius: 4px;
          }
          .setting-icon {
            margin-left: 12px;
            height: 20px;
            vertical-align: middle;
            cursor: pointer;
          }
        }
      }
      .evaluate-main {
        height: calc(100% - 20px);
        display: flex;
        flex-direction: column;
        ::v-deep .el-tabs__header {
          margin: 12px 0 0 0;
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
          font-size: 14px;
          font-weight: 500;
          color: #426170;
          .table-column {
            display: inline-block;
            text-align: center;
          }
        }
        .table-tbody {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-bottom: 8px;
          overflow-y: auto;
          .table-row {
            flex: 1;
            display: flex;
            align-items: center;
            background: #f4fbfa;
            font-size: 14px;
            .table-column {
              display: inline-block;
              text-align: center;
            }
            .table-column:nth-child(2) {
              cursor: pointer;
              color: #009b83;
            }
            .rank-box {
              position: relative;
              .rank-icon {
                width: 25px;
              }
              .rank-label {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-60%, -50%);
                font-size: 11px;
                color: #fff;
                font-weight: 700;
              }
            }
          }
          .table-row + .table-row {
            margin-bottom: 2px;
          }
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
