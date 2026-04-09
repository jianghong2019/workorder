<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="`${tableTitle}预警列表`"
      class="addWorkStyle"
      :visible.sync="showDialogNew"
      :destroy-on-close="false"
      width="65%"
      @close="close"
    >
      <!-- 数据模块 -->
      <!-- <div class="dialog-content" v-if="dialogType == '01'">
        <div
          v-for="item in boxs"
          class="box"
          :style="`background-color: ${colors[item.type]}; width: ${
            tableTitle == '质效' || tableTitle == '风险' ? '30' : '20'
          }%`"
        >
          <div class="img">
            <img :src="imgs[item.type]" alt="" />
          </div>
          <div class="text">
            <div>
              <span class="num"> {{ item.value }} </span>
              <span>
                {{
                  tableTitle == "作业超时" || tableTitle == "工单超期"
                    ? "工单"
                    : "人"
                }}
              </span>
            </div>
            <div>
              {{ item.title }}
            </div>
          </div>
        </div>
      </div> -->
      <div>
        <el-form
          id="searchData"
          ref="searchData"
          :model="searchData"
          label-position="right"
          label-width="100px"
          class="searchData search_input"
          action="http://"
          target="stop"
        >
          <div class="flex-row-bw flex-wrap">
            <el-form-item v-if="tableTitle == '物资'" label="物资类型" class="form-item-new">
              <el-select v-model="searchData.supplie" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in suppliesType"
                  :key="index"
                  :label="item.codeName"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="tableTitle == '工器具'" label="工器具类型" class="form-item-new">
              <el-select v-model="searchData.device" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in deviceType"
                  :key="index"
                  :label="item.codeName"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="dialogType == '01'" label="姓名" class="form-item-new">
              <el-select v-model="searchData.personName" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in personInfo"
                  :key="index"
                  :label="item.personName"
                  :value="item.propertyId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="tableTitle == '作业超时' || tableTitle == '工单超期'"
              label="工单编号"
              class="form-item-new"
            >
              <el-input
                v-model="searchData.orderNo"
                class="input-box"
                placeholder="请输入"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="tableTitle == '作业超时' || tableTitle == '工单超期'"
              label="工单类型"
              class="form-item-new form-item"
            >
              <el-select
                v-model="searchData.orderType"
                filterable
                multiple
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in orderTypes"
                  :key="index"
                  :label="item.codeName"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="tableTitle == '工单超期'"
              label="工单状态"
              class="form-item-new form-item"
            >
              <el-select v-model="searchData.orderStatus" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in orderStatus"
                  :key="index"
                  :label="item.codeName"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预警状态" class="form-item-new form-item">
              <el-select v-model="searchData.professional" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in professionals"
                  :key="index"
                  :label="item.codeName"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="dialogType == '01'"
              label="预警程度"
              class="form-item-new form-item"
            >
              <el-select v-model="searchData.warningDegree" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in warningDegrees"
                  :key="index"
                  :label="item.codeName"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="预警开始时间"
              prop="dateTime"
              class="date-box form-item-new form-item"
            >
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
            </el-form-item>
            <div
              class="flex-row-end search-buttons"
              :class="
                (dialogType == '02' && tableTitle != '车辆') || tableTitle == '作业超时'
                  ? 'form-item-btn100'
                  : 'form-item-btn30'
              "
            >
              <el-button class="el-btn-new reset-btn" plain size="small" @click="refresh"
                >重 置</el-button
              >
              <el-button
                class="el-btn-new search-btn"
                type="primary"
                plain
                size="small"
                @click="searchSubmit"
                >查 询
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
      <!-- 列表模块 -->
      <el-main class="cardbox-pd0 pb-20 manage-main">
        <div class="box-shadow-normal table-wrap">
          <el-table
            v-if="tableData.length"
            ref="multipleTable"
            border
            :data="tableData"
            header-cell-class-name="table-header"
            height="40vh"
            style="width: 100%"
          >
            <template v-for="item in tableList">
              <!-- :key="item.RECORD_ID" 后续获取唯一添加-->
              <el-table-column
                v-if="item.prop == 'orderNo'"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
              >
                <template slot-scope="scope">
                  <div class="green" @click="openOrder(scope.row)">
                    {{ scope.row[item.prop] }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="rangMaps.includes(item.prop)"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
              >
                <template slot-scope="scope">
                  <div>
                    {{ `${scope.row[item.prop] ? scope.row[item.prop] : 0}%` }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.prop == 'warningDegree'"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row[item.prop] == '01'" class="yellow tabBtn">
                    <img src="@/assets/images/hierarchicalControl/warnDialogTable1.png" alt="" />
                    黄色预警
                  </div>
                  <div v-else-if="scope.row[item.prop] == '02'" class="orange tabBtn">
                    <img src="@/assets/images/hierarchicalControl/warnDialogTable2.png" alt="" />
                    橙色预警
                  </div>
                  <div v-else class="red tabBtn">
                    <img src="@/assets/images/hierarchicalControl/warnDialogTable3.png" alt="" />
                    红色预警
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
              >
              </el-table-column>
            </template>
          </el-table>
          <nullData v-else style="height: 40vh; weight: 100%" />
        </div>
        <el-pagination
          v-if="tableData.length"
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
      </el-main>
    </el-dialog>
  </div>
</template>

<script>
import OrgTree from '@/components/common/form/OrgTree.vue';
import nullData from '@/components/common/form/nullData.vue';
import API from '@/api/hierarchicalControl/warningStatistics.js';
export default {
  name: 'WarnDialog',
  components: {
    OrgTree,
    nullData,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 弹窗标题
    dialogTitle: {
      type: String,
      default: '',
    },
    // 类型(来源表格/标题)
    dialogType: {
      type: String,
      default: '',
    },
    // 页面单位ID
    orgId: {
      type: String,
      default: '',
    },
    // 人员id
    userId: {
      type: Number,
      default: null,
    },
  },
  data() {
    this.rangMaps = ['finishRate', 'timelyRate', 'standardRate', 'overdueRateStr', 'useRate'];
    // 表头合集
    this.tableList1 = [
      {
        prop: 'personName',
        label: '姓名',
        width: '90px',
      },
      {
        prop: 'finishRate',
        label: '工单完成率',
        width: '130px',
      },
      {
        prop: 'timelyRate',
        label: '工单及时率',
        width: '130px',
      },
      {
        prop: 'standardRate',
        label: '工单规范率',
        width: '130px',
      },
      {
        prop: 'indicator',
        label: '综合质效指标值',
        width: '150px',
      },
      {
        prop: 'warningRule',
        label: '预警规则',
        width: '100px',
      },
      {
        prop: 'warningDegree',
        label: '预警程度',
        width: '140px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '140px',
      },
      {
        prop: 'warningEndDate',
        label: '预警结束时间',
        width: '140px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '100px',
      },
    ];
    this.tableList2 = [
      {
        prop: 'personName',
        label: '姓名',
        width: '90px',
      },
      {
        prop: 'orderNum',
        label: '工单总数',
        width: '130px',
      },
      {
        prop: 'totalHours',
        label: '预计总工时(h)',
        width: '130px',
      },
      {
        prop: 'standardHours',
        label: '标准工时(h)',
        width: '130px',
      },
      {
        prop: 'warningRule',
        label: '预警规则',
        width: '100px',
      },
      {
        prop: 'warningDegree',
        label: '预警程度',
        width: '140px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '140px',
      },
      {
        prop: 'warningEndDate',
        label: '预警结束时间',
        width: '140px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '100px',
      },
    ];
    this.tableList3 = [
      {
        prop: 'personName',
        label: '姓名',
        width: '200px',
      },
      {
        prop: 'riskNum',
        label: '风险发生次数',
        width: '210px',
      },
      {
        prop: 'warningRule',
        label: '预警规则',
        width: '210px',
      },
      {
        prop: 'warningDegree',
        label: '预警程度',
        width: '140px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '240px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '200px',
      },
    ];
    this.tableList4 = [
      {
        prop: 'operatorName',
        label: '姓名',
        width: '90px',
      },
      {
        prop: 'appNo',
        label: '工单编号',
        width: '150px',
      },
      {
        prop: 'workTypeName',
        label: '工单类型',
        width: '100px',
      },
      {
        prop: 'workTypeSubName',
        label: '工单子类型',
        width: '120px',
      },
      {
        prop: 'workStatus',
        label: '工单状态',
        width: '100px',
      },
      {
        prop: 'insertTime',
        label: '工单生成时间',
        width: '140px',
      },
      {
        prop: 'deadlineTime',
        label: '要求完成时间',
        width: '140px',
      },
      {
        prop: 'currentWorkTime',
        label: '已处理时长',
        width: '120px',
      },
      {
        prop: 'overdueRateStr',
        label: '超期比例',
        width: '100px',
      },
      {
        prop: 'warningDegree',
        label: '预警程度',
        width: '140px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '140px',
      },
      {
        prop: 'warningEndDate',
        label: '预警结束时间',
        width: '140px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '100px',
      },
    ];
    this.tableList5 = [
      {
        prop: 'personName',
        label: '姓名',
        width: '100px',
      },
      {
        prop: 'warningNum',
        label: '预警次数',
        width: '120px',
      },
      {
        prop: 'warningRule',
        label: '预警规则',
        width: '120px',
      },
      {
        prop: 'warningDegree',
        label: '预警程度',
        width: '140px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '180px',
      },
      {
        prop: 'warningEndDate',
        label: '预警结束时间',
        width: '180px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '100px',
      },
    ];
    this.tableList6 = [
      {
        prop: 'operatorName',
        label: '姓名',
        width: '90px',
      },
      {
        prop: 'appNo',
        label: '工单编号',
        width: '150px',
      },
      {
        prop: 'workTypeName',
        label: '工单类型',
        width: '100px',
      },
      {
        prop: 'workTypeSubName',
        label: '工单子类型',
        width: '120px',
      },
      {
        prop: 'beginProcessTime',
        label: '开工时间',
        width: '180px',
      },
      {
        prop: 'standardTime',
        label: '标准作业时间',
        width: '160px',
      },
      {
        prop: 'currentWorkTime',
        label: '当前作业时长',
        width: '160px',
      },
      {
        prop: 'overdueRateStr',
        label: '超期比例',
        width: '140px',
      },
      {
        prop: 'warningDegree',
        label: '预警程度',
        width: '140px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '180px',
      },
      {
        prop: 'warningEndDate',
        label: '预警结束时间',
        width: '180px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '100px',
      },
    ];
    this.tableList7 = [
      {
        prop: 'deviceName',
        label: '工器具类型',
        width: '120px',
      },
      {
        prop: 'receivedNum',
        label: '领用数量',
        width: '100px',
      },
      {
        prop: 'currentUseNum',
        label: '在用数量',
        width: '100px',
      },
      {
        prop: 'useRate',
        label: '使用率',
        width: '90px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '140px',
      },
      {
        prop: 'warningEndDate',
        label: '预警结束时间',
        width: '140px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '100px',
      },
    ];
    this.tableList8 = [
      {
        prop: 'typeName',
        label: '物资类型',
        width: '100px',
      },
      {
        prop: 'quantity',
        label: '库存量',
        width: '90px',
      },
      {
        prop: 'dayNeedNum',
        label: '日需求量',
        width: '100px',
      },
      {
        prop: 'keepDay',
        label: '预警天数',
        width: '100px',
      },
      {
        prop: 'maintainDay',
        label: '可持续天数',
        width: '120px',
      },
      {
        prop: 'warningStartDate',
        label: '预警开始时间',
        width: '140px',
      },
      {
        prop: 'warningEndDate',
        label: '预警结束时间',
        width: '140px',
      },
      {
        prop: 'warningStatusName',
        label: '预警状态',
        width: '100px',
      },
    ];
    return {
      showDialogNew: this.showDialog,
      tableTitle: this.dialogTitle,
      suppliesType: [], // 物资下拉数据
      deviceType: [], // 工器具下拉数据
      personInfo: [], // 姓名下拉数据
      orderTypes: [], // 工单类型下拉数据
      orderStatus: [], // 工单状态下拉数据
      professionals: [], // 预警状态下拉数据
      warningDegrees: [], // 预警程度下拉数据
      searchData: {
        // 查询条件合集
        supplie: '',
        device: '',
        personName: '',
        orderNo: '',
        orderType: [],
        orderStatus: '',
        professional: '01',
        warningDegree: '',
        dateTime: [],
      },
      tableData: [], // 表格数据
      tableList: [], // 表头数据
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      boxs: [], // 数据模块数据
      // imgs: {
      //   // 数据模块对应图片
      //   "01": require("@/assets/images/hierarchicalControl/warnDialog1.png"),
      //   "02": require("@/assets/images/hierarchicalControl/warnDialog2.png"),
      //   "03": require("@/assets/images/hierarchicalControl/warnDialog3.png"),
      //   "04": require("@/assets/images/hierarchicalControl/warnDialog4.png"),
      // },
      // colors: {
      //   // 数据模块对应背景色
      //   "01": "rgba(0, 155, 131, 0.1)",
      //   "02": "rgba(255, 189, 34, 0.1) ",
      //   "03": "rgba(252, 142, 50, 0.1)",
      //   "04": "rgba(254, 51, 51, 0.1)",
      // },
    };
  },
  computed: {
    newOrgId() {
      return this.orgId || this.$store.state.UserData.orgId;
    },
  },
  watch: {
    showDialog(newVal) {
      this.showDialogNew = newVal;
    },
  },
  mounted() {
    this.searchData.personName = this.userId;

    // 判断打开弹窗表格的表头数据
    if (this.dialogTitle === '质效') {
      this.tableList = this.tableList1;
    } else if (this.dialogTitle === '承载力') {
      this.tableList = this.tableList2;
    } else if (this.dialogTitle === '风险') {
      this.tableList = this.tableList3;
    } else if (this.dialogTitle === '工单超期') {
      this.tableList = this.tableList4;
    } else if (this.dialogTitle === '质量偏差') {
      this.tableList = this.tableList5;
    } else if (this.dialogTitle === '作业超时') {
      this.tableList = this.tableList6;
    } else if (this.dialogTitle === '工器具') {
      this.tableList = this.tableList7;
    } else if (this.dialogTitle === '物资') {
      this.tableList = this.tableList8;
    }
    this.getCondition();
    this.searchSubmit();
  },
  methods: {
    // 表格按钮功能
    openOrder() {},
    // 重置按钮
    refresh() {
      this.searchData = {
        supplie: '',
        device: '',
        personName: '',
        orderNo: '',
        orderType: [],
        orderStatus: '',
        professional: '01',
        warningDegree: '',
        dateTime: [],
      };
      this.pageIndex = 1;
      this.pageSize = 10;
      this.searchSubmit();
    },
    // 查询表格数据
    searchSubmit() {
      // 必传查询条件
      let params = {
        current: this.pageIndex,
        pageSize: this.pageSize,
        orgNo: this.newOrgId,
        warningStatus: this.searchData.professional,
        warningStartDate: this.searchData.dateTime?.[0] ?? '',
        warningEndDate: this.searchData.dateTime?.[1] ?? '',
      };
      // 判断不同的表格数据及数据模块数据
      if (this.dialogTitle === '质效') {
        let params1 = {
          ...params,
          propertyId: this.searchData.personName,
          warningDegree: this.searchData.warningDegree,
        };
        // let parasm2 = {
        //   orgNo: this.newOrgId
        // };
        this.getIndicatorWarningList(params1);
        // this.getIndexIndicatorWaring(parasm2);
      } else if (this.dialogTitle === '承载力') {
        let params1 = {
          ...params,
          propertyId: this.searchData.personName,
          warningDegree: this.searchData.warningDegree,
        };
        // let parasm2 = {
        //   orgNo: this.newOrgId
        // };
        this.getCapacityWarningList(params1);
        // this.getIndexCapacityWaring(parasm2);
      } else if (this.dialogTitle === '风险') {
        let params1 = {
          ...params,
          propertyId: this.searchData.personName,
          warningDegree: this.searchData.warningDegree,
        };
        // let parasm2 = {
        //   orgNo: this.newOrgId
        // };
        this.getRiskWarningList(params1);
        // this.getIndexRiskWaring(parasm2);
      } else if (this.dialogTitle === '工单超期') {
        let params1 = {
          ...params,
          propertyId: this.searchData.personName,
          appNo: this.searchData.orderNo,
          businessCode: this.searchData.orderType,
          workStatus: this.searchData.orderStatus,
          warningDegree: this.searchData.warningDegree,
        };
        // let parasm2 = {
        //   orgNo: this.newOrgId
        // };
        this.getOverdueWarningList(params1);
        // this.getIndexOrderOverdue(parasm2);
      } else if (this.dialogTitle === '质量偏差') {
        let params1 = {
          ...params,
          propertyId: this.searchData.personName,
          warningDegree: this.searchData.warningDegree,
        };
        // let parasm2 = {
        //   orgNo: this.newOrgId
        // };
        this.getQualityWarningList(params1);
        // this.getIndexQualityWarning(parasm2);
      } else if (this.dialogTitle === '作业超时') {
        let params1 = {
          ...params,
          propertyId: this.searchData.personName,
          appNo: this.searchData.orderNo,
          businessCode: this.searchData.orderType,
          warningDegree: this.searchData.warningDegree,
        };
        // let parasm2 = {
        //   orgNo: this.newOrgId
        // };
        this.getTimeOutWarningList(params1);
        // this.getIndexOrderOutTime(parasm2);
      } else if (this.dialogTitle === '工器具') {
        let params1 = {
          ...params,
          deviceType: this.searchData.device,
        };
        this.getDeviceWarningList(params1);
      } else if (this.dialogTitle === '物资') {
        let params1 = {
          ...params,
          suppliesType: this.searchData.supplie,
        };
        this.getSuppliesWarningList(params1);
      }
    },
    // 获取质效预警列表数据
    getIndicatorWarningList(params) {
      API.indicatorWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // getIndexIndicatorWaring(params) {
    //   API.indexIndicatorWaring(params).then((res) => {
    //     const { RT_F, RT_D, DTS } = res.data;
    //     if (RT_F == 1 && DTS) {
    //       this.boxs = [
    //         {
    //           value: DTS?.total ?? 0,
    //           type: "01",
    //           title: "预警总数",
    //         },
    //         {
    //           value: DTS?.data?.[1]?.waringNum ?? 0,
    //           type: "02",
    //           title: "黄色预警",
    //         },
    //         {
    //           value: DTS?.data?.[0]?.waringNum ?? 0,
    //           type: "04",
    //           title: "红色预警",
    //         },
    //       ];
    //     } else {
    //       this.$message.error(`${RT_D}`);
    //     }
    //   });
    // },
    // 获取承载力预警列表数据
    getCapacityWarningList(params) {
      API.capacityWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // getIndexCapacityWaring(params) {
    //   API.indexCapacityWaring(params).then((res) => {
    //     const { RT_F, RT_D, DTS } = res.data;
    //     if (RT_F == 1 && DTS) {
    //       this.boxs = [
    //         {
    //           value: DTS?.total ?? 0,
    //           type: "01",
    //           title: "预警总数",
    //         },
    //         {
    //           value: DTS?.data?.[2]?.waringNum ?? 0,
    //           type: "02",
    //           title: "黄色预警",
    //         },
    //         {
    //           value: DTS?.data?.[1]?.waringNum ?? 0,
    //           type: "03",
    //           title: "橙色预警",
    //         },
    //         {
    //           value: DTS?.data?.[0]?.waringNum ?? 0,
    //           type: "04",
    //           title: "红色预警",
    //         },
    //       ];
    //     } else {
    //       this.$message.error(`${RT_D}`);
    //     }
    //   });
    // },
    // 获取风险预警列表数据
    getRiskWarningList(params) {
      API.riskWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // getIndexRiskWaring(params) {
    //   API.indexRiskWaring(params).then((res) => {
    //     const { RT_F, RT_D, DTS } = res.data;
    //     if (RT_F == 1 && DTS) {
    //       this.boxs = [
    //         {
    //           value: DTS?.total ?? 0,
    //           type: "01",
    //           title: "预警总数",
    //         },
    //         {
    //           value: DTS?.data?.[1]?.waringNum ?? 0,
    //           type: "02",
    //           title: "黄色预警",
    //         },
    //         {
    //           value: DTS?.data?.[0]?.waringNum ?? 0,
    //           type: "04",
    //           title: "红色预警",
    //         },
    //       ];
    //     } else {
    //       this.$message.error(`${RT_D}`);
    //     }
    //   });
    // },
    // 获取工单超期列表数据
    getOverdueWarningList(params) {
      API.overdueWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // getIndexOrderOverdue(params) {
    //   API.indexOrderOverdue(params).then((res) => {
    //     const { RT_F, RT_D, DTS } = res.data;
    //     if (RT_F == 1 && DTS) {
    //       this.boxs = [
    //         {
    //           value: DTS?.total ?? 0,
    //           type: "01",
    //           title: "预警总数",
    //         },
    //         {
    //           value: DTS?.data?.[2]?.waringNum ?? 0,
    //           type: "02",
    //           title: "黄色预警",
    //         },
    //         {
    //           value: DTS?.data?.[1]?.waringNum ?? 0,
    //           type: "03",
    //           title: "橙色预警",
    //         },
    //         {
    //           value: DTS?.data?.[0]?.waringNum ?? 0,
    //           type: "04",
    //           title: "红色预警",
    //         },
    //       ];
    //     } else {
    //       this.$message.error(`${RT_D}`);
    //     }
    //   });
    // },
    // 获取质量偏差预警列表数据
    getQualityWarningList(params) {
      API.qualityWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // getIndexQualityWarning(params) {
    //   API.indexQualityWarning(params).then((res) => {
    //     const { RT_F, RT_D, DTS } = res.data;
    //     if (RT_F == 1 && DTS) {
    //       this.boxs = [
    //         {
    //           value: DTS?.total ?? 0,
    //           type: "01",
    //           title: "预警总数",
    //         },
    //         {
    //           value: DTS?.data?.[2]?.waringNum ?? 0,
    //           type: "02",
    //           title: "黄色预警",
    //         },
    //         {
    //           value: DTS?.data?.[1]?.waringNum ?? 0,
    //           type: "03",
    //           title: "橙色预警",
    //         },
    //         {
    //           value: DTS?.data?.[0]?.waringNum ?? 0,
    //           type: "04",
    //           title: "红色预警",
    //         },
    //       ];
    //     } else {
    //       this.$message.error(`${RT_D}`);
    //     }
    //   });
    // },
    // 获取工单超时列表数据
    getTimeOutWarningList(params) {
      API.timeOutWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // getIndexOrderOutTime(params) {
    //   API.indexOrderOutTime(params).then((res) => {
    //     const { RT_F, RT_D, DTS } = res.data;
    //     if (RT_F == 1 && DTS) {
    //       this.boxs = [
    //         {
    //           value: DTS?.total ?? 0,
    //           type: "01",
    //           title: "预警总数",
    //         },
    //         {
    //           value: DTS?.data?.[2]?.waringNum ?? 0,
    //           type: "02",
    //           title: "黄色预警",
    //         },
    //         {
    //           value: DTS?.data?.[1]?.waringNum ?? 0,
    //           type: "03",
    //           title: "橙色预警",
    //         },
    //         {
    //           value: DTS?.data?.[0]?.waringNum ?? 0,
    //           type: "04",
    //           title: "红色预警",
    //         },
    //       ];
    //     } else {
    //       this.$message.error(`${RT_D}`);
    //     }
    //   });
    // },
    // 获取工器具列表数据
    getDeviceWarningList(params) {
      API.deviceWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取物资列表数据
    getSuppliesWarningList(params) {
      API.suppliesWarningList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data ?? [];
          this.tableCount = DTS?.total ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },

    // 获取弹窗查询条件下拉选项
    getCondition() {
      let param = {
        orgNo: this.newOrgId,
      };
      API.getCondition(param).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.warningDegrees = DTS?.warningDegree ?? [];
          this.professionals = DTS?.warningStatus ?? [];
          this.orderTypes = DTS?.workType ?? [];
          this.orderStatus = DTS?.workStatus ?? [];
          this.personInfo = DTS?.personInfo ?? [];
          this.deviceType = DTS?.deviceType ?? [];
          this.suppliesType = DTS?.suppliesType ?? [];
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    sizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.searchSubmit();
    },
    pageChange(val) {
      this.pageIndex = val;
      this.searchSubmit();
    },
    close() {
      this.showDialogNew = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-new {
  width: 30%;
}
.dialog-content {
  height: 100px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  .box {
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .img {
      width: 70px;
      height: 70px;
      margin-right: 12px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 16px;
      color: #999;
      & > div:nth-child(1) {
        margin-bottom: 8px;
      }
      .num {
        font-size: 20px;
        font-weight: bold;
        color: #2a2b2f;
      }
    }
  }
}
:deep(.green) {
  color: #009b83;
}
:deep(.tabBtn) {
  padding: 8px 10px;
  border-radius: 4px;
  &.yellow {
    background: #f9efd7;
    color: #e2bc00;
  }
  &.orange {
    background: #fef3ea;
    color: #fc8e32;
  }
  &.red {
    background: #feeaea;
    color: #fe3333;
  }
}
</style>
