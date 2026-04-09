<template>
  <el-container class="new-safeweb-web" style="height: 100%">
    <Tabs v-if="orgType == '01'" :active-index="activeName" :tabs="tabs" @tabClick="tabClick">
      <template #right>
        <div class="flex-row-end">
          <el-button class="el-btn-new reset-btn" size="small" @click="goBack">
            <img src="@/assets/images/icon-img/icon-fanhui.png" alt="" />
            返回
          </el-button>
        </div>
      </template>
    </Tabs>
    <base-title-table v-else title="督办消息">
      <template #right>
        <div class="flex-row-end">
          <el-button class="el-btn-new reset-btn" size="small" @click="goBack">
            <img src="@/assets/images/icon-img/icon-fanhui.png" alt="" />
            返回
          </el-button>
        </div>
      </template>
    </base-title-table>
    <!-- 头 -->
    <el-header class="cardboxpd">
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
          <el-form-item label="标题" class="form-item-new">
            <el-input
              v-model="searchData.surpervisionTitle"
              class="input-box"
              placeholder="请输入"
              name="searchData.surpervisionTitle"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="督办内容" class="form-item-new">
            <el-input
              v-model="searchData.surpervisionContent"
              class="input-box"
              placeholder="请输入"
              name="searchData.surpervisionContent"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item v-if="activeName == '02'" label="创建人" class="form-item-new">
            <el-input
              v-model="searchData.founder"
              class="input-box"
              founder
              placeholder="请输入"
              name="searchData.founder"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item v-else label="接收人" class="form-item-new">
            <el-input
              v-model="searchData.recipient"
              class="input-box"
              placeholder="请输入"
              name="searchData.recipient"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="处理状态" class="form-item-new">
            <el-select
              v-model="searchData.proStatus"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in proStatusList"
                :key="index"
                :label="item.NAME"
                :value="item.VALUE"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="creatTime" class="date-box form-item-new">
            <el-date-picker
              v-model="searchData.creatTime"
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
          <el-form-item
            v-show="isShowInput"
            label="反馈时间"
            prop="feedbackTime"
            class="date-box form-item-new"
          >
            <el-date-picker
              v-model="searchData.feedbackTime"
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
          <el-form-item
            v-show="isShowInput && activeName == '02'"
            label="创建单位"
            prop="creatOrg"
            class="form-item-new"
          >
            <org-tree
              v-model="searchData.creatOrg"
              :unit-data="newUnitData"
              :clearable="true"
            ></org-tree>
          </el-form-item>
          <el-form-item
            v-show="isShowInput && activeName == '01'"
            label="接收单位"
            prop="recipientOrg"
            class="form-item-new"
          >
            <org-tree
              v-model="searchData.recipientOrg"
              :unit-data="unitData"
              :clearable="true"
            ></org-tree>
          </el-form-item>
          <el-form-item v-show="isShowInput" label="督办编号" class="form-item-new">
            <el-input
              v-model="searchData.surpervisionNum"
              class="input-box"
              placeholder="请输入"
              name="searchData.surpervisionNum"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <div class="flex-row-end search-buttons form-item-btn30">
            <el-button
              class="el-btn-new reset-btn"
              plain
              size="small"
              :disabled="tableLoading"
              @click="refresh"
              >重 置</el-button
            >
            <el-button
              class="el-btn-new search-btn"
              type="primary"
              plain
              size="small"
              :disabled="tableLoading"
              @click="searchSubmit"
              >查 询
            </el-button>
            <el-button
              class="el-btn-new isshow-btn"
              type="text"
              plain
              size="small"
              @click="isShowInputFn"
              >{{ isShowInput ? '收起' : '展开' }}
              <i :class="['iconfont', 'icon-xiajiantou', isShowInput ? 'active' : '']"></i
            ></el-button>
          </div>
        </div>
      </el-form>
    </el-header>
    <!-- 头 end -->
    <el-main class="cardbox-pd0 pb-20 manage-main">
      <base-title-table title="督办记录">
        <template #right>
          <div class="flex-row-end">
            <el-button
              v-if="activeName == '01'"
              class="el-btn-new search-btn"
              type="primary"
              size="small"
              @click="creatSurpervision"
            >
              <i class="iconfont icon-xinzeng2"></i>
              发起督办单
            </el-button>
            <el-button class="el-btn-new reset-btn" size="small" @click="newExportClick">
              <i class="iconfont icon-daochu1"></i>
              导出
            </el-button>
          </div>
        </template>
      </base-title-table>
      <div v-loading="tableLoading" class="cardbox box-shadow-normal table-wrap">
        <el-table
          v-if="tableData.length"
          ref="multipleTable"
          border
          :data="tableData"
          header-cell-class-name="table-header"
          height="100%"
          style="width: 100%"
        >
          <template v-for="item in tableList">
            <el-table-column
              :key="item.recordId"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
              :min-width="item.width"
            >
            </el-table-column>
          </template>
          <el-table-column label="操作" min-width="180" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.dealStatus == '03' && activeName == '01'"
                type="text"
                size="small"
                @click="creatSurpervision(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-if="scope.row.dealStatus == '03' && activeName == '01'"
                type="text"
                size="small"
                @click="superviseSendSubmit(scope.row.recordId)"
                >发起督办</el-button
              >
              <el-button v-else type="text" size="small" @click="edit(scope.row)">详情</el-button>
              <el-button
                v-if="scope.row.dealStatus == '01' && activeName == '01'"
                type="text"
                size="small"
                @click="returnData(scope.row)"
                >撤销</el-button
              >
              <el-button
                v-if="scope.row.dealStatus == '01' && activeName == '02'"
                type="text"
                size="small"
                @click="process(scope.row)"
                >处理</el-button
              >
              <!-- <el-button type="text" size="small" @click="approve(scope.row)"
                >审批</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
        <nullData v-else style="height: 450px" />
      </div>
      <el-pagination
        v-if="tableData.length"
        class="cardbox manage-main-pagination"
        :disabled="tableLoading"
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

    <!-- 新增/编辑督办单 -->
    <surpervisionAdd
      v-if="showSurpervisionAdd"
      :show-dialog="showSurpervisionAdd"
      :supervise-id="superviseId"
      :unit-data="unitData"
      @close="close"
    ></surpervisionAdd>
    <!-- 督办单详情/处理督办单 -->
    <surpervisionEdit
      v-if="showSurpervisionEdit"
      :show-dialog="showSurpervisionEdit"
      :supervise-id="superviseId"
      :show-process="showProcess"
      @close="close"
    ></surpervisionEdit>
    <!-- <SurpervisionApprove :showDialog="showSurpervisionApprove" @close="showSurpervisionApprove = false"></SurpervisionApprove> -->
    <!-- <DialogRemind
      id="01"
      ref="remind"
      content="次操作将撤销督办单，是否继续？"
      @confirm="returnSurpervision"
    ></DialogRemind> -->
  </el-container>
