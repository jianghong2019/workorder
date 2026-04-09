<template>
  <el-container class="new-safeweb-web">
    <!-- 查询表单 -->
    <el-header v-if="!pageFlag" class="cardboxpd">
      <el-form
        id="searchData"
        ref="searchData"
        :model="searchData"
        label-width="80px"
        class="searchData search_input"
        action="http://"
        target="stop"
      >
        <div class="flex-wrap">
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
          <el-form-item label="单位" prop="orgNo">
            <org-tree v-model="searchData.orgNo" :unit-data="unitData"></org-tree>
          </el-form-item>
          <div class="flex-row-end search-buttons">
            <el-button class="el-btn-new reset-btn" plain size="small" @click="refresh"
              >重 置</el-button
            >
            <el-button
              class="el-btn-new search-btn"
              type="primary"
              :loading="loadingTable || loadingInfo"
              plain
              size="small"
              @click="searchSubmit"
              >查 询
            </el-button>
          </div>
        </div>
      </el-form>
    </el-header>
    <!-- 查询条件区域 -->
    <div v-else class="search-form">
      <el-form label-width="110px" :model="queryParams" :inline="true" size="small">
        <el-form-item label="设备状态">
          <el-select v-model="queryParams.devStatus" placeholder="请选择" clearable>
            <el-option label="已发放" value="02"></el-option>
            <el-option label="未发放" value="01"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产编号">
          <el-input v-model="queryParams.assetNo" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="保管人">
          <el-input v-model="queryParams.manageUser" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="领用时间:" class="date-box">
          <el-date-picker
            v-model="queryParams.requestTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <i class="el-icon-date data-icon"></i>
        </el-form-item> -->
        <el-form-item label="建档人">
          <el-input v-model="queryParams.createUser" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="建档时间：" class="date-box">
          <el-date-picker
            v-model="queryParams.createTime"
            type="daterange"
            range-separator="至"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="生产厂商">
          <el-select v-model="queryParams.manufacturer" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in manufacturerList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item class="item-btn">
          <el-button
            :loading="loadingObj[this.activeTab] || loadingInfo"
            type="primary"
            size="small"
            @click="handleSearch"
            >查询</el-button
          >
          <el-button size="small" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="title-name">设备信息</div>
    <div v-loading="loadingInfo" class="card-all">
      <div class="device-header">
        <!-- 第一个卡片：掌机 -->

        <div v-for="item in infoArr" :key="item.name" class="card card1">
          <div class="card-left">
            <div class="icon-wrapper">
              <img :src="item.imgUrl" :alt="item.name" />
            </div>
            <div class="title">{{ item.name }}</div>
          </div>
          <div class="data-group">
            <div class="data-item">
              <img :src="item.imgUrl1" />
              <div class="label">总数量</div>
              <div class="value1">
                <strong :title="infoList[item.name] ? infoList[item.name].num4 : 0">{{
                  infoList[item.name] ? infoList[item.name].num4 : 0
                }}</strong>
                个
              </div>
            </div>
            <div class="data-item">
              <img :src="item.imgUrl1" />
              <div class="label">领用数量</div>
              <div class="value1">
                <strong :title="infoList[item.name] ? infoList[item.name].num1 : 0">{{
                  infoList[item.name] ? infoList[item.name].num1 : 0
                }}</strong>
                个
              </div>
            </div>
            <div class="data-item">
              <img :src="item.imgUrl2" />
              <div class="label">在用数量</div>
              <div class="value1">
                <strong :title="infoList[item.name] ? infoList[item.name].num2 : 0">{{
                  infoList[item.name] ? infoList[item.name].num2 : 0
                }}</strong>
                个
              </div>
            </div>
            <div class="data-item">
              <img :src="item.imgUrl3" />
              <div class="label">使用率</div>
              <div class="value1">
                <strong :title="infoList[item.name] ? infoList[item.name].num3 : 0">{{
                  infoList[item.name] ? infoList[item.name].num3 : 0
                }}</strong>
                %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!pageFlag" class="form-table">
      <!-- 各单位质量情况表格 -->
      <div class="table-container">
        <div class="table-name">
          <div class="title-name">工器具使用情况</div>
          <el-button
            class="el-btn-new reset-btn"
            size="small"
            :disabled="loadingTable"
            @click="newExportClick"
          >
            <i class="iconfont icon-daochu1"></i>
            导出
          </el-button>
        </div>
        <div v-loading="loadingTable" class="table-box">
          <personTable
            :table-data="tableData"
            :columns="columns"
            :is-page="pageFlag"
            :table-count="tableCount"
            :page-index="pageIndex"
            :page-size="pageSize"
            @sizeChange="sizeChange"
            @pageChange="pageChange"
          ></personTable>
        </div>
      </div>
    </div>
    <!-- tab查询表单和表格 -->
    <el-header v-show="pageFlag" class="device-table-container">
      <!-- Tab 切换 -->
      <div class="list-style">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="掌机" name="palm"></el-tab-pane>
          <el-tab-pane label="背夹" name="backpack"></el-tab-pane>
          <el-tab-pane label="现场校验仪" name="calibrator"></el-tab-pane>
          <el-tab-pane label="供电服务记录仪" name="powerMeter"></el-tab-pane>
        </el-tabs>
        <el-button
          class="el-btn-new reset-btn"
          size="small"
          :disabled="loadingObj[this.activeTab]"
          @click="newExportClick"
        >
          <i class="iconfont icon-daochu1"></i>
          导出
        </el-button>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <div class="table-box">
          <el-table
            v-if="tableData.length"
            :key="tableKey"
            v-loading="loadingObj[activeTab]"
            :data="tableData"
            border
            stripe
            :height="'100%'"
          >
            <el-table-column type="index" label="序号" width="80" align="center">
              <span slot-scope="{ $index }">{{
                (pageInfo.currentPage - 1) * pageInfo.pageSize + $index + 1
              }}</span>
            </el-table-column>
            <!-- 动态列 -->
            <el-table-column
              v-for="(col, index) in tableColumns"
              :key="index"
              :prop="col.prop"
              :label="col.label"
              :min-width="col.width"
              align="center"
            >
              <template #default="{ row }">
                {{ row[col.prop] }}
              </template>
            </el-table-column>
          </el-table>

          <nullData v-else v-loading="loadingObj[activeTab]" />
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            :current-page="pageInfo.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageInfo.pageSize"
            layout="total, prev, pager, next, sizes, jumper"
            background
            :total="pageInfo.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>

      <!-- 导出按钮 -->
      <!-- <div class="export-btn">
          <el-button type="text" size="small" @click="exportData">
            <i class="el-icon-download"></i> 导出
          </el-button>
        </div> -->
    </el-header>
  </el-container>
