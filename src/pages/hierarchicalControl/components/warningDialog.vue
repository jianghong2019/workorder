<template>
  <div>
    <el-dialog
      v-dialogDrag
      append-to-body
      :title="titlename"
      class="addWorkStyle"
      :visible.sync="internalShowDialog"
      :destroy-on-close="false"
      :width="$dict['DIALOG_WIDTH']['LARGE']"
      @open="open"
      @close="close"
    >
      <el-form
        id="searchData"
        ref="searchData"
        :model="searchData"
        label-position="right"
        label-width="90px"
        class="searchData"
        action="http://"
        target="stop"
      >
        <div class="flex-row-bw flex-wrap">
          <el-form-item
            v-if="timeshow"
            label="预警时段"
            prop="dateTime"
            class="date-box form-item-new form-item"
          >
            <el-date-picker
              v-model="searchData.dateTime"
              type="daterange"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="nameshow" label="姓名" class="form-item-new form-item">
            <el-input v-model="searchData.operatorName" size="small" placeholder="请输入" clearable>
            </el-input>
          </el-form-item>
          <el-form-item v-if="ordernumshow" label="工单编号" class="form-item-new form-item">
            <el-input v-model="searchData.appNo" size="small" placeholder="请输入" clearable>
            </el-input>
          </el-form-item>
          <el-form-item v-if="chulishow" label="处理人" class="form-item-new form-item">
            <el-input v-model="searchData.operatorName" size="small" placeholder="请输入" clearable>
            </el-input>
          </el-form-item>
          <el-form-item v-if="shijishow" label="实际处理人" class="form-item-new form-item">
            <el-input v-model="searchData.operatorName" size="small" placeholder="请输入" clearable>
            </el-input>
          </el-form-item>
          <el-form-item v-if="yujingshow" label="预警程度" class="form-item-new form-item">
            <el-select
              v-model="searchData.warningDegree"
              filterable
              clearable
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="(item, index) in warningDegreeTypes"
                :key="index"
                :label="item.NAME"
                :value="item.VALUE"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="leixingshow" label="工单类型" class="form-item-new form-item">
            <el-cascader
              v-model="searchData.businessCode"
              size="small"
              :options="businessCodeArray"
              :props="orderTypeProp"
              :show-all-levels="false"
              collapse-tags
            ></el-cascader>
          </el-form-item>
          <el-form-item v-if="wuzishow" label="物资类型" class="form-item-new form-item">
            <el-select
              v-model="searchData.suppliesType"
              filterable
              clearable
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="(item, index) in SuppliesType"
                :key="index"
                :label="item.codeName"
                :value="item.codeValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="gongjushow" label="工器具类型" class="form-item-new form-item">
            <el-select
              v-model="searchData.deviceType"
              filterable
              clearable
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="(item, index) in deviceTypeArray"
                :key="index"
                :label="item.codeName"
                :value="item.codeValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="flex-row-end search-buttons form-item-btn30 buttons">
            <el-button class="reset" size="mini" @click="refresh">重 置</el-button>
            <el-button class="search" type="primary" size="mini" @click="searchs(rowData.judgeNum)"
              >查 询
            </el-button>
          </div>
        </div>
      </el-form>
      <el-main v-loading="quyLoading" class="cardbox-pd0 pb-20 manage-main">
        <div class="box-l">
          <div v-if="cuiban">
            <el-button style="float: right" class="reset" size="mini" @click="urget('1')"
              >一键催办</el-button
            >
          </div>
          <el-table
            ref="multipleTable"
            border
            :data="tableData"
            header-cell-class-name="table-header"
            height="90%"
            style="width: 100%"
            class="table-bxe"
            @selection-change="handleSelectionChange"
          >
            <!-- :selectable="scope.row.actionWay == '03'" -->
            <el-table-column
              v-if="chaoqishow"
              :selectable="selectableRow"
              type="selection"
              width="60"
              align="center"
            >
            </el-table-column>
            <el-table-column type="index" label="序号" width="80" align="center">
              <span slot-scope="{ $index }">{{ (current - 1) * pageSize + $index + 1 }}</span>
            </el-table-column>
            <template v-for="item in tableList">
              <!-- :key="item.prop" 后续获取唯一添加-->
              <el-table-column
                v-if="item.prop === 'personName'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="color: $color-primary-hover">{{ scope.row.personName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="item.prop === 'orderNum'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="color: $color-primary-hover">{{ scope.row.orderNum }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="
                  item.prop !== 'warningDegreeName' &&
                  item.prop !== 'personName' &&
                  item.prop !== 'orderNum' &&
                  item.prop !== 'fixType' &&
                  item.prop !== 'caozuo'
                "
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
                align="center"
              >
              </el-table-column>
              <el-table-column
                v-if="item.prop == 'warningDegreeName'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.warningDegree === '03'" class="zhongdu">
                    <!-- {{ scope.row.warningDegreeName }} -->
                    重度
                  </div>
                  <div v-if="scope.row.warningDegree === '02'" class="zhong">
                    <!-- {{ scope.row.warningDegreeName }} -->
                    中度
                  </div>
                  <div v-if="scope.row.warningDegree === '01'" class="qing">
                    <!-- {{ scope.row.warningDegreeName }} -->
                    轻度
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="item.prop == 'fixType'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="fixtype">预警</div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="item.prop == 'caozuo'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.actionWay == '01'"
                    class="search"
                    type="primary"
                    size="mini"
                    @click="gopaigong(scope.row.appNo)"
                    >派工
                  </el-button>
                  <el-button
                    v-if="scope.row.actionWay == '02'"
                    class="search"
                    type="primary"
                    size="mini"
                    @click="urget(scope.row.orderId)"
                    >催办
                  </el-button>
                  <span v-if="scope.row.actionWay == '03'">已催办</span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <el-pagination
          class="cardbox manage-main-pagination"
          :page-sizes="[10, 20, 30, 40]"
          :page-size.sync="pageSize"
          :current-page.sync="current"
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
import API from '@/api/hierarchicalControl/firstlevel.js';
export default {
  name: 'SurpervisionAdd',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 父级表格行数据
    rowData: {
      type: Object,
      default: () => {},
    },
    orgNo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      quyLoading: false, //表格
      internalShowDialog: false, //本地判断
      timeshow: true,
      nameshow: true,
      yujingshow: true,
      wuzishow: true,
      gongjushow: true,
      leixingshow: true,
      ordernumshow: true,
      chulishow: true,
      chaoqishow: true,
      shijishow: true,
      cuiban: false,
      input: '',
      titlename: '人员承载力预警',
      orderTypeProp: {
        //作业类型选项框配置
        multiple: true,
        expandTrigger: 'hover',
        children: 'childList',
        label: 'codeName',
        value: 'codeValue',
        emitPath: false,
      },
      businessCodeArray: [
        {
          codeName: '未处理',
          codeValue: '01',
        },
        {
          codeName: '已归档',
          codeValue: '02',
        },
      ],
      warningDegreeTypes: [
        {
          NAME: '轻度',
          VALUE: '01',
        },
        {
          NAME: '中度',
          VALUE: '02',
        },
        {
          NAME: '严重',
          VALUE: '03',
        },
      ],
      searchData: {
        operatorName: '', //处理人姓名
        warningDegree: '', //预警程度
        suppliesType: '', //物资类型
        deviceType: '',
        appNo: '', //工单编号
        businessCode: [],
      },
      tableData: [],
      tableList: [],
      tableCount: 0,
      current: 1,
      pageSize: 10,
      SuppliesType: [
        {
          codeName: '未处理',
          codeValue: '01',
        },
        {
          codeName: '已归档',
          codeValue: '02',
        },
      ], //物资类型
      deviceTypeArray: [], //物资类型
      workOrderIds: '', //选中数据
      // isUrge:true,
    };
  },
  watch: {
    showDialog: {
      immediate: true,
      handler(newVal) {
        this.internalShowDialog = newVal;
      },
    },
  },
  mounted() {},
  methods: {
    // 获取工单类型下拉数据
    async getOrderTypes() {
      const res = await API.getOrderTree({});
      // let one = res.data.DTS[0].childList;
      // let two = res.data.DTS[1].childList;
      // let thers = res.data.DTS[2].childList;
      // let four = res.data.DTS[3].childList;
      // this.businessCodeArray = [...one, ...two, ...thers, ...four];
      this.businessCodeArray = res.data.DTS || [];
    },
    // 获取选中
    handleSelectionChange(val) {
      let orderId = val.map((item) => item.orderId);
      this.workOrderIds = orderId.toString();
    },
    // // 是否可选择
    selectableRow(row) {
      return row.actionWay == '02';
    },
    urget(e) {
      if (e == '1') {
        if (this.workOrderIds == '') {
          return this.$message.warning('请选择数据');
        } else {
          this.urge();
        }
      } else {
        this.workOrderIds = e;
        this.urge();
      }
    },
    // 催办
    async urge() {
      let params = {
        expediteType: this.rowData.judgeNum == '07' ? '01' : '02',
        orgNo: this.orgNo,
        workOrderIds: this.workOrderIds,
      };
      const res = await API.expedite(params);
      // console.log(11111, res.data);
      this.searchs(this.rowData.judgeNum);
      this.workOrderIds = '';
    },
    // 工单中心
    gopaigong(appNo) {
      this.$emit('close');
      let prame = {};
      if (this.$store.state.UserData.function.includes('04')) {
        prame = {
          orgId: this.orgNo,
          isSelf: '2',
          orgId: this.orgNo,
          isSelf: '0',
          searchContent: appNo,
          wkstStatus: ['01'],
        };
      } else {
        prame = {
          orgId: this.orgNo,
          isSelf: '0',
          searchContent: appNo,
          wkstStatus: ['01'],
        };
      }
      // 跳转工单中心
      localStorage.setItem('UnifiedAnalysisJump', JSON.stringify(prame));
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/#/pages/workPlanManagementModule/workOrderManagement`;
      } else {
        window.parent.openNewTab(
          {
            text: '工单管理',
            name: 'XB_GDZX',
          },
          {
            text: '工单中心',
            name: 'XB_GDZX',
            url: '/siteOperationPlatform_front/siteOperationPlatform_front/index.html#/pages/workPlanManagementModule/workOrderManagement',
          }
        );
      }
    },
    // 重置
    refresh() {
      this.searchData = this.$options.data().searchData;
    },
    // 查询
    searchs(judgenum) {
      this.current = 1;
      this.searchSubmit(judgenum);
    },

    async searchSubmit(judgenum) {
      this.quyLoading = true;
      if (judgenum === '01') {
        let params = {
          ...this.searchData,
          orgNo: this.orgNo,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexCapacityWaringList(params).finally(
          () => (this.quyLoading = false)
        );
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = DTS.total;
          this.tableData = DTS.data;
        } else {
          this.$message.error(RT_D);
        }
      } else if (judgenum === '02') {
        let params = {
          suppliesType: this.searchData.suppliesType || '',
          orgNo: this.orgNo,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexSuppliesWarning(params).finally(() => (this.quyLoading = false));
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = DTS.total;
          this.tableData = DTS.data;
        } else {
          this.$message.error(RT_D);
        }
      } else if (judgenum === '03') {
        let params = {
          operatorName: this.searchData.operatorName,
          warningDegree: this.searchData.warningDegree,
          orgNo: this.orgNo,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexIndicatorWaringList(params).finally(
          () => (this.quyLoading = false)
        );
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = DTS.total;
          this.tableData = DTS.data;
        } else {
          this.$message.error(RT_D);
        }
      } else if (judgenum === '04') {
        let params = {
          operatorName: this.searchData.operatorName,
          warningDegree: this.searchData.warningDegree,
          orgNo: this.orgNo,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexRiskWaringList(params).finally(() => (this.quyLoading = false));
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = DTS.total;
          this.tableData = DTS.data;
        } else {
          this.$message.error(RT_D);
        }
      } else if (judgenum === '05') {
        this.tableData = [];
        this.quyLoading = false;
        // let params = {
        //   operatorName: this.searchData.operatorName,
        //   warningDegree: this.searchData.warningDegree,
        //   orgNo: this.orgNo,
        //   current: this.current,
        //   pageSize: this.pageSize,
        // };
        // let res = await API.indexRiskWaringList(params).finally(
        //   () => (this.quyLoading = false)
        // );
        // let { DTS, RT_F, RT_D } = res.data;
        // if (RT_F == 1 && DTS) {
        //   this.tableCount = DTS.total;
        //   this.tableData = DTS.data;
        // } else {
        //   this.$message.error(RT_D);
        // }
      } else if (judgenum === '06') {
        let params = {
          deviceType: this.searchData.deviceType,
          orgNo: this.orgNo,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexDeviceWaringList(params).finally(() => (this.quyLoading = false));
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = 1;
          this.tableData = DTS;
        } else {
          this.$message.error(RT_D);
        }
      } else if (judgenum === '07') {
        let params = {
          warningDegree: this.searchData.warningDegree,
          operatorName: this.searchData.operatorName,
          appNo: this.searchData.appNo,
          orgNo: this.orgNo,
          businessCode: this.searchData.businessCode,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexOrderOverdueList(params).finally(() => (this.quyLoading = false));
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = DTS.total;
          this.tableData = DTS.data;
        } else {
          this.$message.error(RT_D);
        }
      } else if (judgenum === '08') {
        let params = {
          warningDegree: this.searchData.warningDegree,
          operatorName: this.searchData.operatorName,
          orgNo: this.orgNo,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexQualityWarningList(params).finally(
          () => (this.quyLoading = false)
        );
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = DTS.total;
          this.tableData = DTS.data;
        } else {
          this.$message.error(RT_D);
        }
      } else if (judgenum === '09') {
        let params = {
          warningDegree: this.searchData.warningDegree,
          operatorName: this.searchData.operatorName,
          appNo: this.searchData.appNo,
          orgNo: this.orgNo,
          businessCode: this.searchData.businessCode,
          current: this.current,
          pageSize: this.pageSize,
        };
        let res = await API.indexOrderOutTimeList(params).finally(() => (this.quyLoading = false));
        let { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableCount = DTS.total;
          this.tableData = DTS.data;
        } else {
          this.$message.error(RT_D);
        }
      }
    },
    async getType() {
      let params = {};
      let res = await API.getSuppliesType(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.SuppliesType = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    async getDeviceType() {
      let params = {};
      let res = await API.getDeviceType(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.deviceTypeArray = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    sizeChange(val) {
      this.pageSize = val;
      this.current = 1;
      this.searchSubmit(this.rowData.judgeNum);
    },
    pageChange(val) {
      // console.log(22222, val);
      this.current = val;
      this.searchSubmit(this.rowData.judgeNum);
    },
    close() {
      this.refresh();
      this.$emit('close');
    },
    open() {
      this.getOrderTypes();
      if (this.rowData.judgeNum === '01') {
        this.nameshow = true;
        this.yujingshow = true;
        this.wuzishow = false;
        this.timeshow = false;
        this.gongjushow = false;
        this.chaoqishow = false;
        this.ordernumshow = false;
        this.leixingshow = false;
        this.chulishow = false;
        this.shijishow = false;
        this.cuiban = false;
        this.titlename = '人员承载力预警';
        this.tableList = [
          {
            prop: 'personName',
            label: '姓名',
            width: '100px',
          },
          {
            prop: 'orderNum',
            label: '工单总量',
            width: '100px',
          },
          {
            prop: 'totalHours',
            label: '总工时',
            width: '100px',
          },
          {
            prop: 'standardHours',
            label: '标准工时',
            width: '100px',
          },
          {
            prop: 'warningRule',
            label: '预警规则',
            width: '100px',
          },
          {
            prop: 'warningDegreeName',
            label: '预警程度',
            width: '100px',
          },
        ];
        this.searchSubmit(this.rowData.judgeNum);
      } else if (this.rowData.judgeNum === '02') {
        this.nameshow = false;
        this.yujingshow = false;
        this.wuzishow = true;
        this.timeshow = false;
        this.gongjushow = false;
        this.chaoqishow = false;
        this.ordernumshow = false;
        this.leixingshow = false;
        this.chulishow = false;
        this.shijishow = false;
        this.cuiban = false;
        this.titlename = '物资预警';
        this.tableList = [
          {
            prop: 'typeName',
            label: '物资类型',
            width: '100px',
          },
          {
            prop: 'quantity',
            label: '库存量',
            width: '100px',
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
            label: '可维持天数',
            width: '100px',
          },
          {
            prop: 'fixType',
            label: '预警状态',
            width: '100px',
          },
        ];
        this.getType();
        this.searchSubmit(this.rowData.judgeNum);
      } else if (this.rowData.judgeNum === '03') {
        this.nameshow = true;
        this.yujingshow = true;
        this.wuzishow = false;
        this.timeshow = false;
        this.gongjushow = false;
        this.chaoqishow = false;
        this.ordernumshow = false;
        this.leixingshow = false;
        this.chulishow = false;
        this.shijishow = false;
        this.cuiban = false;
        this.titlename = '人员质效预警';
        this.tableList = [
          {
            prop: 'personName',
            label: '姓名',
            width: '100px',
          },
          {
            prop: 'indicator',
            label: '综合质效指标值',
            width: '100px',
          },
          {
            prop: 'warningRule',
            label: '预警规则',
            width: '100px',
          },
          {
            prop: 'warningDegreeName',
            label: '预警程度',
            width: '100px',
          },
        ];
        this.searchSubmit(this.rowData.judgeNum);
      } else if (this.rowData.judgeNum === '04') {
        this.nameshow = true;
        this.yujingshow = true;
        this.wuzishow = false;
        this.timeshow = false;
        this.gongjushow = false;
        this.chaoqishow = false;
        this.ordernumshow = false;
        this.leixingshow = false;
        this.chulishow = false;
        this.shijishow = false;
        this.cuiban = false;
        this.titlename = '人员风险预警';
        this.tableList = [
          {
            prop: 'personName',
            label: '姓名',
            width: '100px',
          },
          {
            prop: 'warningNum',
            label: '预警次数',
            width: '100px',
          },
          {
            prop: 'warningDegreeName',
            label: '预警程度',
            width: '100px',
          },
        ];
        this.searchSubmit(this.rowData.judgeNum);
      } else if (this.rowData.judgeNum === '05') {
        this.nameshow = false;
        this.yujingshow = false;
        this.wuzishow = false;
        this.timeshow = true;
        this.gongjushow = false;
        this.chaoqishow = false;
        this.ordernumshow = false;
        this.leixingshow = false;
        this.chulishow = false;
        this.shijishow = false;
        this.cuiban = false;
        this.titlename = '车辆预警';
        this.tableList = [
          {
            prop: 'orderNo',
            label: '车辆总数',
            width: '100px',
          },
          {
            prop: 'orderNo1',
            label: '空闲数量',
            width: '100px',
          },
          {
            prop: 'orderNo2',
            label: '申请次数',
            width: '100px',
          },
          {
            prop: 'orderNo3',
            label: '预警时段',
            width: '100px',
          },
          {
            prop: 'orderNo4',
            label: '预警状态',
            width: '100px',
          },
        ];
      } else if (this.rowData.judgeNum === '06') {
        this.nameshow = false;
        this.yujingshow = false;
        this.wuzishow = false;
        this.timeshow = false;
        this.gongjushow = true;
        this.chaoqishow = false;
        this.ordernumshow = false;
        this.leixingshow = false;
        this.chulishow = false;
        this.shijishow = false;
        this.cuiban = false;
        this.titlename = '工器具预警';
        this.tableList = [
          {
            prop: 'deviceName',
            label: '工器具类型',
            width: '110px',
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
            width: '100px',
          },
          {
            prop: 'fixType',
            label: '预警状态',
            width: '100px',
          },
        ];
        this.getDeviceType();
        this.searchSubmit(this.rowData.judgeNum);
      } else if (this.rowData.judgeNum === '07') {
        this.nameshow = false;
        this.yujingshow = true;
        this.wuzishow = false;
        this.timeshow = false;
        this.gongjushow = false;
        this.chaoqishow = true;
        this.ordernumshow = true;
        this.leixingshow = true;
        this.chulishow = true;
        this.shijishow = false;
        this.cuiban = true;
        this.titlename = '工单超期关联工单';
        this.tableList = [
          {
            prop: 'appNo',
            label: '工单编号',
            width: '100px',
          },
          {
            prop: 'workTypeName',
            label: '工单类型',
            width: '100px',
          },
          {
            prop: 'workTypeSubName',
            label: '工单子类型',
            width: '100px',
          },
          {
            prop: 'operatorName',
            label: '实际处理人',
            width: '100px',
          },
          {
            prop: 'overdueRateStr',
            label: '超期比例',
            width: '100px',
          },
          {
            prop: 'warningDegreeName',
            label: '预警程度',
            width: '100px',
          },
          {
            prop: 'caozuo',
            label: '操作',
            width: '100px',
          },
        ];
        this.searchSubmit(this.rowData.judgeNum);
      } else if (this.rowData.judgeNum === '08') {
        this.nameshow = false;
        this.yujingshow = true;
        this.wuzishow = false;
        this.timeshow = false;
        this.gongjushow = false;
        this.chaoqishow = false;
        this.ordernumshow = false;
        this.leixingshow = false;
        this.chulishow = false;
        this.shijishow = true;
        this.cuiban = false;
        this.titlename = '质量偏差关联工单';
        this.tableList = [
          {
            prop: 'operatorName',
            label: '实际处理人',
            width: '100px',
          },
          {
            prop: 'warningNum',
            label: '预警次数',
            width: '100px',
          },
          {
            prop: 'warningDegreeName',
            label: '预警程度',
            width: '100px',
          },
        ];
        this.searchSubmit(this.rowData.judgeNum);
      } else if (this.rowData.judgeNum === '09') {
        this.nameshow = false;
        this.yujingshow = true;
        this.wuzishow = false;
        this.timeshow = false;
        this.gongjushow = false;
        this.chaoqishow = true;
        this.ordernumshow = true;
        this.leixingshow = true;
        this.chulishow = true;
        this.shijishow = false;
        this.cuiban = true;
        this.titlename = '作业超时关联工单';
        this.tableList = [
          {
            prop: 'appNo',
            label: '工单编号',
            width: '100px',
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
            prop: 'operatorName',
            label: '实际处理人',
            width: '120px',
          },
          {
            prop: 'beginProcessTime',
            label: '开工时间',
            width: '100px',
          },
          {
            prop: 'standardTime',
            label: '标准作业时长',
            width: '130px',
          },
          {
            prop: 'currentWorkTime',
            label: '当前作业时长',
            width: '130px',
          },
          {
            prop: 'overdueRateStr',
            label: '超期比例',
            width: '100px',
          },
          {
            prop: 'warningDegreeName',
            label: '预警程度',
            width: '100px',
          },
          {
            prop: 'caozuo',
            label: '操作',
            width: '100px',
          },
        ];
        this.searchSubmit(this.rowData.judgeNum);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-main {
  width: 100%;
  height: 450px;
}
.box-l {
  width: 100%;
  height: 89%;
  // height: calc(100%-60px) !important;
  // .table-bxe {
  //   overflow: auto;
  // }
}
.fixtype {
  color: red;
  // background-color: $color-error;
}
.zhongdu {
  color: red;
}
.zhong {
  color: orange;
}
.qing {
  color: $gradient-yellow-start;
}
.cardbox {
  margin-top: 20px;
}
.searchData {
  margin-bottom: 10px;
}
.buttons {
  align-items: center;
}
.reset {
  height: 30px;
  margin: 10px 0 10px;
  // margin-bottom: 10px;
}
.search {
  height: 30px;
}
.form-item-new {
  width: 30%;
}
</style>
