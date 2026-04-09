<template>
  <div class="style-table">
    <div class="cardbox table-wrap">
      <el-table
        v-if="tableData.length"
        :key="JSON.stringify(columns)"
        ref="multipleTable"
        :data="tableData"
        border
        header-cell-class-name="table-header"
        height="100%"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
          <span slot-scope="{ $index }">{{ (pageIndexNew - 1) * pageSizenNew + $index + 1 }}</span>
        </el-table-column>
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
            <template slot-scope="s">
              <!-- <span v-if="getFlag(s.row, child)" :class="child.classStyle"
                    >{{ s.row[child.prop]
                    }}<span v-if="child.label.indexOf('率') !== -1">%</span>
                  </span> -->
              <span
                >{{ s.row[item.prop] }}<span v-if="item.label.indexOf('率') !== -1">%</span></span
              >
            </template>
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
                <template slot-scope="s">
                  <!-- <span v-if="getFlag(s.row, child)" :class="child.classStyle"
                    >{{ s.row[child.prop]
                    }}<span v-if="child.label.indexOf('率') !== -1">%</span>
                  </span> -->
                  <span
                    >{{ s.row[child.prop]
                    }}<span v-if="child.label.indexOf('率') !== -1">%</span></span
                  >
                </template>
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
    <el-pagination
      v-if="isPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="pageSizenNew"
      :current-page.sync="pageIndexNew"
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
    //是否需要分页，默认有
    isPage: {
      type: Boolean,
      default: true,
    },
    //表头数据
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
    };
  },
  computed: {
    getFlag() {
      return (row, child) => {
        let flag = false;
        if (child.expression) {
          switch (child.expression.type) {
            case 1:
              flag = row[child.prop] < child.expression.num;
              break;
          }
        }
        return child.classStyle && flag;
      };
    },
  },
  mounted() {
    console.log('11111111111111111this.tableData', this.tableData);
    console.log('11111111111111111this.columns', this.columns);
  },
  methods: {
    // 跳转人员画像原页面
    openOrder(data) {
      this.$emit('goPerson', data);
    },
    sizeChange(val) {
      this.pageIndexNew = 1;
      this.pageSizenNew = val;
      this.$emit('sizeChange', val);
    },
    pageChange(val) {
      this.pageIndexNew = val;
      this.$emit('pageChange', val);
    },
  },
};
</script>

<style lang="scss" scoped>
.nullData {
  min-height: 300px;
}
.style-table {
  .color-red {
    color: #da6e5e;
  }
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .el-pagination {
    margin-top: 20px;
    padding-right: 20px;
  }
  .manage-main-pagination {
    margin-top: 20px;
  }
  .table-wrap {
    flex: 1;
    .el-table {
      width: 100%;
    }
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