</template>

<script>
import {
  getDeviceInfoList,
  getMeterUsedRate,
  getOrgMeterUsedRate,
  getHandPhoneList,
  getRepeaterList,
  getCheckMeter,
  getServiceRecorder,
  baseDictList,
} from '@/api/hierarchicalControl/productionFactorsMore.js';
import personTable from './personTable.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import { useUnitData } from '@/composables/useUnitData.js';
export default {
  name: 'DeviceHeader',
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
      manufacturerList: [], //生产厂商
      infoArr: [
        {
          name: '掌机',
          imgUrl: require('@/assets/iconfont/icon/生产要素-工器具1.png'),
          imgUrl1: require('@/assets/iconfont/icon/生产要素-工器具2.png'),
          imgUrl2: require('@/assets/iconfont/icon/生产要素-工器具3.png'),
          imgUrl3: require('@/assets/iconfont/icon/生产要素-工器具4.png'),
        },
        {
          name: '背夹',
          imgUrl: require('@/assets/iconfont/icon/生产要素-工器具5.png'),
          imgUrl1: require('@/assets/iconfont/icon/生产要素-工器具6.png'),
          imgUrl2: require('@/assets/iconfont/icon/生产要素-工器具7.png'),
          imgUrl3: require('@/assets/iconfont/icon/生产要素-工器具8.png'),
        },
        {
          name: '现场校验仪',
          imgUrl: require('@/assets/iconfont/icon/生产要素-工器具9.png'),
          imgUrl1: require('@/assets/iconfont/icon/生产要素-工器具10.png'),
          imgUrl2: require('@/assets/iconfont/icon/生产要素-工器具11.png'),
          imgUrl3: require('@/assets/iconfont/icon/生产要素-工器具12.png'),
        },
        {
          name: '供电服务记录仪',
          imgUrl: require('@/assets/iconfont/icon/生产要素-工器具13.png'),
          imgUrl1: require('@/assets/iconfont/icon/生产要素-工器具14.png'),
          imgUrl2: require('@/assets/iconfont/icon/生产要素-工器具15.png'),
          imgUrl3: require('@/assets/iconfont/icon/生产要素-工器具16.png'),
        },
      ], //设备信息
      loadingInfo: false,
      //设备信息数据对象
      infoList: {},
      tableKey: 0,
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      // 可以在这里添加动态数据
      searchData: { orgNo: this.orgNo, dateTime: [] },
      searchDatas: { orgNo: this.orgNo, dateTime: [] },
      tableData: [],
      loadingTable: false,
      columns: [
        {
          prop: 'orgName',
          label: '单位',
        },
        {
          prop: 'wq',
          label: '掌机(个)',
          children: [
            {
              prop: 'handleInUseCount',
              label: '在使用量',
            },
            {
              prop: 'handleUsageRate',
              label: '使用率',
              classStyle: 'color-red',
              unit: '%',
            },
          ],
        },
        {
          prop: 'wq1',
          label: '背夹(个)',
          children: [
            {
              prop: 'clipInUseCount',
              label: '在使用量',
            },
            {
              prop: 'clipUsageRate',
              label: '使用率',
              classStyle: 'color-red',
              unit: '%',
            },
          ],
        },
        {
          prop: 'wq2',
          label: '现场校验仪(个)',
          children: [
            {
              prop: 'checkInUseCount',
              label: '在使用量',
            },
            {
              prop: 'checkUsageRate',
              label: '使用率',
              classStyle: 'color-red',
              unit: '%',
            },
          ],
        },
        {
          prop: 'wq3',
          label: '供电服务记录仪(个)',
          children: [
            {
              prop: 'serviceInUseCount',
              label: '在使用量',
            },
            {
              prop: 'serviceUsageRate',
              label: '使用率',
              classStyle: 'color-red',
              unit: '%',
            },
          ],
        },
      ],
      tabActive: 'palm', // 默认选中掌机
      activeTab: 'palm', // 默认选中掌机
      queryParamss: {
        manageUser: '',
        devStatus: '',
        manufacturer: '',
        // createTime: [],
        createUser: '',
        assetNo: '',
        // requestTime: [],
      },
      queryParams: {
        manageUser: '',
        devStatus: '',
        manufacturer: '',
        // createTime: [],
        createUser: '',
        assetNo: '',
        // requestTime: [],
      },
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // tableData: [],
      tableColumns: [
        { prop: 'assetNo', label: '资产编号', width: '220px' },
        { prop: 'imeiNo', label: 'IMEI号', width: '200px' },
        { prop: 'devStatusName', label: '设备状态', width: '100px' },
        { prop: 'useRecordName', label: '启用状态', width: '100px' },
        { prop: 'manageUser', label: '保管人', width: '100px' },
        { prop: 'requestTime', label: '领用时间', width: '200px' },
        { prop: 'createUser', label: '建档人', width: '120px' },
        { prop: 'createTime', label: '建档时间', width: '200px' },
      ],
      loadingObj: {},
      tableHeight: 400,
      tabForms: {},
    };
  },

  activated() {},
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
      this.getInfoFn();
      if (this.pageFlag) {
        //本级
        this.getTableFn();
        this.manufacturerListFn();
      } else {
        //下级
        this.searchData.orgNo = this.orgNo;
        this.searchDatas.orgNo = this.orgNo;
        this.getOrgMeterUsedRateFn();
      }
    },
    //生产厂商下拉数据
    manufacturerListFn() {
      baseDictList({ sortCodes: 'BL_RECODER_MANUFACTURE' })
        .then((res) => {
          if (res.data.RT_F === 1) {
            this.manufacturerList = res.data.DTS.BL_RECODER_MANUFACTURE || [];
          } else {
            this.manufacturerList = [];
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.manufacturerList = [];
          this.loadingTable = false;
        });
    },
    //导出
    newExportClick() {
      if (!this.tableData.length) {
        return this.$message.error('暂无数据可以导出!');
      }
      this.exportClick();
    },
    exportClick() {
      let exportClickparams = {},
        url = null;
      if (this.pageFlag) {
        //本级
        url =
          this.activeTab === 'palm'
            ? '/safemanage-evaluation/productionFactor/exportDeviceHandSetList'
            : this.activeTab === 'backpack'
              ? '/safemanage-evaluation/productionFactor/exportDeviceClipList'
              : this.activeTab === 'calibrator'
                ? '/safemanage-evaluation/productionFactor/exportDeviceFieldCalibratorList'
                : '/safemanage-evaluation/productionFactor/exportDeviceRecoderList';
        exportClickparams = {
          ...this.queryParamss,
          pageNum: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize,
          orgNo: this.orgNo,
        };
      } else {
        //下级
        exportClickparams = {
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
          orgNo: this.searchDatas.orgNo,
        };
        url = '/safemanage-evaluation/productionFactorSub/orgMeterUsedRateExport';
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
    // 设备信息
    getInfoFn() {
      //true为本级，false为下级
      let url = this.pageFlag ? getDeviceInfoList : getMeterUsedRate;
      this.loadingInfo = true;
      let exportClickparams = {};
      if (this.pageFlag) {
        //本级
        exportClickparams = {
          ...this.queryParamss,
          pageNum: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize,
          orgNo: this.orgNo,
        };
      } else {
        //下级
        exportClickparams = {
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
          orgNo: this.searchDatas.orgNo,
        };
      }
      url(exportClickparams)
        .then((res) => {
          this.loadingInfo = false;
          if (res.data.RT_F === 1) {
            let arr = res.data.DTS || [],
              obj = {};
            arr.forEach((item) => {
              if (this.pageFlag) {
                item.deviceName = item.deviceName.indexOf('掌机') !== -1 ? '掌机' : item.deviceName;
                obj[item.deviceName] = {
                  num1: item.requestQty || 0, //领用数量
                  num2: item.usageQty || 0, //在用数量
                  num3: item.usageRate || 0, //使用率
                  num4: item.totalQty || 0, //总数
                };
              } else {
                item.meterName = item.meterName.indexOf('掌机') !== -1 ? '掌机' : item.meterName;
                obj[item.meterName] = {
                  num1: item.receivedCount || 0, //领用数量
                  num2: item.inUseCount || 0, //在用数量
                  num3: item.usageRate || 0, //使用率
                  num4: item.totalCount || 0, //总数
                };
              }
            });
            this.infoList = { ...obj };
          } else {
            this.infoList = {};
          }
        })
        .catch(() => {
          this.loadingInfo = false;
          this.infoList = {};
        });
    },
    //工器具使用情况-下级
    getOrgMeterUsedRateFn() {
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
        orgNo: this.searchDatas.orgNo,
      };
      this.loadingTable = true;
      getOrgMeterUsedRate(params)
        .then((res) => {
          this.loadingTable = false;
          if (res.data.RT_F === 1) {
            this.tableData = res.data.DTS || [];
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
    //下级-重置按钮
    refresh() {
      this.searchData = this.$options.data.call(this).searchData;
      this.searchSubmit();
    },
    //下级-查询按钮
    searchSubmit() {
      this.searchDatas = { ...this.searchData };
      this.getInfoFn();
      this.getOrgMeterUsedRateFn();
    },
    //本级获取表格数据
    getTableFn() {
      let url =
        this.activeTab === 'palm'
          ? getHandPhoneList
          : this.activeTab === 'backpack'
            ? getRepeaterList
            : this.activeTab === 'calibrator'
              ? getCheckMeter
              : getServiceRecorder;
      let params = {
        ...this.queryParamss,
        pageNum: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize,
        orgNo: this.orgNo,
      };
      this.loadingObj[this.activeTab] = true;
      url(params)
        .then((res) => {
          this.loadingObj[this.activeTab] = false;
          if (res.data.RT_F === 1) {
            this.tableData = res.data.DTS.list || [];
            this.pageInfo.total = res.data.DTS.total;
          } else {
            this.tableData = [];
            this.pageInfo.total = 0;
            this.$message({
              type: 'error',
              message: res.data.RT_D,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.pageInfo.total = 0;
          this.tableData = [];
          this.loadingObj[this.activeTab] = false;
        });
    },
    sizeChange() {},
    pageChange() {},
    //本级-切换表格
    handleTabClick(tab, e) {
      if (tab.name === this.tabActive) return;
      this.tabForms[this.tabActive] = {
        queryParams: { ...this.queryParams },
        pageInfo: { ...this.pageInfo },
        tableData: this.tableData,
      };
      this.tabActive = tab.name;
      if (!this.tabForms[tab.name]) {
        this.queryParams = this.$options.data.call(this).queryParams;
        this.handleSearch();
      } else {
        this.queryParams = this.tabForms[tab.name].queryParams;
        this.pageInfo = { ...this.tabForms[tab.name].pageInfo };
        this.tableData = this.tabForms[tab.name].tableData;
      }
      this.tableKey++;
      this.loadTableData();
      console.log(this.loadingObj);
    },

    //本级-切换表格
    loadTableData() {
      // 根据当前 tab 动态调整表头和数据
      if (this.activeTab === 'palm') {
        this.tableColumns = [
          { prop: 'assetNo', label: '资产编号', width: '220px' },
          { prop: 'imeiNo', label: 'IMEI号', width: '200px' },
          { prop: 'devStatusName', label: '设备状态', width: '100px' },
          { prop: 'useRecordName', label: '启用状态', width: '100px' },
          { prop: 'manageUser', label: '保管人', width: '100px' },
          { prop: 'requestTime', label: '领用时间', width: '200px' },
          { prop: 'createUser', label: '建档人', width: '120px' },
          { prop: 'createTime', label: '建档时间', width: '200px' },
        ];
      } else if (this.activeTab === 'backpack') {
        this.tableColumns = [
          { prop: 'assetNo', label: '资产编号', width: '220px' },
          { prop: 'devMac', label: 'MAC地址', width: '200px' },
          { prop: 'devStatusName', label: '设备状态', width: '100px' },
          { prop: 'useRecordName', label: '启用状态', width: '100px' },
          { prop: 'manageUser', label: '保管人', width: '100px' },
          { prop: 'requestTime', label: '领用时间', width: '200px' },
          { prop: 'createUser', label: '建档人', width: '120px' },
          { prop: 'createTime', label: '建档时间', width: '200px' },
        ];
      } else if (this.activeTab === 'calibrator') {
        this.tableColumns = [
          { prop: 'assetNo', label: '资产编号' },
          { prop: 'deviceTypeName', label: '设备类型' },
          { prop: 'protocolVersionName', label: '协议版本' },
          { prop: 'communicateTypeName', label: '通信类型' },
          { prop: 'manufacturer', label: '生产厂商' },
          { prop: 'equipmentType', label: '型号' },
          { prop: 'certValidityDate', label: '证书有效期' },
          { prop: 'devStatusName', label: '设备状态' },
        ];
      } else if (this.activeTab === 'powerMeter') {
        this.tableColumns = [
          { prop: 'assetNo', label: '资产编号' },
          { prop: 'devName', label: '产品序列号' },
          { prop: 'deviceTypeName', label: '设备类型' },
          { prop: 'manufacturerName', label: '生产厂商' },
          { prop: 'devStatusName', label: '设备状态' },
          { prop: 'manageUser', label: '保管人' },
          { prop: 'createTime', label: '建档时间' },
          { prop: 'createUser', label: '建档人' },
        ];
      }
    },

    //本级-查询按钮
    handleSearch() {
      this.queryParamss = { ...this.queryParams };
      this.pageInfo.currentPage = 1;
      this.getInfoFn();
      this.getTableFn();
    },

    //本级-重置按钮
    resetForm() {
      // 清空当前 tab 的查询条件
      this.$nextTick(() => {
        this.queryParams = this.$options.data.call(this).queryParams;
      });
    },

    //本级-分页
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.pageInfo.currentPage = 1;
      this.getTableFn();
    },

    //本级-分页
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getTableFn();
    },

    exportData() {
      alert('导出功能暂未实现');
    },
  },
};
</script>

<style scoped lang="scss">
@import './style.scss';
.new-safeweb-web {
  .form-table {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background: #fff;
    padding-bottom: 20px;
    .table-container {
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
  }
}
.flex-wrap {
  display: flex;
  border-bottom: 1px solid #e9ebef;
  .flex-row-end {
    flex: 1;
    margin-bottom: 20px;
  }
}
.device-table-container {
  background: #fff;
  border: 4px;
  flex-direction: column;
  display: flex;
  .table-container {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
  }
}
.list-style {
  /* display: flex;
  justify-content: space-around; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
  .el-button {
    border: 2px dashed #dee0e6;
  }
}
:deep(.el-tabs__item) {
  width: auto !important;
}
.search-form {
  padding: 20px 10px 0 0;
  border-bottom: 1px solid #e9ebef;
  background: #fff;
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .item-btn {
      flex: 1;
      text-align: right;
      white-space: nowrap;
    }
  }
}

.table-container {
  /* margin-top: 10px;
  border: 1px dashed #e6e6e6;
  border-radius: 4px;
  overflow: hidden; */

  background: white;
  padding: 0px;
  /* margin-bottom: 60px; */
}

.pagination {
  text-align: right;
  margin: 15px 0;
}

.export-btn {
  text-align: right;
  margin: 10px 0;
}
.card-all {
  padding: 0 20px;
  border-radius: 0 0 4px 4px;
  margin-bottom: 20px;
  background: white;
  .device-header {
    display: flex;
    overflow: auto;
    gap: 0px;
    padding-bottom: 20px;
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  }
}

.card {
  display: flex;
  align-items: center;
  text-align: center;
  flex: 1;
  height: 124px;
  /* background: linear-gradient(135deg, #e6f7ff, #b3f5e8); */
  border: 2px dashed #ccc;
  box-sizing: border-box;
  border-radius: 8px;
  text-align: center;
  &:not(:last-child) {
    margin-right: 20px;
  }
  .card-left {
    padding: 0 30px;
    border-right: 1px solid #d8d8d8;
    margin-right: 20px;
  }
}
.card1 {
  background-color: rgba(72, 177, 182, 0.12);
}
.card2 {
  background-color: rgba(99, 149, 250, 0.12);
}
.card3 {
  background-color: rgba(81, 209, 255, 0.12);
}
.card4 {
  background-color: rgba(72, 177, 182, 0.12);
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 130px;
  height: 60px;
  margin: 0 0 8px 0;
}

.icon-wrapper img {
  /* width: 100%;
  height: 100%; */
  /* object-fit: cover; */
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #426170;
}

.data-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
  margin-right: 20px;
}

.data-item {
  /* padding: 10px 0;
  border-bottom: 1px dashed #e6e6e6; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.label {
  font-size: 16px;
  color: #3d3d3d;
  white-space: nowrap;
  margin: 8px 0;
}

.value1 {
  font-size: 14px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  strong {
    font-size: 24px;
    font-weight: bold;
    color: #029b82;
  }
}
.value2 {
  font-size: 14px;
  color: #666666;
  strong {
    font-size: 24px;
    font-weight: bold;
    color: #6395fa;
  }
}
.value3 {
  font-size: 14px;
  color: #666666;
  strong {
    font-size: 24px;
    font-weight: bold;
    color: #51d1ff;
  }
}
.value4 {
  font-size: 14px;
  color: #666666;
  strong {
    font-size: 24px;
    font-weight: bold;
    color: #09c291;
  }
}
</style>
