<template>
  <el-container class="new-safeweb-web">
    <!-- 物资总览 -->
    <div class="overview">
      <!-- 查询表单 -->
      <el-header class="cardboxpd">
        <el-form
          id="searchData"
          ref="searchData"
          :model="searchData"
          label-width="80px"
          class="searchData search_input"
          action="http://"
          target="stop"
        >
          <div class="style-form">
            <el-form-item label="日期选择" prop="dateTime" class="date-box">
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
            <el-form-item v-if="!pageFlag" label="单位" prop="orgNo">
              <org-tree v-model="searchData.orgNo" :unit-data="unitData"></org-tree>
            </el-form-item>
            <el-form-item v-else label="姓名" prop="user">
              <el-input v-model="searchData.user" placeholder="请输入"></el-input>
            </el-form-item>
            <div class="flex-row-end search-buttons">
              <el-button class="el-btn-new reset-btn" plain size="small" @click="refresh"
                >重 置</el-button
              >
              <el-button
                class="el-btn-new search-btn"
                type="primary"
                plain
                :loading="loadingTable || loadingOne"
                size="small"
                @click="searchSubmit"
                >查 询
              </el-button>
            </div>
          </div>
        </el-form>
      </el-header>
      <div class="title-name">{{ pageFlag ? '物资耗材使用' : '物资总览' }}</div>
      <div v-loading="loadingOne" class="item-contain" :class="{ 'style-height': pageFlag }">
        <div>
          <personTable
            :table-data="materialItems"
            :is-page="false"
            :columns="materialItemsColumns"
          ></personTable>
        </div>
      </div>
    </div>
    <!-- 各单位质量情况表格 -->
    <div class="table-container">
      <div class="table-name">
        <div class="title-name">
          {{ pageFlag ? '人员领用情况' : '物资领用情况' }}
        </div>
        <el-button
          :disabled="loadingTable"
          class="el-btn-new reset-btn"
          size="small"
          @click="newExportClick"
        >
          <i class="iconfont icon-daochu1"></i>
          导出
        </el-button>
      </div>
      <div v-loading="loadingTable" class="table-box">
        <personTable
          :table-data="tableData"
          :is-page="pageFlag"
          :columns="columns"
          :table-count="tableCount"
          :page-index="pageIndex"
          :page-size="pageSize"
          @sizeChange="sizeChange"
          @pageChange="pageChange"
        ></personTable>
      </div>
    </div>
  </el-container>
</template>

