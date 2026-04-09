<template>
  <div class="big-table">
    <div class="table-wrap">
      <el-table
        v-if="tableData.length"
        ref="multipleTable"
        :data="tableData"
        border
        header-cell-class-name="table-header"
        height="100%"
        style="width: 100%"
      >
        <template v-for="item in tableList">
          <!-- :key="item.RECORD_ID" 后续获取唯一添加-->
          <el-table-column
            v-if="redTableList.includes(item.prop)"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <!-- 红色高亮 -->
              <div v-if="Number(scope.row[item.prop]) > 0" class="redNum">
                <!-- 红色可点击按钮 -->
                <div
                  v-if="clickTableList.includes(item.prop)"
                  class="clickBtn"
                  @click="openOrder(item.prop, scope.row)"
                >
                  {{ scope.row[item.prop] === '' ? '-' : scope.row[item.prop] }}
                </div>
                <div v-else>
                  {{ scope.row[item.prop] === '' ? '-' : scope.row[item.prop] }}
                </div>
              </div>
              <div v-else>
                {{ scope.row[item.prop] === '' ? '-' : scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="addIconList.includes(item.prop)"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <div>{{ scope.row[item.prop] }}%</div>
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
      <nullData v-else style="height: 100%; weight: 100%" />
    </div>
    <!-- <el-pagination
      class="cardbox manage-main-pagination"
      v-if="tableData.length"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="pageSize"
      :current-page.sync="pageIndex"
      layout="total, prev, pager, next, sizes, jumper"
      background
      :total="tableCount"
      @size-change="sizeChange"
      @current-change="pageChange"
    >
    </el-pagination> -->
  </div>
</template>

<script>
import nullData from '@/components/common/form/nullData.vue';
import API from '@/api/hierarchicalControl/warningStatistics.js';
export default {
  name: 'BigTable',
  components: {
    nullData,
  },
  props: {
    // 父级单位ID
    orgId: {
      type: String,
      default: '',
    },
    // 标识符
    index: {
      type: Number,
      default: 0,
    },
    // 时间范围标识符
    dateRange: {
      type: String,
      default: '04',
    },
  },
  data() {
    return {
      redTableList: [
        // 需要判断红色字体的列
        'warningCount',
        'indicatorNum',
        'capacityNum',
        'riskNum',
        'orderOverdueNum',
        'qualityNum',
        'timeoutNum',
      ],
      clickTableList: [
        // 需要判断红色字体且能点击的列
        'indicatorNum',
        'capacityNum',
        'riskNum',
        'orderOverdueNum',
        'qualityNum',
        'timeoutNum',
      ],
      addIconList: [
        // 需要加百分号的列
        'finishRate',
        'overdueRate',
        'standardRate',
        'relapseRate',
      ],
      tableData: [], // 表格数据
      tableList1: [
        // 表头数据
        {
          prop: 'personName',
          label: '人员',
          width: '110px',
        },
        {
          prop: 'warningCount',
          label: '预警总数',
          width: '100px',
        },
        {
          prop: 'indicatorNum',
          label: '质效预警',
          width: '100px',
        },
        {
          prop: 'capacityNum',
          label: '承载力预警',
          width: '120px',
        },
        {
          prop: 'riskNum',
          label: '风险预警',
          width: '100px',
        },
        {
          prop: 'orderOverdueNum',
          label: '超期预警',
          width: '100px',
        },
        {
          prop: 'qualityNum',
          label: '质量偏差',
          width: '100px',
        },
        {
          prop: 'timeoutNum',
          label: '作业超时',
          width: '100px',
        },
      ],
      tableList2: [
        // 表头数据
        {
          prop: 'personName',
          label: '人员',
          width: '110px',
        },
        {
          prop: 'finishNum',
          label: '完成数',
          width: '90px',
        },
        {
          prop: 'finishRate',
          label: '完成率',
          width: '90px',
        },
        {
          prop: 'overdueNum',
          label: '超期数',
          width: '90px',
        },
        {
          prop: 'overdueRate',
          label: '超期率',
          width: '90px',
        },
        {
          prop: 'violationNum',
          label: '规范数',
          width: '90px',
        },
        {
          prop: 'standardRate',
          label: '规范率',
          width: '90px',
        },
        {
          prop: 'relapseNum',
          label: '复发数',
          width: '90px',
        },
        {
          prop: 'relapseRate',
          label: '复发率',
          width: '90px',
        },
      ],
      // tableCount: 0,
      // pageIndex: 1,
      // pageSize: 10,
    };
  },
  computed: {
    tableList() {
      return this.index === 0 ? this.tableList2 : this.tableList1;
    },
    newOrgId() {
      return this.orgId || this.$store.state.UserData.orgId;
    },
  },
  watch: {
    dateRange: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) this.getTableData();
      },
    },
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 打开弹窗 只有第一行且字体为红色的才能点击
    openOrder(prop, rowData) {
      const names = {
        indicatorNum: '质效',
        capacityNum: '承载力',
        riskNum: '风险',
        orderOverdueNum: '工单超期',
        qualityNum: '质量偏差',
        timeoutNum: '作业超时',
      };
      // names[prop]-弹窗标题名 "01"-表格点击标识
      this.$emit('openOrder', names[prop], '01', rowData.propertyId);
    },
    async getTableData() {
      let params = {
        orgNo: this.newOrgId, // 需要首页传参
        dateRange: this.dateRange, // 开发测试数据
        current: 1,
        pageSize: 999,
      };
      let res = {};
      if (this.index === 0) {
        res = await API.personOrderMetric(params);
      } else {
        res = await API.personWarningSituation(params);
      }
      const { RT_F, RT_D, DTS } = res.data;
      if (RT_F == 1 && DTS) {
        this.tableData = DTS;
      } else {
        this.$message.error(`${RT_D}`);
      }
    },
    // sizeChange(val) {
    //   this.pageSize = val;
    //   this.pageIndex = 1;
    // },
    // pageChange(val) {
    //   this.pageIndex = val;
    // },
  },
};
</script>

<style lang="scss" scoped>
.big-table {
  height: 99%;
  .table-wrap {
    height: 100%;
  }
}
.redNum {
  color: $color-error;
}
.clickBtn {
  cursor: pointer;
}
</style>
