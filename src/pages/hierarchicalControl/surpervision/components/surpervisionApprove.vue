<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="督办单详情"
      class="addWorkStyle"
      :visible.sync="showDialog"
      :destroy-on-close="false"
      :width="$dict['DIALOG_WIDTH']['LARGE']"
      @close="close"
    >
      <div class="px-32">
        <div class="new-base-title mb-10">基本信息</div>
        <el-form
          class="el-form-left-follow px-16"
          label-position="left"
          label-width="auto"
          label-suffix=" :"
        >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="标题">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接收人">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建单位">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接收单位">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="督办内容">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="附件">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="px-32">
        <div class="new-base-title mb-10">处理</div>
        <el-form
          class="el-form-left-follow px-16"
          label-position="left"
          label-width="auto"
          label-suffix=" :"
        >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="反馈单位">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="反馈时间">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="反馈人">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="反馈内容">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件">{{ detailData.WORK_TYPE_NAME || '-' }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- <div class="process mx-16 px-16 py-16">
        <div class="new-base-title process-title mb-10">审批</div>
        <el-row>
          <el-form
            id="submitForm"
            ref="submitForm"
            :model="submitData"
            label-suffix=" :"
            label-position="right"
            label-width="100px"
            :rules="rules"
          >
            <el-row>
              <el-form-item label="审批结果" prop="tranferIns">
                <el-radio-group v-model="signRslt" @change="changerules">
                  <el-radio label="01" checked>审批通过</el-radio>
                  <el-radio label="02">审批不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="审批意见" prop="tranferIns">
                <el-input
                  placeholder="请输入"
                  v-model="submitData.tranferIns"
                  type="textarea"
                  show-word-limit
                  maxlength="140"
                >
                </el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </el-row>
      </div> -->
      <div slot="footer" class="safeweb-web search-buttons">
        <el-button class="el-btn-new reset-btn" plain size="small" @click="close()"
          >取 消</el-button
        >
        <el-button
          class="el-btn-new search-btn"
          plain
          type="primary"
          size="small"
          @click="submitRelationWork"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SurpervisionApprove',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detailData: {
        WORK_TYPE_NAME: '11111111',
      },
      // signRslt: "01",
      // submitData: {
      //   backReason: "",
      //   recipientOrg: "",
      //   recipient: "",
      //   tranferIns: "",
      // },
      // rules: [],
    };
  },
  mounted() {},
  methods: {
    // 选择功能
    changerules() {},
    // 提交
    submitRelationWork() {},
    //图片上传之前的限制
    beforeAvatarUpload(file) {
      //   var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      //   const extension =
      //     testmsg === "jpg" ||
      //     testmsg === "JPG" ||
      //     testmsg === "png" ||
      //     testmsg === "PNG" ||
      //     testmsg === "gif" ||
      //     testmsg === "GIF" ||
      //     testmsg === "jpeg" ||
      //     testmsg === "JPEG";
      const isLt5M = file.size / 1024 / 1024 < 10;
      //   if (!extension) {
      //     this.$alert("上传图片只能是 JPG,PNG,JPEG,GIF 格式!", "提示");
      //   }
      if (!isLt5M) {
        this.$alert('上传图片大小不能超过 10MB!', '提示');
      }
      return extension && isLt5M;
    },
    //附件上传
    handleAvatarSuccessOther(res, file, fileList) {
      if (res.successful) {
        this.divLoading = false;
        this.fileters.push(res.DTS.fileMark);
        this.fileList = fileList;
        this.$forceUpdate();
      }
    },
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
</style>