</template>

<script>
import BaseTitleTable from '@/components/common/form/base-title-table/index.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import Tabs from '@/components/common/form/Tabs.vue';
import nullData from '@/components/common/form/nullData.vue';
// import DialogRemind from '../../responsibilityFied/components/popup/DialogRemind.vue';
import surpervisionAdd from './components/surpervisionAdd.vue';
import surpervisionEdit from './components/surpervisionEdit.vue';
import SurpervisionApprove from './components/surpervisionApprove.vue';
import { useUnitData } from '@/composables/useUnitData.js';
import API from '@/api/hierarchicalControl/surpervision.js';
import { getOrgTreeByOrgId } from '@/api/common/index.js';

export default {
  name: 'Surpervision',
  components: {
    BaseTitleTable,
    OrgTree,
    Tabs,
    nullData,
    // DialogRemind,
    surpervisionAdd,
    surpervisionEdit,
    SurpervisionApprove,
  },
  // 获取单位树下拉数据
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
    };
  },
  data() {
    return {
      orgType: '01', // 省市县/本级
      activeName: '01', // 头部Tabs激活下标
      AllUnitData: [], // 全量单位下拉数据
      isShowInput: false, // 查询条件展开收起标识
      tabs: [
        {
          label: '我发起的',
          value: '01',
        },
        {
          label: '我收到的',
          value: '02',
        },
      ],
      proStatusList: [
        {
          NAME: '待处理',
          VALUE: '01',
        },
        {
          NAME: '已反馈',
          VALUE: '02',
        },
        {
          NAME: '未发起',
          VALUE: '03',
        },
      ],
      searchData: {
        // 查询条件集合
        surpervisionTitle: '',
        surpervisionContent: '',
        founder: '',
        recipient: '',
        proStatus: [],
        creatTime: '',
        feedbackTime: '',
        creatOrg: null,
        recipientOrg: null,
        surpervisionNum: '',
      },
      tableLoading: false,
      tableData: [], // 表格数据
      tableList: [
        // 表头数据
        {
          prop: 'formNum',
          label: '督办编号',
          width: '150px',
        },
        {
          prop: 'formTitle',
          label: '标题',
          width: '100px',
        },
        {
          prop: 'content',
          label: '督办内容',
          width: '200px',
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: '150px',
        },
        {
          prop: 'needFinishTime',
          label: '要求完成时间',
          width: '150px',
        },
        {
          prop: 'actualFinishTime',
          label: '反馈时间',
          width: '150px',
        },
        {
          prop: 'createName',
          label: '创建人',
          width: '90px',
        },
        {
          prop: 'createOrgName',
          label: '创建单位',
          width: '100px',
        },
        {
          prop: 'receiveName',
          label: '接收人',
          width: '90px',
        },
        {
          prop: 'receiveOrgName',
          label: '接收单位',
          width: '100px',
        },
        {
          prop: 'dealStatusName',
          label: '处理状态',
          width: '80px',
        },
      ],
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      showSurpervisionAdd: false,
      superviseId: '', // 督办单ID
      showProcess: false,
      showSurpervisionEdit: false,
      // showSurpervisionApprove: false,
    };
  },
  computed: {
    newUnitData() {
      return this.orgType == '01' ? this.unitData : this.AllUnitData;
    },
  },
  mounted() {
    let data = this.$route.query || {};
    this.orgType = data?.orgType ?? '01';
    if (data?.orgType === '02') {
      this.activeName = '02';
      this.getAllTree();
    }
    this.searchSubmit();
  },
  methods: {
    // tabs点击
    tabClick(val) {
      this.activeName = val.name;
      this.refresh();
    },
    // 重置按钮点击
    refresh() {
      (this.searchData = {
        surpervisionTitle: '',
        surpervisionContent: '',
        founder: '',
        recipient: '',
        proStatus: [],
        creatTime: '',
        feedbackTime: '',
        creatOrg: null,
        recipientOrg: null,
        surpervisionNum: '',
        pageIndex: 1,
        pageSize: 10,
      }),
        this.searchSubmit();
    },
    // 查询表格数据
    searchSubmit() {
      this.tableLoading = true;
      let params = {
        formTitle: this.searchData.surpervisionTitle,
        content: this.searchData.surpervisionContent,
        createName: this.searchData.founder,
        receiveName: this.searchData.recipient,
        dealStatus: this.searchData.proStatus.join(','),
        createTimeStart: this.searchData.creatTime?.[0] ?? '',
        createTimeEnd: this.searchData.creatTime?.[1] ?? '',
        dealTimeStart: this.searchData.feedbackTime?.[0] ?? '',
        dealTimeEnd: this.searchData.feedbackTime?.[1] ?? '',
        createOrgId: this.searchData.creatOrg,
        receiveOrgId: this.searchData.recipientOrg,
        formNum: this.searchData.surpervisionNum,
        tabType: this.activeName,
        current: this.pageIndex,
        pageSize: this.pageSize,
      };
      this.tableLoading = false;
      API.superviseList(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data;
          this.tableCount = DTS?.total;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 收起展开按钮点击
    isShowInputFn() {
      if (this.isShowInput) {
        this.isShowInput = false;
      } else {
        this.isShowInput = true;
      }
    },
    // 去创建督办单
    creatSurpervision(data) {
      this.superviseId = data ? data.recordId : '';
      this.showSurpervisionAdd = true;
    },
    // 导出
    newExportClick() {
      if (!this.tableData.length) {
        return this.$message.error('暂无数据可以导出!');
      }
      this.exportClick();
    },
    exportClick() {
      let exportClickparams = {
        formTitle: this.searchData.surpervisionTitle,
        content: this.searchData.surpervisionContent,
        createName: this.searchData.founder,
        receiveName: this.searchData.recipient,
        dealStatus: this.searchData.proStatus.join(','),
        createTimeStart: this.searchData.creatTime?.[0] ?? '',
        createTimeEnd: this.searchData.creatTime?.[1] ?? '',
        dealTimeStart: this.searchData.feedbackTime?.[0] ?? '',
        dealTimeEnd: this.searchData.feedbackTime?.[1] ?? '',
        createOrgId: this.searchData.creatOrg,
        receiveOrgId: this.searchData.recipientOrg,
        formNum: this.searchData.surpervisionNum,
        tabType: this.activeName,
        current: this.pageIndex,
        pageSize: this.pageSize,
      };
      var form = document.createElement('form');
      form.style.display = 'none';
      form.action = '/safemanage-evaluation/superviseHandle/superviseExport'; // 测试时需要改动
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
    // 直接发起督办单
    superviseSendSubmit(superviseId) {
      let params = {
        superviseId: superviseId,
      };
      API.superviseSend(params).then((res) => {
        const { RT_F, RT_D } = res.data;
        if (RT_F == 1) {
          this.searchSubmit();
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 查看详情
    edit(data) {
      this.superviseId = data.recordId;
      this.showProcess = false;
      this.showSurpervisionEdit = true;
    },
    // 督办处理
    process(data) {
      this.superviseId = data.recordId;
      this.showProcess = true;
      this.showSurpervisionEdit = true;
    },
    // 撤回督办确认弹窗
    returnData(data) {
      this.superviseId = data.recordId;
      this.$refs.remind.open();
    },
    // 确定撤回督办
    returnSurpervision() {
      let params = {
        superviseId: this.superviseId,
      };
      API.superviseBack(params).then((res) => {
        const { RT_F, RT_D } = res.data;
        if (RT_F == 1) {
          this.searchSubmit();
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    close(data) {
      this.showSurpervisionAdd = false;
      this.showSurpervisionEdit = false;
      if (data == 'relode') {
        this.searchSubmit();
      }
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
    async getAllTree() {
      let orgId = this.$store.state.UserData.orgSNo;
      const res = await getOrgTreeByOrgId({ orgId });
      this.AllUnitData = res.data.resultValue || [];
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 督办审批
    // approve(data) {
    //   this.showSurpervisionApprove = true;
    // },
  },
};
</script>

<style scoped lang="scss"></style>
