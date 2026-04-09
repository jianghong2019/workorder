<template>
  <el-container class="new-safeweb-web">
    <div class="material-view">
      <!-- 查询表单 -->
      <el-header class="cardboxpd">
        <el-form
          id="searchData"
          ref="searchData"
          :model="searchData"
          label-width="80px"
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
                :loading="loadingTable || cardLoading"
                size="small"
                @click="searchSubmit"
                >查 询
              </el-button>
            </div>
          </div>
        </el-form>
      </el-header>
      <div class="title-name">设备情况</div>
      <div v-loading="cardLoading" class="device-status-header">
        <div class="card-box">
          <!-- 第一个卡片：电能表 -->
          <div v-for="(item, index) in cardList" :key="index" class="card">
            <div class="card-left">
              <div class="main-icon-wrapper">
                <img v-if="pageFlag" :src="item.imgUrl1" :alt="item.name" />
                <img v-else :src="item.imgUrl2" :alt="item.name" />
              </div>
              <div :class="pageFlag ? 'title' : 'title-icon'">
                {{ item.name }}
              </div>
            </div>
            <div class="data-group">
              <div v-for="(ite, inde) in item.itemArr" :key="inde" class="data-item">
                <div class="icon">
                  <img :src="ite.imgUrl" />
                </div>
                <div class="itemstyle">
                  <div class="label">{{ ite.name }}</div>
                  <div>
                    <strong
                      :title="cardObj[item.name] ? cardObj[item.name][ite.code] : 0"
                      class="value"
                      >{{ cardObj[item.name] ? cardObj[item.name][ite.code] : 0 }}</strong
                    ><b class="unit"> 个</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 各单位质量情况表格 -->
      <div class="table-container">
        <div class="table-name">
          <div class="title-name">设备清单</div>
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

        <div class="table-box">
          <personTable
            v-loading="loadingTable"
            :is-page="pageFlag"
            :table-data="tableData"
            :columns="getColumns()"
            :table-count="tableCount"
            :page-index="pageIndex"
            :page-size="pageSize"
            @sizeChange="sizeChange"
            @pageChange="pageChange"
          ></personTable>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import {
  getEquipStateList,
  getEquipDetailList,
  getEquipStateLists,
  getEquipDetailLists,
} from '@/api/hierarchicalControl/productionFactorsMore.js';
import personTable from './personTable.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import { useUnitData } from '@/composables/useUnitData.js';
export default {
  name: 'DeviceStatusHeader',
  components: {
    OrgTree,
    personTable,
  },
  props: {
    //判断是本级还是下级
    pageFlag: {
      type: Boolean,
      default: true,
    },
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
      cardLoading: false,
      cardList: [
        {
          imgUrl1: require('@/assets/img/one.png'),
          imgUrl2: require('@/assets/iconfont/icon/生产要素-设备1.png'),
          name: '电能表',
          itemArr: [
            {
              imgUrl: require('@/assets/iconfont/icon/生产要素-设备2.png'),
              name: '安装设备数',
              code: 'installQty',
            },
            {
              imgUrl: require('@/assets/iconfont/icon/生产要素-设备3.png'),
              name: '拆除设备数',
              code: 'uninstallQty',
            },
          ],
        },
        {
          imgUrl1: require('@/assets/img/two.png'),
          imgUrl2: require('@/assets/iconfont/icon/生产要素-设备4.png'),
          name: '采集终端',
          itemArr: [
            {
              imgUrl: require('@/assets/iconfont/icon/生产要素-设备5.png'),
              name: '安装设备数',
              code: 'installQty',
            },
            {
              imgUrl: require('@/assets/iconfont/icon/生产要素-设备6.png'),
              name: '拆除设备数',
              code: 'uninstallQty',
            },
          ],
        },
        {
          imgUrl1: require('@/assets/img/three.png'),
          imgUrl2: require('@/assets/iconfont/icon/生产要素-设备7.png'),
          name: '互感器',
          itemArr: [
            {
              imgUrl: require('@/assets/iconfont/icon/生产要素-设备8.png'),
              name: '安装设备数',
              code: 'installQty',
            },
            {
              imgUrl: require('@/assets/iconfont/icon/生产要素-设备9.png'),
              name: '拆除设备数',
              code: 'uninstallQty',
            },
          ],
        },
      ],
      cardObj: {},
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      // 可以在这里添加动态数据
      searchData: { orgNo: this.orgNo, user: '', dateTime: [] },
      searchDatas: { orgNo: this.orgNo, user: '', dateTime: [] },
      tableData: [],
      column: [
        {
          prop: 'personName',
          label: '人员',
        },
        {
          prop: 'wq',
          label: '电能表',
          children: [
            {
              prop: 'meterInstallQty',
              label: '安装设备数',
            },
            {
              prop: 'meterUninstallQty',
              label: '拆除设备数',
            },
          ],
        },
        {
          prop: 'wq1',
          label: '采集终端',
          children: [
            {
              prop: 'acqInstallQty',
              label: '安装设备数',
            },
            {
              prop: 'acqUninstallQty',
              label: '拆除设备数',
            },
          ],
        },
        {
          prop: 'wq2',
          label: '互感器',
          children: [
            {
              prop: 'itInstallQty',
              label: '安装设备数',
            },
            {
              prop: 'itUninstallQty',
              label: '拆除设备数',
            },
          ],
        },
      ],
      columns: [
        {
          prop: 'orgName',
          label: '单位',
        },
        {
          prop: 'wq',
          label: '电能表',
          children: [
            {
              prop: 'meterInstallQty',
              label: '安装设备数',
            },
            {
              prop: 'meterUninstallQty',
              label: '拆除设备数',
            },
          ],
        },
        {
          prop: 'wq1',
          label: '采集终端',
          children: [
            {
              prop: 'acqInstallQty',
              label: '安装设备数',
            },
            {
              prop: 'acqUninstallQty',
              label: '拆除设备数',
            },
          ],
        },
        {
          prop: 'wq2',
          label: '互感器',
          children: [
            {
              prop: 'itInstallQty',
              label: '安装设备数',
            },
            {
              prop: 'itUninstallQty',
              label: '拆除设备数',
            },
          ],
        },
      ],
    };
  },
  computed: {
    getColumns() {
      return () => {
        return this.pageFlag ? this.column : this.columns;
      };
    },
  },
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
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
      this.getEquipStateListFn();
      if (this.pageFlag) {
        //本级
      } else {
        this.searchDatas.orgNo = this.orgNo;
        this.searchData.orgNo = this.orgNo;
      }
      this.getEquipDetailListFn();
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
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
        },
        url = null;
      if (this.pageFlag) {
        //本级
        exportClickparams = {
          ...exportClickparams,
          orgNo: this.orgNo,
          personName: this.searchDatas.user,
        };
        url = '/safemanage-evaluation/productionFactor/exportEquipDetailList';
      } else {
        //下级
        exportClickparams = {
          ...exportClickparams,
          orgNo: this.searchDatas.orgNo,
        };
        url = '/safemanage-evaluation/productionFactorSub/exportEquipDetailList';
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
    //设备清单
    getEquipDetailListFn() {
      let url = this.pageFlag ? getEquipDetailList : getEquipDetailLists;
      let params = {
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
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
        params = {
          ...params,

          personName: this.searchDatas.user,
          orgNo: this.orgNo,
        };
      } else {
        params = {
          ...params,

          orgNo: this.searchDatas.orgNo,
        };
      }
      this.loadingTable = true;
      url(params)
        .then(({ data }) => {
          this.loadingTable = false;
          if (data.RT_F === 1) {
            this.tableData = data.DTS.list || [];
            this.tableCount = data.DTS.total || 0;
          } else {
            this.tableData = [];
            this.tableCount = 0;
            this.$message({
              type: 'error',
              message: data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.tableData = [];
          this.tableCount = 0;
          this.loadingTable = false;
        });
    },
    //设备情况
    getEquipStateListFn() {
      this.cardLoading = true;
      let url = this.pageFlag ? getEquipStateList : getEquipStateLists;
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
      };
      if (this.pageFlag) {
        params = {
          ...params,

          personName: this.searchDatas.user,
          orgNo: this.orgNo,
        };
      } else {
        params = {
          ...params,

          orgNo: this.searchDatas.orgNo,
        };
      }
      url(params)
        .then(({ data }) => {
          this.cardLoading = false;
          if (data.RT_F === 1) {
            let arr = data.DTS || [],
              obj = {};
            arr.forEach((item) => {
              if (!obj[item.equipName]) {
                obj[item.equipName] = {};
              }
              obj[item.equipName].installQty = item.installQty || '0';
              obj[item.equipName].uninstallQty = item.uninstallQty || '0';
            });
            this.cardObj = { ...obj };
          } else {
            this.cardObj = {};
            this.$message({
              type: 'error',
              message: data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.cardObj = {};
          this.cardLoading = false;
        });
    },
    //查询按钮
    searchSubmit() {
      this.pageIndex = 1;
      this.searchDatas = { ...this.searchData };
      this.getEquipDetailListFn();
      this.getEquipStateListFn();
    },
    //重置
    refresh() {
      this.searchData = this.$options.data.call(this).searchData;
      this.searchSubmit();
    },
    sizeChange(e) {
      this.pageIndex = 1;
      this.pageSize = e;
      this.getEquipDetailListFn();
    },
    pageChange(e) {
      this.pageIndex = e;
      this.getEquipDetailListFn();
    },
  },
};
</script>

<style scoped lang="scss">
@import './style.scss';
.new-safeweb-web {
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
.table-container {
  margin-top: 20px;
  border-radius: 4px;
  /* margin-top: 10px;
  border: 1px dashed #e6e6e6;
  border-radius: 4px;
  overflow: hidden; */

  background: white;

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
.material-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-container {
    background: white;
    padding: 0 0 20px 0;
    display: flex;
    flex-direction: column;
  }
}
.device-status-header {
  background: white;
  padding: 0 20px;
  border-radius: 0 0 4px 4px;
  .card-box {
    display: flex;
    overflow: auto;
    padding-bottom: 20px;
  }
  /* background: linear-gradient(135deg, #e6f7ff, #b3f5e8);
  border-radius: 8px; */
}
.itemstyle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  & > div:nth-child(2) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  .unit {
    color: #666;
    font-size: 14px;
  }
}
.card {
  /* flex: 1;
  background: white;
  border: 1px dashed #e6e6e6;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  min-width: 200px; */

  display: flex;
  align-items: center;
  text-align: center;
  flex: 1;
  gap: 10px;
  padding: 0 16px 0 32px;
  /* background: linear-gradient(135deg, #e6f7ff, #b3f5e8); */

  border-radius: 8px;
  text-align: center;
  height: 116px;
  background: rgba(0, 155, 131, 0.06);
  border-radius: 8px;
  &:not(:last-child) {
    margin-right: 20px;
  }
}

.card > * {
  margin: 0px;
  padding: 0px;
}

.main-icon-wrapper {
  /* width: 60px;
  height: 60px;
  margin: 0 auto 10px; */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* width: 60px;
  height: 60px; */
}
.card-left {
  position: relative;
  & > div:last-child {
    font-size: 18px;
    font-weight: 500;
    color: #426170;
  }
  .title {
    position: absolute;
    bottom: 13px;
    left: 0;
    right: 0;
  }
  .title-icon {
    margin-top: 2px;
  }
}
.main-icon-wrapper img {
  width: 108px;
  /* width: 100%;
  height: 100%;
  object-fit: cover; */
}

.data-group {
  display: flex;
  justify-content: space-between;
  padding-left: 18px;
  flex: 1;
}

.data-item {
  /* flex: 1;
  padding: 8px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  text-align: center;
  background: #f8f9fa; */
  margin-left: 12px;
  display: flex;
  background: white;
  padding: 16px 36px 16px 16px;
  border-radius: 4px;
  /* flex-direction: column; */
  // justify-content: center;
  align-items: center;
  text-align: center;
  flex: 0.5;
  gap: 10px;
}

.icon {
  font-size: 16px;
  color: #666;
}

.label {
  font-size: 16px;
  color: #3d3d3d;
  white-space: nowrap;
  margin-bottom: 12px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #f7bd3b;
}
.value1 {
  font-size: 24px;
  font-weight: bold;
  color: #ec404f;
}
</style>
