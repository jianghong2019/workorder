<template>
  <el-dialog
    append-to-body
    title="批量性故障工单列表"
    :visible.sync="showDialog"
    @close="formReset"
  >
    <el-form ref="searchData" :model="searchData" label-position="right" label-width="100px">
      <div class="form">
        <el-form-item label="工单编号" class="form-item">
          <el-input
            v-model="searchData.appNo"
            class="input"
            size="small"
            placeholder="请输入"
            name="searchData.appNo"
            auto-complete="on"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="工单类型" class="form-item">
          <el-select
            v-model="searchData.businessCode"
            class="input"
            size="small"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in proStatusList"
              :key="index"
              :label="item.codeName"
              :value="item.codeValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人" class="form-item">
          <el-input
            v-model="searchData.operatorNo"
            class="input"
            size="small"
            placeholder="请输入"
            name="searchData.operatorNo"
            auto-complete="on"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="工单状态" class="form-item">
          <el-select
            v-model="searchData.workStatus"
            class="input"
            size="small"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in workStatusList"
              :key="index"
              :label="item.NAME"
              :value="item.VALUE"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="flex-row-end form-btn">
          <el-button class="search" plain size="small" @click="formReset">重 置</el-button>
          <el-button class="search" type="primary" plain size="small" @click="formSubmit"
            >查 询</el-button
          >
        </div>
      </div>
      <!-- <div class="flex-row-end form-btn">
        <el-button plain @click="formReset" size="small">重 置</el-button>
        <el-button type="primary" plain @click="formSubmit" size="small"
          >查 询</el-button
        >
      </div> -->
    </el-form>
    <!-- <div class="content-text">工单列表</div> -->
    <!-- 计划管理查询表单end -->
    <!-- </el-header> -->
    <div v-loading="tableLoading" class="box-shadow-normal table-wrap">
      <el-table ref="multipleTable" :key="tableKey" :data="tableData" stripe border height="300">
        <!-- <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column> -->
        <el-table-column type="index" label="序号" width="80" align="center" fixed="left">
          <span slot-scope="{ $index }">{{ (pageIndex - 1) * pageSize + $index + 1 }}</span>
        </el-table-column>
        <template v-for="item in tableList">
          <!-- 有视频添加视频的图标 end   张前  2022-06-01 -->
          <template>
            <el-table-column
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </template>

        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <template v-for="button in getActionButtons">
                <el-button
                  :key="button.label"
                  type="text"
                  size="small"
                  @click.stop="gorouter(scope.row)"
                  >{{ button.label }}</el-button
                >
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <nullData /> -->
    </div>
    <el-pagination
      class="cardbox manage-main-pagination"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="pageSize"
      :current-page.sync="pageIndex"
      layout="total, prev, pager, next, sizes, jumper"
      background
      :total="tableCount"
      @size-change="sizeChange"
      @current-change="pageChange"
    >
    </el-pagination>
    <!-- iframe弹窗组件 -->
    <iframe-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :src="currentSrc"
      :iframe-title="iframeTitle"
      :comp-id="compId"
      @close="closeDialog"
      @child-submitted="handleChildSubmit"
    />
  </el-dialog>
</template>

