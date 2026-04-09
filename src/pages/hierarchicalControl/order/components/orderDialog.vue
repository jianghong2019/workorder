<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="工单列表"
      class="addWorkStyle"
      :visible.sync="showDialogNew"
      :destroy-on-close="false"
      :width="$dict['DIALOG_WIDTH']['LARGE']"
      @close="close"
    >
      <div>
        <el-form
          id="searchData"
          ref="searchData"
          :model="searchData"
          label-position="right"
          label-width="90px"
          class="searchData search_input"
          action="http://"
          target="stop"
        >
          <div class="flex-row-bw flex-wrap">
            <el-form-item label="单位" prop="recipientOrg" class="form-item-new form-item">
              <org-tree v-model="searchData.org" :unit-data="unitData"></org-tree>
            </el-form-item>
            <el-form-item label="日期选择" prop="dateTime" class="date-box form-item-new form-item">
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
            <el-form-item label="专业" class="form-item-new form-item">
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
            <el-form-item label="工单状态" class="form-item-new form-item">
              <el-select
                v-model="searchData.orderType"
                filterable
                multiple
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in orderTypes"
                  :key="index"
                  :label="item.NAME"
                  :value="item.VALUE"
                >
                </el-option>
              </el-select>
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
      </div>
      <el-main class="cardbox-pd0 pb-20 manage-main">
        <div class="box-shadow-normal table-wrap">
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
              <!-- :key="item.RECORD_ID" 后续获取唯一添加-->
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
              >
              </el-table-column>
            </template>
          </el-table>
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
      </el-main>
    </el-dialog>
  </div>
</template>

<script>
import OrgTree from '@/components/common/form/OrgTree.vue';

export default {
  name: 'SurpervisionAdd',
  components: {
    OrgTree,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 下拉单位数据
    unitData: {
      type: Array,
      default: () => [],
    },
    // 父级表格行数据
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showDialogNew: this.showDialog,
      professionals: [
        {
          NAME: '专业1',
          VALUE: '01',
        },
        {
          NAME: '专业2',
          VALUE: '02',
        },
      ],
      orderTypes: [
        {
          NAME: '专业1',
          VALUE: '01',
        },
        {
          NAME: '专业2',
          VALUE: '02',
        },
      ],
      searchData: {
        org: this.$store.state.UserData.orgId,
        dateTime: [],
        professional: '',
        orderType: '',
      },
      tableData: [
        {
          orderNo: '11111',
        },
      ],
      tableList: [
        {
          prop: 'orderNo',
          label: '工单编号',
          width: '100px',
        },
        {
          prop: 'orderNo',
          label: '工单编号',
          width: '100px',
        },
        {
          prop: 'orderNo',
          label: '工单编号',
          width: '100px',
        },
        {
          prop: 'orderNo',
          label: '工单编号',
          width: '100px',
        },
        {
          prop: 'orderNo',
          label: '工单编号',
          width: '100px',
        },
      ],
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,
    };
  },
  watch: {
    showDialog(newVal) {
      this.showDialogNew = newVal;
    },
  },
  mounted() {},
  methods: {
    refresh() {},
    searchSubmit() {},
    sizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.searchSubmit();
    },
    pageChange(val) {
      this.pageIndex = val;
      this.searchSubmit();
    },
    close() {
      this.showDialogNew = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-new {
  width: 30%;
}
</style>
