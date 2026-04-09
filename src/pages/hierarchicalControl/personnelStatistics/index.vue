<template>
  <el-container class="new-safeweb-web">
    <base-title-table title="人员情况统计">
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
    <el-header class="cardbox-pd0" style="padding: 0 20px">
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
          <el-form-item label="人员" prop="personName" class="form-item-new">
            <el-input
              v-model="searchData.personName"
              class="input-box"
              placeholder="请输入"
              name="searchData.processPerson"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="专业" class="form-item-new">
            <el-select
              v-model="searchData.professional"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in professionals"
                :key="index"
                :label="item.NAME"
                :value="item.VALUE"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员类型" class="form-item-new">
            <el-select v-model="searchData.personType" filterable clearable placeholder="请选择">
              <el-option
                v-for="(item, index) in personTypes"
                :key="index"
                :label="item.NAME"
                :value="item.VALUE"
              >
              </el-option>
            </el-select>
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
              @click="searchSubmitClick"
              >查 询
            </el-button>
          </div>
        </div>
      </el-form>
    </el-header>
    <!-- 头 end -->
    <el-main class="cardbox manage-main" style="padding: 0">
      <div class="main">
        <div class="main-box1">
          <h4 class="new-base-title">人员情况</h4>
          <div class="main-box1-content">
            <div class="main-box1-content-left">
              <img src="@/assets/images/hierarchicalControl/person1.png" alt="" />
            </div>
            <div class="main-box1-content-right">
              <div class="personCont">
                <div class="personCont-img">
                  <img src="@/assets/images/hierarchicalControl/person2.png" alt="" />
                </div>
                人员总数:
                <span class="personCont-num">{{ editData.totalCount }}</span>
              </div>
              <div class="personNum">
                <div class="personNum-left">
                  <div>
                    <span>{{ editData.mainBusinessCount }}</span>
                    主业人员
                  </div>
                  <div>
                    <span>{{ editData.outsourcedCount }}</span>
                    外包人员
                  </div>
                </div>
                <div class="personNum-right">
                  <div>
                    <span>{{ editData.managerCount }}</span>
                    管理人员
                  </div>
                  <div>
                    <span>{{ editData.workerCount }}</span>
                    作业人员
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-box2">
          <h4 class="new-base-title">专业分布</h4>
          <div class="main-box2-content">
            <gauge-chart v-if="gaugeData.length > 0" :bar-data="gaugeData"></gauge-chart>
          </div>
        </div>
        <div class="main-box3">
          <h4 class="new-base-title">问题情况</h4>
          <div class="main-box3-content">
            <barChart barchart-id="perBarchart" :config="barConfig"></barChart>
          </div>
        </div>
        <div class="main-box4">
          <h4 class="new-base-title">学习情况</h4>
          <div class="main-box4-content">
            <div>
              <div class="img">
                <img src="@/assets/images/hierarchicalControl/person3.png" alt="" />
              </div>
              培训次数
              <span>{{ studyData.trainingTimes || 0 }}</span>
            </div>
            <div>
              <div class="img">
                <img src="@/assets/images/hierarchicalControl/person4.png" alt="" />
              </div>
              学习时长
              <span>{{ studyData.studyTime || 0 }} h</span>
            </div>
            <div>
              <div class="img">
                <img src="@/assets/images/hierarchicalControl/person5.png" alt="" />
              </div>
              答题数
              <span>{{ studyData.answerNum || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-main class="cardbox-pd0 manage-main">
      <div class="table">
        <div class="table-title">
          <div class="new-base-title process-title mb-10">人员清单</div>
          <div>
            <el-button class="el-btn-new reset-btn" size="small" @click="newExportClick">
              <i class="iconfont icon-daochu1"></i>
              导出
            </el-button>
          </div>
        </div>
        <div class="table-box">
          <personTable
            :table-data="tableData"
            :table-count="tableCount"
            :page-index="pageIndex"
            :page-size="pageSize"
            @goPerson="goPerson"
            @sizeChange="sizeChange"
            @pageChange="pageChange"
          ></personTable>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BaseTitleTable from '@/components/common/form/base-title-table/index.vue';
import personTable from './components/personTable.vue';
import barChart from '../order/components/barChart.vue';
import gaugeChart from './components/gaugeChart.vue';
import API from '@/api/hierarchicalControl/personnelStatistics.js';

export default {
  name: 'PersonnelStatistics',
  components: {
    BaseTitleTable,
    personTable,
    barChart,
    gaugeChart,
  },
  data() {
    return {
      orgId: '', // 单位ID
      professionals: [
        // 专业下拉数据
        {
          NAME: '计量',
          VALUE: '01',
        },
        {
          NAME: '采集',
          VALUE: '02',
        },
        {
          NAME: '反窃查违',
          VALUE: '04',
        },
        {
          NAME: '线损',
          VALUE: '03',
        },
      ],
      personTypes: [
        // 人员类型下拉数据
        {
          NAME: '主业',
          VALUE: '02',
        },
        {
          NAME: '外包',
          VALUE: '01',
        },
      ],
      searchData: {
        // 查询条件合集
        personName: '',
        professional: [],
        personType: '',
        dateTime: [],
      },
      tableData: [], // 表格数据
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,

      editData: {}, // 人员情况数据
      gaugeData: [
        // 专业分布数据
        {
          businessProfTypeCode: '01',
          totalCount: 0,
        },
        {
          businessProfTypeCode: '02',
          totalCount: 0,
        },
        {
          businessProfTypeCode: '03',
          totalCount: 0,
        },
        {
          businessProfTypeCode: '04',
          totalCount: 0,
        },
      ],
      studyData: {}, // 学习情况数据
      barConfig: {
        // 柱状图数据
        nameY: '单位（个）',
        grid: {
          left: 50,
          right: 20,
          bottom: 30,
          top: 40,
        },
        barData: [
          {
            name: '问题数',
            value: [0, 0, 0],
          },
        ],
        barX: ['风险问题', '质量问题', '规范性问题'],
        customColors: [['#F98A23', '#FCD9B9']],
        barMaxWidth: 15,
        right: true,
      },
    };
  },
  mounted() {
    let data = this.$route.query || {};
    this.orgId = data.orgId ? data.orgId : this.$store.state.UserData.orgId; // 保留一开始进来的单位id
    this.searchData.dateTime = data.timeData ? data.timeData : [];

    this.getInfo();
    this.geBusinessType();
    this.geQueryProblemSituation();
    this.getStudySituation();
    this.searchSubmit();
  },
  methods: {
    // 获取人员情况数据
    getInfo() {
      let params = {
        peopleNature: '',
        personName: '',
        orgNo: this.orgId, // 需要首页传参
        businessProfType: '',
      };
      API.info(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.editData = DTS;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取专业分布数据
    geBusinessType() {
      let params = {
        orgNo: this.orgId,
        peopleNature: '',
        personName: '',
        businessProfType: '',
      };
      API.businessType(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          if (DTS.length > 0) {
            this.gaugeData = DTS;
          }
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取问题情况数据
    geQueryProblemSituation() {
      let params = {
        orgNo: this.orgId,
        peopleNature: this.searchData.personType,
        personName: this.searchData.personName,
        businessProfType: this.searchData.professional?.join(','),
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.queryProblemSituation(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.barConfig.barX = DTS?.xaxis;
          this.barConfig.barData[0].value = DTS?.yaxis;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 获取学习情况数据
    getStudySituation() {
      let params = {
        orgNo: this.orgId,
        peopleNature: this.searchData.personType,
        personName: this.searchData.personName,
        businessProfType: this.searchData.professional?.join(','),
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.studySituation(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.studyData = DTS;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    refresh() {
      this.searchData = {
        personName: '',
        professional: [],
        personType: '',
        dateTime: [],
      };
      this.pageIndex = 1;
      this.pageSize = 10;
      this.geQueryProblemSituation();
      this.getStudySituation();
      this.searchSubmit();
    },
    searchSubmitClick() {
      this.geQueryProblemSituation();
      this.getStudySituation();
      this.searchSubmit(true);
    },
    // 获取表格数据
    searchSubmit(searchClcik) {
      if (searchClcik) {
        this.pageIndex = 1;
        this.pageSize = 10;
      }
      let params = {
        peopleNature: this.searchData.personType,
        personName: this.searchData.personName,
        orgNo: this.orgId,
        businessProfType: this.searchData.professional?.join(','),
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };
      API.selectList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tableData = DTS?.data;
          this.tableCount = DTS?.totalCount;
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
    // 跳转人员画像
    goPerson(data) {
      this.$router.push({
        path: '/fiveDimensionEvaluation/workerCapabilityProfile',
        query: {
          userId: data.recordId,
          orgNo: data.orgNo,
        },
      });
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
        peopleNature: this.searchData.personType,
        personName: this.searchData.personName,
        orgNo: this.orgId,
        businessProfType: this.searchData.professional?.join(','),
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
        pageIndex: 1,
        pageSize: 99999,
      };
      var form = document.createElement('form');
      form.style.display = 'none';
      form.action = '/safemanage-evaluation/personStats/personInfoExport'; // 测试时需要改动
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
    // 返回
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: space-between;
  height: 260px;
  background-color: rgba(0, 0, 0, 0);
  & > div {
    padding: 20px;
    background-color: #ffff;
    .main-box1-content {
      width: 594px;
      height: 190px;
      margin-top: 12px;
      border-radius: 6px;
      background: linear-gradient(180deg, #dcfcf6 0%, #e8fcf4 96%);
      display: flex;
      align-items: center;
      .main-box1-content-left {
        width: 185px;
        height: 185px;
        margin-right: 12px;
      }
      .main-box1-content-right {
        border-radius: 3px;
        padding: 16px;
        background-color: #ffff;
        .personCont {
          display: flex;
          font-size: 20px;
          font-weight: bold;
          line-height: 20px;
          margin-bottom: 12px;
          align-items: flex-end;
          .personCont-img {
            width: 32px;
            height: 24px;
            margin-right: 12px;
          }
          .personCont-num {
            font-size: 28px;
            font-weight: bold;
            line-height: 28px;
            color: #029b82;
            margin-left: 12px;
          }
        }
        .personNum {
          display: flex;
          justify-content: space-between;
          & > div {
            width: 172px;
            height: 72px;
            border-radius: 3px;
            display: flex;
            justify-content: space-around;
            div {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-evenly;
              font-size: 14px;
              font-weight: 500;
              line-height: 14px;
              color: #666666;
            }
            span {
              font-size: 24px;
              font-weight: bold;
              line-height: 24px;
              color: #029b82;
            }
          }
          .personNum-left {
            background: #ebfbfd;
            margin-right: 12px;
          }
          .personNum-right {
            background: rgba(2, 155, 130, 0.06);
          }
        }
      }
    }
    .main-box2-content {
      width: 440px;
      height: 190px;
      border-radius: 6px;
      margin-top: 12px;
      background: rgba(2, 155, 130, 0.03);
    }
    .main-box3-content {
      width: 460px;
      height: 190px;
      border-radius: 6px;
      margin-top: 12px;
      background: rgba(2, 155, 130, 0.03);
    }
    .main-box4-content {
      width: 246px;
      height: 190px;
      border-radius: 6px;
      margin-top: 12px;
      padding: 24px;
      background-image: url('~@/assets/images/hierarchicalControl/person6.png');
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      & > div {
        display: flex;
        align-items: center;
        font-size: 14px;
        div {
          width: 32px;
          height: 32px;
          margin-right: 12px;
          border-radius: 8px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        span {
          font-size: 16px;
          font-weight: bold;
          margin-left: 6px;
        }
      }
    }
  }
}
.cardbox-pd0 {
  overflow: auto;
}
.bar-main {
  padding: 20px;
  height: 330px;
}
.table {
  padding: 20px;
  .table-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
}
</style>