<script>
import API from '@/api/hierarchicalControl/firstlevel.js';
import API1 from '@/api/hierarchicalControl/workReminder.js';
// import API1 from "@/api/hierarchicalControl/firstlevel.js";
// src\components\pages\hierarchicalControl\workReminder\components\iframeDialog.vue
import iframeDialog from '@/pages/hierarchicalControl/workReminder/components/iframeDialog.vue';
export default {
  name: 'WorkOrderHangUpConfigEdit',
  components: {
    iframeDialog,
  },
  //   props: {
  //     showDialog: {
  //       type: Boolean,
  //       default: false
  //     },
  //   },
  data() {
    return {
      tableLoading: false,
      showDialog: false,
      tableKey: Math.random() + new Date().getTime(),
      searchData: {
        appNo: '', //工单编码
        businessCode: '', //工单类型
        operatorNo: '', // 处理人
        dateRange: '',
        workStatus: '', //工单状态
      },
      workStatusList: [
        {
          NAME: '待派工',
          VALUE: '01',
        },
        {
          NAME: '待处理',
          VALUE: '02',
        },
        {
          NAME: '已完成',
          VALUE: '03',
        },
      ],
      proStatusList: [
        {
          codeName: '未处理',
          codeValue: '01',
        },
        {
          codeName: '已归档',
          codeValue: '02',
        },
      ],
      tableData: [
        // {
        //   workOrderNo: "D001",
        //   operatorName: "江苏科技有限公司",
        //   createTime: "1",
        // },
      ],
      tableList: [
        { label: '工单编号', prop: 'workOrderNo', RECORD_ID: 'a', width: '' },
        { label: '工单类型', prop: 'businessType', RECORD_ID: 'b', width: '' },
        {
          label: '工单子类型',
          prop: 'businessSubType',
          RECORD_ID: 'c',
          width: '',
        },
        {
          label: '实际处理人',
          prop: 'operatorName',
          RECORD_ID: 'd',
          width: '',
        },
        {
          label: '工单状态',
          prop: 'workOrderStatus',
          RECORD_ID: 'e',
          width: '',
        },
        { label: '生成时间', prop: 'createTime', RECORD_ID: 'f', width: '' },
      ],
      getActionButtons: [{ label: '详情', prop: 'detial' }],
      pageIndex: 1,
      pageSize: 10,
      tableCount: 0,
      // 表格参数
      businessCode: '',
      dateRange: '',
      endDate: '',
      indicatorType: '',
      offset: 0,
      operatorNo: '',
      orgNo: '',
      // orgNos: [],
      pageIndex: 1,
      pageSize: 10,
      startDate: '',
      dateRange: '',

      dialogVisible: false, // iframe弹窗显示状态
      token: '',
      iframeUrl: '',
      orderNo: '',
      compId: '',
      iframeTitle: '',
    };
  },
  computed: {
    // 页面ip
    pageIp() {
      return this.$store.state.config_fileUrl ?? '';
    },
    // 采集iframeURL
    currentSrc() {
      return `${this.iframeUrl}?workOrderNo=${this.orderNo}&token=${this.token}&compId=${this.compId}`;
    },
  },
  mounted() {},
  methods: {
    sizeChange(val) {
      //pagesize 每页多少条
      this.pageSize = val;
      this.pageIndex = 1;
      this.adminlist();
    },
    pageChange(val) {
      // 当前第几页
      this.pageIndex = val;
      this.adminlist();
    },
    opan(orgNo, dateRange) {
      this.orgNo = orgNo;
      this.dateRange = dateRange;
      this.showDialog = true;
      this.tableKey = Math.random() + new Date().getTime();
      this.adminlist();
      this.getOrderTypes();
    },
    formSubmit() {
      this.pageIndex = 1;
      this.adminlist();
    },
    // 查询接口
    async adminlist() {
      this.tableLoading = true;
      // console.log(11,this.searchData);
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        appNo: this.searchData.appNo, //工单编码
        businessCode: this.searchData.businessCode, //工单类型
        operatorNo: this.searchData.operatorNo, // 处理人
        workStatus: this.searchData.workStatus, //工单状态
        orgNo: this.orgNo, //单位编码
        dateRange: this.dateRange,
      };
      let res = await API.adminlist(params).finally(() => (this.tableLoading = false));
      // console.log(11111, res.data);
      // this.tableData = res.data
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.tableData = DTS.data;
        this.pageIndex = DTS.pageIndex;
        this.pageSize = DTS.pageSize;
        this.tableCount = DTS.totalCount;
      } else {
        this.$message.error(RT_D);
      }
    },
    //重置按钮
    formReset() {
      (this.searchData.appNo = ''), //工单编码
        (this.searchData.businessCode = ''), //工单类型
        (this.searchData.operatorNo = ''), // 处理人
        (this.searchData.workStatus = ''), //工单状态
        (this.pageSize = this.pageSize); //每页多少条
      this.pageIndex = this.pageIndex; //当前第几页
      // 重新调接口
      this.adminlist();
    },
    // 获取工单类型下拉数据
    async getOrderTypes() {
      const res = await API.getOrderTree({});
      let one = res.data.DTS[0].childList;
      let two = res.data.DTS[1].childList;
      let thers = res.data.DTS[2].childList;
      let four = res.data.DTS[3].childList;
      this.proStatusList = [...one, ...two, ...thers, ...four];
    },
    //路由跳转并携带参数
    gorouter(rowData) {
      // this.$router.push({ path: routers[id], query: params });
      this.compId = 'ORDER_DETAIL';
      this.orderNo = rowData.workOrderNo;
      this.iframeTitle = rowData.businessType;
      let params = {
        redirectUrl: this.pageIp,
        urlName: 'ORDER_DETAIL',
      };
      API1.getAcqSysCommonAuthorize(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.token = DTS.token;
          this.iframeUrl = DTS.url;
          this.dialogVisible = true;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // iframe弹窗关闭
    closeDialog() {
      this.dialogVisible = false;
    },

    close() {
      //   this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  width: 1000px;
}
.form {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 10px;
  .form-item {
    width: 30%;
    margin-bottom: 15px;
    ::v-deep .el-form-item__label {
      // max-width: none !important;
      font-size: 14px;
      font-weight: 400;
      color: #2a2c2f;
    }
    .input {
      width: 100%;
    }
  }
}
.form-btn {
  margin-right: 10px;
}
.content-text {
  margin: 15px 0;
  font-weight: 350;
  color: #333333;
}
.box-shadow-normal {
  margin-top: 15px;
  height: 300px;
  //   .tableData {
  //     min-height: 300px;
  //     width: 100%;
  ::v-deep .cell {
    font-weight: 700;
  }
  ::v-deep .el-tooltip {
    font-weight: 400;
  }
  //   }
}
.manage-main-pagination {
  padding-top: 15px;
  font-size: 14px;
  font-weight: 400;
  color: #2a2b2f !important;
}
.search {
  height: 30px;
}
</style>