<script>
import personTable from './personTable.vue';
import {
  getMaterialConsumableUsageList,
  getMaterialConsumablePeopleList,
  getMaterialList,
  getMaterialConsumeList,
} from '@/api/hierarchicalControl/productionFactorsMore.js';
import defaultImg from '@/assets/iconfont/icon/物资总览.png';
import OrgTree from '@/components/common/form/OrgTree.vue';
import { useUnitData } from '@/composables/useUnitData.js';
import { nextTick } from 'vue';
export default {
  components: {
    OrgTree,
    personTable,
    nullData: () => import('@/components/common/form/nullData.vue'),
  },
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
    };
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
  data() {
    return {
      loadingTable: false,
      loadingOne: false,
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      defaultImg,
      unit: '',
      dateRange: '',
      searchData: { orgNo: this.orgNo, dateTime: [], user: '' },
      searchDatas: { orgNo: this.orgNo, dateTime: [], user: '' },
      tableData: [],
      columns: [],
      materialItemsColumns: [],
      materialItems: [],
    };
  },
  mounted() {
    this.nowtimeTypeweek();
  },
  methods: {
    // 周第一天和最后一天
    nowtimeTypeweek() {
      let day = new Date().getDay();
      var nowTime = new Date().getTime();
      var oneDayTime = 24 * 60 * 60 * 1000;
      var MondayTime = nowTime - (day - 1) * oneDayTime;
      var SundayTime = nowTime + (7 - day) * oneDayTime;
      var beginTime = new Date(MondayTime);
      var endTime = new Date(SundayTime);
      let startDate = formatDate(beginTime);
      let endDate = formatDate(endTime);
      this.searchData.dateTime = [startDate, endDate];
      this.searchDatas.dateTime = [startDate, endDate];
      this.getCountListFn();
      if (this.pageFlag) {
        //本级
        this.getMaterialConsumablePeopleRequestListFn();
      } else {
        //下级
        this.searchData.orgNo = this.orgNo;
        this.searchDatas.orgNo = this.orgNo;
        this.getMaterialConsumeListFn();
      }
    },
    //导出
    newExportClick() {
      if (!this.tableData.length) {
        return this.$message.error('暂无数据可以导出!');
      }
      this.exportClick();
    },
    exportClick() {
      let exportClickparams = {
          endDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[1]
              ? this.searchDatas.dateTime[1]
              : ''
            : '',
          startDate: this.searchDatas.dateTime
            ? this.searchDatas.dateTime[0]
              ? this.searchDatas.dateTime[0]
              : ''
            : '',
        },
        url = null;
      if (this.pageFlag) {
        //本级
        exportClickparams = {
          ...exportClickparams,
          orgNo: this.orgNo,
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          personName: this.searchDatas.user,
        };
        url = '/safemanage-evaluation/productionFactor/exportMaterialConsumablePeopleList';
      } else {
        //下级
        exportClickparams = {
          ...exportClickparams,
          orgNo: this.searchDatas.orgNo,
        };
        url = '/safemanage-evaluation/productionFactorSub/materialConsumeStatusExport';
      }
      var form = document.createElement('form');
      form.style.display = 'none';
      form.action = url; // 测试时需要改动
      form.method = 'post';
      document.body.appendChild(form);
      for (let key in exportClickparams) {
        let input = document.createElement('input');
        input.input = 'hidden';
        input.name = key;
        input.value = exportClickparams[key];
        form.appendChild(input);
      }
      // // 添加排序 和 查询条件
      form.submit();
      form.remove();
    },
    getCountListFn() {
      let url = this.pageFlag ? getMaterialConsumableUsageList : getMaterialList;
      let params = {
        orgNo: this.pageFlag ? this.orgNo : this.searchDatas.orgNo,
        endDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[1]
            ? this.searchDatas.dateTime[1]
            : ''
          : '',
        startDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[0]
            ? this.searchDatas.dateTime[0]
            : ''
          : '',
      };
      if (this.pageFlag) {
        params.personName = this.searchDatas.user;
      }
      this.loadingOne = true;
      url(params)
        .then((res) => {
          this.loadingOne = false;
          if (res.data.RT_F === 1) {
            let arr = [
                {
                  label: '',
                  prop: 'name',
                  width: '120px',
                },
              ],
              arrData = [
                { name: '总数量' },
                { name: '实时库存' },
                { name: '领用总数' },
                { name: '领用未用' },
                { name: '实际使用' },
              ],
              list = res.data.DTS || [];
            if (list.length === 0) {
              this.materialItemsColumns = [];
              this.materialItems = [];
              return;
            }
            list.forEach((item, index) => {
              arr.push({
                label: item.typeName + (item.unitName ? `(${item.unitName})` : ''),
                prop: 'prop' + index,
                width: item.typeName.length < 4 ? '120px' : '160px',
              });
              if (this.pageFlag) {
                arrData[0]['prop' + index] = item.totalQty;
                arrData[1]['prop' + index] = item.inventoryQty;
                arrData[2]['prop' + index] = item.requestQty;
                arrData[3]['prop' + index] = item.unusedQty;
                arrData[4]['prop' + index] = item.usageQty;
              } else {
                arrData[0]['prop' + index] = item.totalQuantity;
                arrData[1]['prop' + index] = item.quantity;
                arrData[2]['prop' + index] = item.requestQuantity;
                arrData[3]['prop' + index] = item.unusedQty;
                arrData[4]['prop' + index] = item.usageQty;
              }
            });
            this.materialItemsColumns = [...arr];
            this.materialItems = [...arrData];
          } else {
            this.materialItemsColumns = [];
            this.materialItems = [];
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.materialItemsColumns = [];
          this.materialItems = [];
          this.loadingOne = false;
        });
    },
    //下级-获取物资领用情况数据
    getMaterialConsumeListFn() {
      // console.log(1111,this.searchDatas.dateTime);
      this.loadingTable = true;
      let params = {
        orgNo: this.searchDatas.orgNo,
        endDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[1]
            ? this.searchDatas.dateTime[1]
            : ''
          : '',
        startDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[0]
            ? this.searchDatas.dateTime[0]
            : ''
          : '',
      };
      getMaterialConsumeList(params)
        .then((res) => {
          this.loadingTable = false;
          if (res.data.RT_F === 1) {
            let columnArr = res.data.DTS.paramList || [],
              tableArr = res.data.DTS.fromData || [];
            this.columns = [
              { label: '单位', prop: 'orgName' },
              { label: '完成工单数', prop: 'finishedWorkCount' },
              ...columnArr,
            ].map((item) => {
              item.width = item.label?.length <= 2 ? '100px' : ('120px' ?? '100px');
              if (item.children) {
                item.children.forEach((ite) => {
                  ite.width = ite.label?.length <= 2 ? '100px' : ('120px' ?? '100px');
                  // ite.classStyle =
                  //   ite.label === "可持续天数" ? "color-red" : "";
                  // ite.expression = {
                  //   type: 1,
                  //   num: 30,
                  // };
                });
              }
              return item;
            });
            this.tableData = [...tableArr];
          } else {
            this.tableData = [];
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.tableData = [];
          this.loadingTable = false;
        });
    },
    //本级-获取人员领用情况
    getMaterialConsumablePeopleRequestListFn() {
      this.loadingTable = true;
      let params = {
        endDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[1]
            ? this.searchDatas.dateTime[1]
            : ''
          : '',
        startDate: this.searchDatas.dateTime
          ? this.searchDatas.dateTime[0]
            ? this.searchDatas.dateTime[0]
            : ''
          : '',
        orgNo: this.orgNo,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        personName: this.searchDatas.user,
      };
      getMaterialConsumablePeopleList(params)
        .then((res) => {
          this.loadingTable = false;
          if (res.data.RT_F === 1) {
            let columnArr = [],
              list = res.data.DTS.list || [],
              tableArr = [];
            this.tableCount = res.data.DTS.total || 0;
            list.forEach((item, index) => {
              if (index === 0) {
                columnArr.push(
                  {
                    prop: 'personName',
                    label: '人员',
                    width: '100px',
                  },
                  {
                    prop: 'finishedQty',
                    label: '完成工单数',
                    width: '120px',
                  }
                );
                item.types.forEach((ite, inde) => {
                  let columnObj = {
                    label: ite.typeName,
                    children: [
                      {
                        prop: 'requestQty' + inde,
                        label: '领用数量',
                        width: '100px',
                      },
                      {
                        prop: 'unusedQty' + inde,
                        label: '申领未用',
                        width: '100px',
                      },
                      {
                        prop: 'usageQty' + inde,
                        label: '实际使用数',
                        width: '120px',
                      },
                    ],
                  };
                  columnArr.push(columnObj);
                });
              }
              let obj = {
                personName: item.personName,
                finishedQty: item.finishedQty,
              };
              item.types.forEach((ite, inde) => {
                for (let it in ite) {
                  obj[it + inde] = ite[it];
                }
              });
              tableArr.push(obj);
            });
            this.columns = [...columnArr];
            this.tableData = [...tableArr];
          } else {
            this.tableCount = 0;
            this.tableData = [];
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.tableCount = 0;
          this.tableData = [];
          this.loadingTable = false;
        });
    },
    sizeChange(e) {
      this.pageIndex = 1;
      this.pageSize = e;
      this.getMaterialConsumablePeopleRequestListFn();
    },
    pageChange(e) {
      this.pageIndex = e;
      this.getMaterialConsumablePeopleRequestListFn();
    },
    searchSubmit() {
      this.pageIndex = 1;
      this.searchDatas = { ...this.searchData };
      this.getCountListFn();
      if (this.pageFlag) {
        //本级
        this.getMaterialConsumablePeopleRequestListFn();
      } else {
        //下级
        this.getMaterialConsumeListFn();
      }
    },
    refresh() {
      this.searchData = {
        orgNo: this.orgNo,
        dateTime: [],
        user: '',
      };
      this.searchSubmit();
    },
  },
};
</script>

<style scoped lang="scss">
@import './style.scss';
.new-safeweb-web {
  .overview {
    border-radius: 0 0 4px 4px;
    .item-contain {
      display: flex;
      padding: 0 0 20px 0;
      box-sizing: border-box;
      & > div {
        overflow: hidden;
        flex: 1;
      }
      .no-data {
        height: 250px;
      }
      .item {
        padding: 18px;
        background: #f5f7f7;
        border-radius: 4px;
        height: 260px;
        width: 590px;
        box-sizing: border-box;
        margin-right: 20px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        .item-name {
          margin-bottom: 12px;
          font-size: 16px;
          color: #426170;
        }
        .item-bottom {
          flex: 1;
          display: flex;
          .item-img {
            margin-right: 37px;
            width: 245px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .item-info {
            flex: 1;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            p {
              margin-top: 8px;
              font-size: 14px;
              color: #666;
              display: flex;
              span {
                color: #333;
                margin-left: 20px;
                display: inline-block;
                flex: 1;
                text-align: right;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }
  .cardboxpd {
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
}
/* ::v-deep main{background-color: white !important;} */
::v-deep .el-main .el-main-wrap {
  background: white;
}
.overview {
  background: white;
}
.material-view {
  background: white;
  width: 100%;
  height: 100%;
}
.table-container {
  background: white;
  padding: 0 0 20px 0;
  border-radius: 4px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  .table-name {
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-button {
    border: 2px dashed #dee0e6;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.table-section {
  margin-top: 20px;
}
</style>
