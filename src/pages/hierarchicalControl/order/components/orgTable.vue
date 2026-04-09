<template>
  <div class="cardbox box-shadow-normal table-wrap">
    <el-table
      v-if="tableData.length"
      ref="multipleTable"
      :data="tableData"
      header-cell-class-name="table-header"
      height="100%"
      style="width: 100%"
    >
      <!-- 第一大类：基础信息 -->
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column prop="orgName" label="单位" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <div v-if="canClick(scope)" style="cursor: pointer" @click="changeOrg(scope)">
            {{ scope.row['orgName'] }}
          </div>
          <div v-else>
            {{ scope.row['orgName'] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pendingCount" label="待办总数" align="center">
        <template slot-scope="scope">
          <div
            v-if="Number(scope.row['pendingCount']) > 0"
            class="greenNumNew"
            @click="openOrder(scope.row, 'pendingCount', scope.$index)"
          >
            {{ scope.row['pendingCount'] === '' ? '-' : scope.row['pendingCount'] }}
          </div>
          <div v-else>
            {{ scope.row['pendingCount'] === '' ? '-' : scope.row['pendingCount'] }}
          </div>
        </template>
      </el-table-column>
      <!-- 分隔符 -->
      <el-table-column class-name="header-group-separator" label=" " width="12"></el-table-column>

      <!-- 第二大类：工单专业类型 -->
      <el-table-column label="工单专业类型" align="center" class-name="header-group-35dec3">
        <el-table-column
          prop="measurementCount"
          label="计量"
          align="center"
          class-name="header-group-35dec3"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['measurementCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'measurementCount')"
            >
              {{ scope.row['measurementCount'] === '' ? '-' : scope.row['measurementCount'] }}
            </div>
            <div v-else>
              {{ scope.row['measurementCount'] === '' ? '-' : scope.row['measurementCount'] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="collectionCount"
          label="采集"
          align="center"
          class-name="header-group-35dec3"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['collectionCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'collectionCount')"
            >
              {{ scope.row['collectionCount'] === '' ? '-' : scope.row['collectionCount'] }}
            </div>
            <div v-else>
              {{ scope.row['collectionCount'] === '' ? '-' : scope.row['collectionCount'] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="antiTheftCount"
          label="反窃查违"
          align="center"
          class-name="header-group-35dec3"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['antiTheftCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'antiTheftCount')"
            >
              {{ scope.row['antiTheftCount'] === '' ? '-' : scope.row['antiTheftCount'] }}
            </div>
            <div v-else>
              {{ scope.row['antiTheftCount'] === '' ? '-' : scope.row['antiTheftCount'] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="lineLossCount"
          label="线损"
          align="center"
          class-name="header-group-35dec3"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['lineLossCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'lineLossCount')"
            >
              {{ scope.row['lineLossCount'] === '' ? '-' : scope.row['lineLossCount'] }}
            </div>
            <div v-else>
              {{ scope.row['lineLossCount'] === '' ? '-' : scope.row['lineLossCount'] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="otherCount"
          label="其他"
          align="center"
          class-name="header-group-35dec3"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['otherCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'otherCount')"
            >
              {{ scope.row['otherCount'] === '' ? '-' : scope.row['otherCount'] }}
            </div>
            <div v-else>
              {{ scope.row['otherCount'] === '' ? '-' : scope.row['otherCount'] }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 分隔符 -->
      <el-table-column class-name="header-group-separator" label=" " width="12"></el-table-column>

      <!-- 第三大类：工单派工情况 -->
      <el-table-column label="工单派工情况" align="center" class-name="header-group-65c9fd">
        <el-table-column
          prop="dispatchedCount"
          label="已派发"
          align="center"
          class-name="header-group-65c9fd"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['dispatchedCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'dispatchedCount')"
            >
              {{ scope.row['dispatchedCount'] === '' ? '-' : scope.row['dispatchedCount'] }}
            </div>
            <div v-else>
              {{ scope.row['dispatchedCount'] === '' ? '-' : scope.row['dispatchedCount'] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="autoDispatchCount"
          label="自动"
          align="center"
          class-name="header-group-65c9fd"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['autoDispatchCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'autoDispatchCount')"
            >
              {{ scope.row['autoDispatchCount'] === '' ? '-' : scope.row['autoDispatchCount'] }}
            </div>
            <div v-else>
              {{ scope.row['autoDispatchCount'] === '' ? '-' : scope.row['autoDispatchCount'] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="manualDispatchCount"
          label="手动"
          align="center"
          class-name="header-group-65c9fd"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['manualDispatchCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'manualDispatchCount')"
            >
              {{ scope.row['manualDispatchCount'] === '' ? '-' : scope.row['manualDispatchCount'] }}
            </div>
            <div v-else>
              {{ scope.row['manualDispatchCount'] === '' ? '-' : scope.row['manualDispatchCount'] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="undispatchedCount"
          label="未派发"
          align="center"
          class-name="header-group-65c9fd"
        >
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['undispatchedCount']) > 0"
              class="greenNum"
              @click="openOrder(scope.row, 'undispatchedCount')"
            >
              {{ scope.row['undispatchedCount'] === '' ? '-' : scope.row['undispatchedCount'] }}
            </div>
            <div v-else>
              {{ scope.row['undispatchedCount'] === '' ? '-' : scope.row['undispatchedCount'] }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 分隔符 -->
      <el-table-column class-name="header-group-separator" label=" " width="12"></el-table-column>

      <!-- 第四大类：工单指标 -->
      <el-table-column label="工单指标" align="center" class-name="header-group-009b83">
        <el-table-column
          prop="directDispatchRate"
          label="工单直派率"
          align="center"
          class-name="header-group-009b83"
        >
          <template slot-scope="scope">
            <div>
              {{ `${scope.row['directDispatchRate'] ? scope.row['directDispatchRate'] : 0}%` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="completionRate"
          label="工单完成率"
          align="center"
          class-name="header-group-009b83"
        >
          <template slot-scope="scope">
            <div>
              {{ `${scope.row['completionRate'] ? scope.row['completionRate'] : 0}%` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="timelyRate"
          label="工单及时率"
          align="center"
          class-name="header-group-009b83"
        >
          <template slot-scope="scope">
            <div>
              {{ `${scope.row['timelyRate'] ? scope.row['timelyRate'] : 0}%` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="overdueRate"
          label="工单超期率"
          align="center"
          class-name="header-group-009b83"
        >
          <template slot-scope="scope">
            <div>
              {{ `${scope.row['overdueRate'] ? scope.row['overdueRate'] : 0}%` }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <nullData v-else style="height: 300px; weight: 100%" />
  </div>
</template>

<script>
import nullData from '@/components/common/form/nullData.vue';
export default {
  name: 'OrgTable',
  components: {
    nullData,
  },
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // tableData: [
      //   {
      //     unit: "上海市",
      //     orgId: "1",
      //     parentId: "0",
      //     FUNC_TYPE: "01",
      //     pendingCount: 111,
      //   },
      //   {
      //     unit: "本级",
      //     orgId: "1",
      //     parentId: "",
      //     FUNC_TYPE: "01",
      //     pendingCount: 0,
      //   },
      //   {
      //     unit: "浦东区",
      //     orgId: "11",
      //     parentId: "1",
      //     FUNC_TYPE: "02",
      //     pendingCount: 0,
      //   },
      //   {
      //     unit: "长宁区",
      //     orgId: "12",
      //     parentId: "1",
      //     FUNC_TYPE: "06",
      //     pendingCount: 0,
      //   },
      // ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 判断是否可以点击
    canClick(scope) {
      let funcTypes = ['01', '02', '03', '04', '05'];
      const row = scope.row;
      // 第二行不能点 (scope.$index === 1)
      if (scope.$index === 1) {
        return false;
      }
      // 没有parentId不能点
      if (!row.parentId) {
        return false;
      }
      // FUNC_TYPE为06(所)以下的不能点
      if (!funcTypes.includes(row.funcType)) {
        return false;
      }
      // 最只能看到自己这一级
      if (row.orgNo == this.$store.state.UserData.orgId) {
        return false;
      }
      // 其他情况可以点击
      return true;
    },
    // 跳转工单中心
    openOrder(data, columnName, index) {
      this.$emit('openOrder', data, columnName, index + '');
    },
    // 下钻上钻
    changeOrg(scope) {
      console.log(scope, '单位点击行数据');
      // 第一条能点的话是上钻
      if (scope.$index == 0) {
        this.$emit('changeOrg', scope.row.parentId);
      } else {
        this.$emit('changeOrg', scope.row.orgNo);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.header-group-separator) {
  background-color: #fff !important;
}
:deep(th.header-group-35dec3) {
  background: rgba(53, 222, 195, 0.1) !important;
}
:deep(th.header-group-65c9fd) {
  background: rgba(101, 201, 253, 0.1) !important;
}
:deep(th.header-group-009b83) {
  background: rgba(0, 155, 131, 0.1) !important;
}
</style>
<style lang="scss" scoped>
.greenNumNew {
  color: #009b83;
  cursor: pointer;
}
.redNum {
  color: $color-error;
}
</style>
