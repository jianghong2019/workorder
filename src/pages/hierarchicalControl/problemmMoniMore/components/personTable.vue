<template>
  <div class="table-b">
    <div class="cardbox box-shadow-normal">
      <el-table
        v-if="tableData.length"
        :key="tableData.length"
        ref="multipleTable"
        :data="tableData"
        border
        header-cell-class-name="table-header"
        height="100%"
      >
        <template v-for="item in columns">
          <!-- :key="item.RECORD_ID" 后续获取唯一添加-->
          <el-table-column
            v-if="!item.children"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
            :min-width="item.width"
            align="center"
          >
          </el-table-column>

          <el-table-column
            v-if="item.children"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
            :min-width="item.width"
            align="center"
          >
            <template>
              <el-table-column
                v-for="child in item.children"
                :key="child.prop"
                :prop="child.prop"
                :label="child.label"
                :width="child.width"
                align="center"
                show-overflow-tooltip
                :min-width="child.width"
              >
                <!-- <template slot-scope="s">
                <span
                  v-if="item.children && item.prop === 'qualityQuestion'"
                  @click="openQualityDialog(s.row, s.row[child.prop])"
                  :style="{
                    color: s.row[child.prop] > 0 ? '#f56c6c' : null,
                    cursor: 'pointer',
                  }"
                  >{{ s.row[child.prop] }}</span
                >
                <span
                  v-if="item.children && item.prop === 'riskQuestion'"
                  @click="openServiceDialog(s.row, s.row[child.prop])"
                  :style="{
                    color: s.row[child.prop] > 0 ? '##009b83' : null,
                    cursor: 'pointer',
                  }"
                  >{{ s.row[child.prop] }}</span
                >
              </template> -->
              </el-table-column>
              <el-table-column v-if="false" show-overflow-tooltip> </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <nullData v-else />
    </div>
    <!-- <el-pagination
      class="cardbox manage-main-pagination"
      v-if="tableData.length"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="pageSizenNew"
      :current-page.sync="pageIndexNew"
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
    columns: {
      type: Array,
      default: () => [],
    },
    // 表格总数
    tableCount: {
      type: Number,
      default: 0,
    },
    // 当前页
    pageIndex: {
      type: Number,
      default: 1,
    },
    // 页数
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      pageIndexNew: this.pageIndex,
      pageSizenNew: this.pageSize,
      tableList: [
        // 表头数据
        {
          prop: 'personName',
          label: '人员',
          width: '100px',
          child: [],
        },
        {
          label: '基本信息',
          width: '100px',
          child: [
            {
              prop: 'orgName',
              label: '单位',
              width: '100px',
            },
            {
              prop: 'phone',
              label: '手机号',
              width: '100px',
            },
            {
              prop: 'profession',
              label: '专业',
              width: '100px',
            },
            {
              prop: 'peopleNature',
              label: '人员类型',
              width: '100px',
            },
            {
              prop: 'extTeam',
              label: '外包队伍',
              width: '100px',
            },
            {
              prop: 'workStatus',
              label: '工作状态',
              width: '100px',
            },
          ],
        },
        {
          label: '问题情况',
          width: '100px',
          child: [
            {
              prop: 'qualityProblem',
              label: '质量问题',
              width: '100px',
            },
            {
              prop: 'standardProblem',
              label: '规范性问题',
              width: '100px',
            },
            {
              prop: 'riskProblem',
              label: '风险问题',
              width: '100px',
            },
          ],
        },
        {
          label: '人员积分',
          width: '100px',
          child: [
            {
              prop: 'workloadScore',
              label: '工作量',
              width: '100px',
            },
            {
              prop: 'workQualityScore',
              label: '工作质量',
              width: '100px',
            },
            {
              prop: 'workStandardScore',
              label: '工作规范',
              width: '100px',
            },
            {
              prop: 'workEfficiencyScore',
              label: '工作效率',
              width: '100px',
            },
            {
              prop: 'riskPreventionScore',
              label: '风险防范',
              width: '100px',
            },
          ],
        },
      ],
    };
  },
  mounted() {},
  methods: {
    // 跳转人员画像原页面
    openOrder(data) {
      this.$emit('goPerson', data);
    },
    sizeChange(val) {
      ((this.pageIndexNew = 1), (this.pageSizenNew = val), this.$emit('sizeChange', val));
    },
    pageChange(val) {
      ((this.pageIndexNew = val), this.$emit('pageChange', val));
    },
  },
};
</script>

<style lang="scss" scoped>
.table-b {
  height: 100%;
  display: flex;
  flex-direction: column;
  .nullData {
    height: 350px;
  }
  .cardbox {
    flex: 1;
  }
}
.greenNum,
.redNum {
  cursor: pointer;
}
.greenNum {
  color: $color-primary;
}
.redNum {
  color: $color-error;
}
</style>
