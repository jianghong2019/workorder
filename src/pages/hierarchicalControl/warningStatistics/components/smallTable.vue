<template>
  <div class="cardbox table-wrap">
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
          v-if="item.prop == 'needFinishTime'"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <div class="waring tabBtn">预警</div>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop == 'useRate'"
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
          v-else
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          :min-width="item.width"
        >
        </el-table-column>
      </template>
    </el-table>
    <nullData v-else style="height: 200px; weight: 100%" />
  </div>
</template>

<script>
import nullData from '@/components/common/form/nullData.vue';
export default {
  name: 'SmallTable',
  components: {
    nullData,
  },
  props: {
    // 表格详情
    table: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    // 表格数据
    tableData() {
      return this.table.tableData;
    },
    // 表头数据
    tableList() {
      return this.table.tableList;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
:deep(.tabBtn) {
  border-radius: 2px;
  font-size: 16px;
  line-height: 20px;
  padding: 4px 12px;
  text-align: center;
}
:deep(.normal) {
  background: rgba(4, 209, 104, 0.2);
  color: #04d168;
}
:deep(.waring) {
  background: rgba(255, 101, 78, 0.2);
  color: #dd604d;
}
</style>
