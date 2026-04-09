<template>
  <!-- 本级 -->
  <el-container class="new-safeweb-web">
    <div id="app" class="content-box">
      <!-- 返回首页按钮 -->
      <base-title-table title="问题监控">
        <template #right>
          <div class="flex-row-end">
            <el-button class="el-btn-new reset-btn" size="small" @click="goBack">
              <img src="@/assets/images/icon-img/icon-fanhui.png" alt="" />
              返回
            </el-button>
          </div>
        </template>
      </base-title-table>
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
          <div class="flex-row-bw flex-wrap">
            <el-form-item label="单位" prop="orgNo" class="form-item-new">
              <org-tree v-model="searchData.orgNo" :unit-data="unitData"></org-tree>
            </el-form-item>
            <el-form-item label="日期选择" prop="dateTime" class="date-box form-item-new">
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
            <div class="flex-row-end search-buttons form-item-btn30">
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
      </el-header>
      <!-- 问题统计图表区域 -->
      <!-- <el-main class="manage-main"> -->
      <div class="form-box">
        <el-row :gutter="20">
          <!-- 左侧：问题统计柱状图 -->
          <el-col :span="12">
            <div class="lineTitel_tiem">
              <div class="new-base-title">问题统计</div>
              <div class="time_1">
                <div
                  v-for="(item, index) in btns"
                  :key="index + ''"
                  :class="checkIndex_1 === index ? 'checkTimeName_1' : 'timeName_1'"
                  @click="handleTime_1(index)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
            <barChart
              :zoom-type="true"
              barchart-id="problemBarchart"
              :config="barConfig"
            ></barChart>
          </el-col>

          <!-- 右侧：作业问题饼图 + 质量问题进度条 -->
          <el-col :span="6">
            <h3>风险防范</h3>
            <!-- 饼图区 -->
            <div class="PieCenter">
              <div class="chartPie">
                <div id="work-problems-pie"></div>
              </div>
              <!-- 图例说明区 -->
              <!-- 图例数据区域 -->

              <!-- <div class="ring-data"> -->
              <div v-if="pieConfig.data.length > 0" class="chart-legend">
                <div v-for="(item, index) in pieConfig.data" :key="index" class="legend-item">
                  <div class="legend-title">
                    <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                    <div class="legend-name">
                      {{ item.name }}
                      <div :style="{ color: item.color }">&nbsp;&nbsp;{{ item.value }}</div>
                      <div :style="{ color: item.color }">&nbsp;&nbsp;{{ item.percent }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- </div> -->
            </div>
          </el-col>

          <el-col :span="6">
            <h3>质量问题</h3>
            <div class="chart-container">
              <div class="chart-box">
                <div
                  v-for="(item, index) in qualityProgressList"
                  :key="index"
                  class="chart-box-item"
                >
                  <div v-for="(ite, inde) in item" :key="inde">
                    <span v-if="index === 0 || index === 2" :title="ite">{{ ite }}</span>
                    <el-progress
                      v-if="index === 1"
                      :percentage="ite"
                      :stroke-width="18"
                      :show-text="false"
                      text-inside
                      status="exception"
                      color="#f56c6c"
                    ></el-progress>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- </el-main> -->
      <!-- 各单位质量情况表格 -->
      <div class="table-container">
        <div class="title-btn">
          <h3>统计列表</h3>
          <el-button class="el-btn-new reset-btn" size="small" @click="newExportClick">
            <i class="iconfont icon-daochu1"></i>
            导出
          </el-button>
        </div>

        <div v-loading="loading" class="table-box">
          <personTable
            :table-data="tableData"
            :columns="columns"
            :table-count="tableCount"
            :page-index="pageIndex"
            :page-size="pageSize"
            @goPerson="goPerson"
            @sizeChange="sizeChange"
            @pageChange="pageChange"
          ></personTable>
        </div>
      </div>

      <!-- 弹窗：质量问题列表 -->
      <el-dialog
        title="质量问题列表"
        :visible.sync="qualityDialogVisible"
        width="80%"
        :close-on-click-modal="false"
      >
        <div class="dialog-content">
          <el-form
            :inline="true"
            :model="qualityForm"
            class="demo-form-inline"
            style="margin-bottom: 15px"
          >
            <el-form-item label="工单编号：">
              <el-input
                v-model="qualityForm.appNo"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="工单类型：">
              <el-input
                v-model="qualityForm.workTypeName"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="质量问题：">
              <el-input
                v-model="qualityForm.qualityName"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="处理人：">
              <el-input
                v-model="qualityForm.operatorName"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属单位：">
              <el-input
                v-model="qualityForm.orgName"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核人：">
              <el-input
                v-model="qualityForm.operatorName"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="研判时间：">
              <el-date-picker
                v-model="qualityForm.createTime"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchQualityList">查询</el-button>
              <el-button @click="resetQualityForm">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="qualityList" border style="width: 100%" height="300">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="appNo" label="工单编号"></el-table-column>
            <el-table-column prop="workTypeName" label="工单类型"></el-table-column>
            <el-table-column prop="qualityName" label="质量问题"></el-table-column>
            <el-table-column prop="operatorName" label="处理人"></el-table-column>
            <el-table-column prop="orgName" label="所属单位"></el-table-column>
            <el-table-column prop="operatorName" label="审核人"></el-table-column>
            <el-table-column prop="createTime" label="研判时间"></el-table-column>
          </el-table>

          <div style="text-align: center; margin-top: 15px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="qualitytotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="qualityDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="qualityDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 弹窗：服务问题列表 -->
      <el-dialog
        title="服务问题列表"
        :visible.sync="serviceDialogVisible"
        width="80%"
        :close-on-click-modal="false"
      >
        <div class="dialog-content">
          <el-form
            :inline="true"
            :model="serviceForm"
            class="demo-form-inline"
            style="margin-bottom: 15px"
          >
            <el-form-item label="来源：">
              <el-select v-model="serviceForm.sourceName" placeholder="请选择" style="width: 150px">
                <el-option label="客户投诉" value="customer"></el-option>
                <el-option label="上级检查" value="superior"></el-option>
                <el-option label="内部自查" value="self"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投诉对象：">
              <el-input
                v-model="serviceForm.judgePersonName"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="单位：">
              <el-select v-model="serviceForm.orgName" placeholder="请选择" style="width: 150px">
                <el-option label="花木供电服务中心" value="花木供电服务中心"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投诉内容：">
              <el-input
                v-model="serviceForm.content"
                placeholder="请输入"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="投诉时间：">
              <el-date-picker
                v-model="serviceForm.time"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchServiceList">查询</el-button>
              <el-button @click="resetServiceForm">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="serviceList" border style="width: 100%" height="300">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="sourceName" label="来源" width="120"></el-table-column>
            <el-table-column prop="judgePersonName" label="投诉对象" width="120"></el-table-column>
            <el-table-column prop="orgName" label="单位" width="120"></el-table-column>
            <el-table-column prop="content" label="投诉内容" min-width="200"></el-table-column>
            <el-table-column prop="time" label="投诉时间" width="150"></el-table-column>
          </el-table>

          <div style="text-align: center; margin-top: 15px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="servertotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="serviceDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="serviceDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import * as echarts from 'echarts';
import personTable from './components/personTable.vue';
import API from '@/api/hierarchicalControl/problemmMoniMore.js';
import BaseTitleTable from '@/components/common/form/base-title-table/index.vue';
import OrgTree from '@/components/common/form/OrgTree.vue';
import barChart from '../order/components/barChart.vue';
import { useUnitData } from '@/composables/useUnitData.js';
export default {
  name: 'App',

  components: {
    personTable,
    OrgTree,
    barChart,
    BaseTitleTable,
  },
  setup() {
    const { unitData } = useUnitData();
    return {
      unitData,
    };
  },
  data() {
    return {
      orgNo: '',
      chartViewMode: 'all', // 当前视图模式：'all' | 'quality' | 'work'
      chartInstance: null,
      queryForm: {},
      qualityProgressList: [],
      searchData: { orgNo: '', dateTime: [] },
      qualityData: [],
      statOrgNameData: [],
      statQualityNUmData: [],
      statRiskNumData: [],
      paramList: [],
      columns: [],
      tableData: [],
      loading: false,
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
      fromData: [],
      workProblemsPieList: [],
      qualityForm: {},
      qualityList: [],
      serviceForm: {},
      serviceList: [],
      qualityDialogVisible: false,
      serviceDialogVisible: false,
      currentPage: 1,

      qualitytotal: 2,
      servertotal: 2,

      btns: [{ name: '全部' }, { name: '质量问题' }, { name: '风险防范' }],
      checkIndex_1: 0,
      barConfig: {
        nameY: '单位（条）',
        grid: {
          left: 80,
          right: 30,
          bottom: 35,
          top: 40,
        },
        barData: [],
        barX: [],
        customColors: [
          ['#F98A23', '#FCD9B9'], // 第二个系列的渐变色
          ['#F95123', '#FCC4B9'], // 第三个系列的渐变色（备用）
        ],
        barMaxWidth: 18,
      },
      pieColors: ['#FEDD45', '#FFA029', '#FE3333'],
      pieConfig: {
        // 环状图数据
        data: [
          {
            name: '安全违章',
            color: '#FEDD45',
            value: 0,
            percent: 0,
          },
          {
            name: '服务投诉',
            color: '#FFA029',
            value: 0,
            percent: 0,
          },
          {
            name: '廉政违规',
            color: '#FE3333',
            value: 0,
            percent: 0,
          },
        ],
      },
    };
  },
  mounted() {
    let data = this.$route.query || {};
    this.orgNo = data.orgId ? data.orgId : this.$store.state.UserData.orgId; // 保留一开始进来的单位id 用于重置按钮
    this.searchData.orgNo = data.orgId ? data.orgId : this.$store.state.UserData.orgId;
    this.searchData.dateTime = data.timeData ? data.timeData : [];

    this.initCharts();
    this.searchSubmit();
  },
  methods: {
    // 柱状图按钮点击事件
    handleTime_1(index) {
      this.checkIndex_1 = index;
      this.changeBarData();
    },
    // 切换柱状图数据
    changeBarData() {
      this.barConfig.barData = [];
      if (this.checkIndex_1 === 0) {
        this.barConfig.barData.push({
          name: '质量问题',
          value: this.statQualityNUmData,
        });
        this.barConfig.barData.push({
          name: '风险防范',
          value: this.statRiskNumData,
        });
      } else if (this.checkIndex_1 === 1) {
        this.barConfig.barData.push({
          name: '质量问题',
          value: this.statQualityNUmData,
        });
      } else {
        this.barConfig.barData.push({
          name: '风险防范',
          value: this.statRiskNumData,
        });
      }
    },
    switchChartView(mode) {
      this.chartViewMode = mode;
      this.initCharts();
    },
    onSubmit() {
      console.log('查询条件:', this.queryForm);
      this.$message({ message: '正在查询...', type: 'info' });
    },
    resetForm() {},

    initCharts() {
      //销毁旧实例
      if (this.workProblemsPie) {
        this.workProblemsPie.dispose();
        this.workProblemsPie = null;
      }
      const workProblemsPie = echarts.init(document.getElementById('work-problems-pie'));

      // 作业问题饼图
      workProblemsPie.setOption({
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: ['55', '70'],
            label: { show: false },
            labelLine: { show: false },
            color: this.pieColors,
            data: this.pieConfig.data,
          },
        ],
      });
    },

    openQualityDialog(row, type) {
      console.log(row, '-------------------', type);
      if (type > 0) {
        this.qualityForm.problemType = type;
        this.qualityDialogVisible = true;
      }
    },
    openServiceDialog(row, type) {
      if (type > 0) {
        this.serviceDialogVisible = true;
      }
    },

    searchQualityList() {
      console.log('查询质量问题:', this.qualityForm);
      this.getQualityStatisticsList();
    },
    resetQualityForm() {
      this.qualityForm = {
        appNo: '',
        workTypeName: '',
        qualityName: '',
        operatorName: '',
        orgName: '',
        operatorName: '',
        createTime: '',
      };
    },
    searchSubmit() {
      this.getProblemStatistics();
      this.getQualityStatistics();
      this.getRiskStatistics();
      this.getOrgProblemStatistic();
    },
    refresh() {
      this.searchData = {
        orgNo: this.orgNo,
        dateTime: [],
      };
      this.checkIndex_1 = 0;
      this.searchSubmit();
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    searchServiceList() {
      console.log('查询服务问题:', this.serviceForm);
      this.getRiskStatisticsList();
    },
    //二级页面各单位质量情况
    getOrgProblemStatistic() {
      let params = {
        ...this.searchData,
        ...{ pageIndex: this.pageIndex, pageSize: this.pageSize },
      };
      this.loading = true;
      // demo
      API.getOrgProblemStatistic(params)
        .then((res) => {
          this.loading = false;
          const { DTS, RT_F, RT_D } = res.data;
          if (RT_F == 1 && DTS) {
            //   this.form = res.data.DTS;
            this.columns = res.data.DTS.paramList;
            this.tableData = res.data.DTS.fromData;
            this.tableCount = DTS?.totalCount;
            console.log(res.data.DTS, 'res.data.DTS');
          } else {
            // return this.$alert(res.data.RT_D, "提示", {
            //   type: "error",
            // });
            this.$message.error(`${RT_D}`);
          }
        })
        .catch(() => {
          this.loading = false;
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
    // 跳转对话框
    goPerson(data) {
      console.log(data, '跳转对话框');
    },

    // 二级页面各单位质量情况导出
    newExportClick() {
      if (!this.tableData.length) {
        return this.$message.error('暂无数据可以导出!');
      }
      this.exportClick();
    },
    exportClick() {
      let exportClickparams = {
        orgNo: this.searchData.orgNo,
        dateTime: this.searchData.dateTime,
        // pageIndex: this.pageIndex,
        // pageSize: this.pageSize,
      };
      var form = document.createElement('form');
      form.style.display = 'none';
      form.action = '/safemanage-evaluation/problemMonitoring/orgProblemStatisticExport';
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
      // this.exportClickparams.exporturl =
      //   "/superviseHandle/superviseExport";
      // this.newexportVisible = true;
    },

    //二级页面问题统计
    getProblemStatistics() {
      let params = { ...this.searchData };
      API.getProblemStatistics(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          console.log(res.data.DTS, 'getProblemStatistics => res.data.DTS');
          this.statQualityNUmData = res.data.DTS.qualityNUm;
          this.statRiskNumData = res.data.DTS.riskNum;
          this.barConfig.barX = res.data.DTS.orgName;
          this.changeBarData();
          this.initCharts();
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },

    //二级页面质量问题统计
    getQualityStatistics() {
      let params = { ...this.searchData };
      // demo
      API.getQualityStatistics(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          let arr = res.data.DTS || [],
            arr1 = [[], [], []];
          arr.forEach((item) => {
            arr1[0].push(item.typeName);
            arr1[1].push(parseFloat(item.rate.replace('%', '')));
            arr1[2].push(item.rate);
          });
          this.qualityProgressList = [...arr1];
          console.log(res.data.DTS, 'res.data.DTS');
          this.initCharts();
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },

    //二级页面质量问题列表
    getQualityStatisticsList() {
      let params = { ...this.qualityForm };
      // demo
      API.getQualityStatisticsList(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.qualityList = res.data.DTS.data;
          console.log(res.data.DTS, 'res.data.DTS');
          this.initCharts();
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },

    //二级页面风险防范统计
    getRiskStatistics() {
      // demo
      let params = { ...this.searchData };
      API.getRiskStatistics(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.pieConfig.data.forEach((item, index) => {
            item.name = DTS?.[index]?.typeName ?? 0;
            item.value = DTS?.[index]?.riskNum ?? 0;
            item.percent = DTS?.[index]?.rate ?? 0;
          });
          console.log(this.pieConfig.data, 'this.pieConfig.data');
          this.workProblemsPieList = res.data.DTS;
          console.log(res.data.DTS, 'res.data.DTS');
          this.initCharts();
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },

    //二级页面风险问题列表
    getRiskStatisticsList() {
      let params = { ...this.serviceForm };
      // demo
      API.getRiskStatisticsList(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.serviceList = res.data.DTS.data;
          console.log(res.data.DTS, 'res.data.DTS');
          this.initCharts();
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },

    resetServiceForm() {
      this.serviceForm = {
        sourceName: '',
        judgePersonName: '',
        orgName: '',
        content: '',
        time: '',
      };
    },

    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    exportData() {
      this.$message.success('导出成功！');
    },
  },
};
</script>

<style scoped lang="scss">
.new-safeweb-web {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    .form-box {
      margin-bottom: 20px;
      border-radius: 4px;
      background: #fff;
      display: flex;
      padding: 0 10px;
      .el-row {
        flex: 1;
        overflow: auto;
        padding: 20px 0;
        display: flex;
        margin: 0 !important;
        .barChartRoot,
        .PieCenter,
        .chart-container {
          height: 240px;
        }
        .el-col {
          & > h3 {
            height: 24px;
            color: #009883;
            font-size: 16px;
            line-height: 24px;
            font-weight: 700;
            margin-bottom: 16px;
          }
        }
        .el-col:nth-child(1) {
          min-width: 992px;
          .lineTitel_tiem {
            padding: 0;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            .time_1 {
              background: #efefef;
              border-radius: 12px;
              .checkTimeName_1 {
                border-radius: 12px;
              }
            }
          }
        }
        .el-col:nth-child(2) {
          min-width: 400px;
        }
        .el-col:nth-child(3) {
          min-width: 400px;
        }
      }
    }
    .title-com {
      border-radius: 4px 4px 0 0;
    }
    .cardboxpd {
      border-radius: 0 0 4px 4px;
      margin-bottom: 20px;
    }
  }
}
#app {
  font-family: 'Microsoft YaHei', sans-serif;
}

.ring-data {
  display: flex;
  // flex-grow: 1;
}

.PieCenter {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background: rgba(2, 155, 130, 0.03);
  .chartPie {
    width: 200px;
    #work-problems-pie {
      height: 240px;
      width: 100%;
    }
  }
  .chart-legend {
    height: 105px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .legend-item {
      // width: 275px;
      background-color: #f1fffa;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // padding: 20px 10px;
      .legend-title {
        background-color: white;
        display: flex;
        align-items: center;
        // margin-right: 12px;
        .legend-color {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .legend-name {
          display: flex;
          justify-content: center;
          justify-items: center;
          // text-align: center;
          font-size: 12px;
          font-weight: 400;
          color: #3d3d3d;
        }
      }
    }
  }
}

.chart-container {
  // background-image: url("~@/assets/iconfont/icon/本日生成背景.svg");
  // background-size: cover;
  // background-position: center;
  // background-repeat: no-repeat;
  background: rgba(2, 155, 130, 0.03);
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  overflow-y: auto;
  display: flex;
  -ms-overflow-style: none;
  scrollbar-width: none;
  align-items: center;
  padding: 20px;
  .chart-box {
    width: 100%;
    height: 100%;
    display: flex;
    .chart-box-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: space-between;
      & > div {
        height: 18px;
        line-height: 18px;
        width: 100%;
      }
      &:nth-child(1) {
        margin-right: 20px;
        div {
          text-align: right;
          color: #3d3d3d;
          max-width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      &:nth-child(2) {
        flex: 1;
        & > div {
          width: 100%;
        }
        .el-progress {
          width: 100%;
        }
      }
      &:nth-child(3) {
        margin-left: 20px;
        div {
          max-width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        span {
          color: #3d3d3d;
          font-weight: 700;
        }
      }
    }
  }
}
.chart-container::-webkit-scrollbar {
  display: none;
}

.chart-container h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.chartPie {
  display: flex;
}

.table-container {
  background: white;
  border-radius: 4px;
  padding: 20px 0;
  .title-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 0 20px;
    & > h3 {
      color: #009883;
      font-size: 16px;
      font-weight: 700;
    }
    .el-button {
      border: 2px dashed #dee0e6;
    }
  }
  .table-box {
    flex: 1;
  }
}

.el-table th {
  background-color: #e6f7ff !important;
  color: #333;
  font-weight: normal;
}

.el-table .cell {
  word-break: normal;
}

.dialog-content {
  max-height: 500px;
  overflow-y: auto;
}

.lineTitel_tiem {
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .time_1 {
    display: flex;
    justify-content: space-between;
    width: 186px;
    height: 24px;
    background: rgba(255, 255, 255, 1);
    border-radius: $border-radio-md;
  }

  .timeName_1 {
    font-size: 12px;
    width: 60px;
    height: 24px;
    padding: 0 6px;
    text-align: center;
    line-height: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #7b807e;
    cursor: pointer;
  }

  .checkTimeName_1 {
    width: 50px;
    padding: 0 6px;
    height: 24px;
    background: #2ba174;
    /* box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16); */
    border-radius: $border-radio-md;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 24px;
    cursor: pointer;
  }
}
</style>
