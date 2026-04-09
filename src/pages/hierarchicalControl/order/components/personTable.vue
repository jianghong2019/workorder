<template>
  <div>
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
        <el-table-column type="index" label="序号" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="人员" align="center"></el-table-column>
        <el-table-column prop="pendingCount" label="待办总数" align="center">
          <template slot-scope="scope">
            <div
              v-if="Number(scope.row['pendingCount']) > 0"
              class="greenNumNew"
              @click="openOrder(scope.row, 'pendingCount')"
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
            prop="autoDispatchCount"
            label="自动派发"
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
                {{
                  scope.row['manualDispatchCount'] === '' ? '-' : scope.row['manualDispatchCount']
                }}
              </div>
              <div v-else>
                {{
                  scope.row['manualDispatchCount'] === '' ? '-' : scope.row['manualDispatchCount']
                }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- 分隔符 -->
        <el-table-column class-name="header-group-separator" label=" " width="12"></el-table-column>

        <!-- 工单处理情况 -->
        <el-table-column label="工单处理情况" align="center" class-name="header-group-009b83">
          <el-table-column
            prop="processedCount"
            label="已处理"
            align="center"
            class-name="header-group-009b83"
          >
            <template slot-scope="scope">
              <div
                v-if="Number(scope.row['processedCount']) > 0"
                class="greenNum"
                @click="openOrder(scope.row, 'processedCount')"
              >
                {{ scope.row['processedCount'] === '' ? '-' : scope.row['processedCount'] }}
              </div>
              <div v-else>
                {{ scope.row['processedCount'] === '' ? '-' : scope.row['processedCount'] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="unprocessCount"
            label="未处理"
            align="center"
            class-name="header-group-009b83"
          >
            <template slot-scope="scope">
              <div
                v-if="Number(scope.row['unprocessCount']) > 0"
                class="redNum"
                @click="openOrder(scope.row, 'unprocessCount')"
              >
                {{ scope.row['unprocessCount'] === '' ? '-' : scope.row['unprocessCount'] }}
              </div>
              <div v-else>
                {{ scope.row['unprocessCount'] === '' ? '-' : scope.row['unprocessCount'] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="selfHealingCount"
            label="自愈合"
            align="center"
            class-name="header-group-009b83"
          >
            <template slot-scope="scope">
              <div
                v-if="Number(scope.row['selfHealingCount']) > 0"
                class="greenNum"
                @click="openOrder(scope.row, 'selfHealingCount')"
              >
                {{ scope.row['selfHealingCount'] === '' ? '-' : scope.row['selfHealingCount'] }}
              </div>
              <div v-else>
                {{ scope.row['selfHealingCount'] === '' ? '-' : scope.row['selfHealingCount'] }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <nullData v-else style="height: 300px; weight: 100%" />
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
  </div>
</template>

<script>
import nullData from '@/components/common/form/nullData.vue';
export default {
  name: 'PersonTable',
  components: {
    nullData,
  },
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => [],
    },
    tableCount: {
      type: Number,
      default: 0,
    },
    pageIndex: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // 跳转工单中心
    openOrder(data, columnName) {
      this.$emit('openOrder', data, columnName);
    },
    sizeChange(val) {
      this.$emit('sizeChange', val);
    },
    pageChange(val) {
      this.$emit('pageChange', val);
    },
  },
};
</script>

<style lang="scss" scoped>
.greenNumNew {
  color: #009b83;
  cursor: pointer;
}
.redNum {
  color: $color-error;
}

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
