<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="暂停接单记录详情"
      class="pauseReceptWorkOrderConfigEdit"
      :visible.sync="showDialog"
      :destroy-on-close="false"
      width="680px"
      @close="close"
    >
      <div class="">
        <!-- <div class="new-base-title mb-10">基本信息</div> -->
        <el-form
          class="el-form-left-follow"
          label-position="right"
          label-width="130px"
          label-suffix=" :"
        >
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="记录编号">{{ detailData.stopOrderNo || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属单位">{{ detailData.orgName || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="人员姓名">{{ detailData.creatorName || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="申请时间">{{ detailData.createTime || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="计划暂停时间">{{ detailData.beginTime || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="实际恢复时间">{{
                detailData.endTime || detailData.actualEndTime || '-'
              }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="暂停接单原因">{{ detailData.reason || '-' }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="safeweb-web search-buttons">
        <el-button class="el-btn-new search-btn" plain type="primary" size="small" @click="close()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PauseReceptWorkOrderConfigEdit',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.process {
  border: 1px solid rgba(153, 160, 158, 0.5);
  border-radius: $border-radio-md;
  .process-title {
    display: flex;
    align-items: center;
    .el-radio-group {
      margin-left: 32px;
    }
  }
  .row {
    width: 60%;
  }
}
.custom-timeline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .el-itmeline-item {
    flex: 1;
  }
}
.step {
  margin-top: 12px;
  h4 {
    font-size: 16px;
    font-weight: 600;
  }
}
.pauseReceptWorkOrderConfigEdit {
  :deep(.el-form-item) {
    margin-bottom: 14px !important;
    .el-form-item__label {
      line-height: 14px;
      height: 14px;
      color: #9e9e9e;
    }
    .el-form-item__content {
      line-height: 14px;
      height: 14px;
      color: #2a2b2f;
    }
  }
}
</style>
