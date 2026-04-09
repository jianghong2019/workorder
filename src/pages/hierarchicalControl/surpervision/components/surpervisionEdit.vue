<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="处理督办单"
      class="addWorkStyle"
      :visible.sync="showDialogNew"
      :destroy-on-close="false"
      :width="$dict['DIALOG_WIDTH']['LARGE']"
      height="700px"
      @close="close"
    >
      <div class="px-32">
        <div class="new-base-title mb-10">基本信息</div>
        <el-form
          class="el-form-left-follow px-16"
          label-position="left"
          label-width="80px"
          label-suffix=" :"
        >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="标题">{{ detailData.formTitle || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">{{ detailData.createTime || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人">{{ detailData.createName || '-' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="接收人">{{ detailData.receiveName || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建单位">{{ detailData.createOrgName || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接收单位">{{ detailData.receiveOrgName || '-' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="督办内容">{{ detailData.content || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件">
                <echoFiles v-if="files1.length > 0" :file-list="files1" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="!showProcess" class="px-32">
        <div class="new-base-title mb-10">处理信息</div>
        <el-form
          class="el-form-left-follow px-16"
          label-position="left"
          label-width="80px"
          label-suffix=" :"
        >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="反馈单位">{{ detailData.receiveOrgName || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="反馈时间">{{ detailData.actualFinishTime || '-' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="反馈人">{{ detailData.receiveName || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="反馈内容">{{ detailData.dealContent || '-' }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件">
                <echoFiles v-if="files2.length > 0" :file-list="files2" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 该模块不用了 但是不敢删 怕设计突然又要 注释的代码都是 -->
      <!-- <div class="px-32">
        <div class="new-base-title mb-10">处理记录</div>
        <div>
          <el-steps :active="4" align-center finish-status="success">
            <template v-for="(item, index) in timelineList">
              <el-step>
                <template slot="description">
                  <div class="step">
                    <h4>创建督办单</h4>
                    <div>
                      <el-form
                        class="el-form-left-follow px-16"
                        label-position="right"
                        label-width="90px"
                        label-suffix=":"
                      >
                        <div v-if="index == 0">
                          <el-row :gutter="30">
                            <el-form-item label="创建时间">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                          <el-row :gutter="30">
                            <el-form-item label="创建单位">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                        </div>
                        <div v-if="index == 1">
                          <el-row :gutter="30">
                            <el-form-item label="反馈时间">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                          <el-row :gutter="30">
                            <el-form-item label="反馈人">{{
                              1111 || "-"
                            }}</el-form-item>
                            <el-form-item label="反馈内容">{{
                              1111 || "-"
                            }}</el-form-item>
                            <el-form-item label="附件">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                        </div>
                        <div v-if="index == 2">
                          <el-row :gutter="30">
                            <el-form-item label="审核时间">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                          <el-row :gutter="30">
                            <el-form-item label="审核人">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                          <el-row :gutter="30">
                            <el-form-item label="审核意见">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                        </div>
                        <div v-if="index == 3">
                          <el-row :gutter="30">
                            <el-form-item label="归档时间">{{
                              1111 || "-"
                            }}</el-form-item>
                          </el-row>
                        </div>
                      </el-form>
                    </div>
                  </div>
                </template>
              </el-step>
            </template>
          </el-steps>
        </div>
      </div> -->
      <div v-if="showProcess" class="process mx-16 px-16 py-16">
        <div class="new-base-title process-title mb-10">
          处理信息
          <!-- <el-radio-group v-model="signRslt" @change="changerules">
            <el-radio label="01" checked>直接反馈</el-radio>
            <el-radio label="02">转派</el-radio>
          </el-radio-group> -->
        </div>
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
            <el-row class="row" :span="12">
              <el-form-item label="反馈内容" prop="backReason">
                <el-input
                  v-model="submitData.backReason"
                  placeholder="请输入"
                  type="textarea"
                  show-word-limit
                  maxlength="140"
                >
                </el-input>
              </el-form-item>
            </el-row>
            <!-- <el-row class="row" v-if="signRslt == '02'" :span="12">
              <el-form-item
                label="接收单位"
                prop="recipientOrg"
                class="form-item-new50"
              >
                <org-tree
                  :unitData="unitData"
                  v-model="submitData.recipientOrg"
                ></org-tree>
              </el-form-item>
              <el-form-item label="接收人" class="form-item-new50">
                <el-select
                  v-model="submitData.recipient"
                  filterable
                  multiple
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in recipientList"
                    :key="index"
                    :label="item.NAME"
                    :value="item.VALUE"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="转派说明" prop="tranferIns">
                <el-input
                  placeholder="请输入"
                  v-model="submitData.tranferIns"
                  type="textarea"
                  show-word-limit
                  maxlength="140"
                >
                </el-input>
              </el-form-item>
            </el-row> -->
            <el-form-item label="附件">
              <el-upload
                v-if="fileters.length < 3"
                class="avatar-uploader"
                :action="fileAction"
                multiple
                :limit="3"
                :show-file-list="false"
                :file-list="fileList"
                :on-success="(res, file, fileList) => handleAvatarSuccessOther(res, file, fileList)"
                :before-upload="beforeAvatarUpload"
              >
                <div class="iconfont icon-shangchuan newicons"></div>
                <span class="newtexts">上传附件</span>
                <div slot="tip" class="el-upload__tip">
                  支持DOC,DOCX,XLS,XLSX,PDF,JPG,PNG,BMP,JPEG，文件大小10M以内,最多上传3个附件
                </div>
              </el-upload>
              <uploadTypes
                v-if="files.length > 0"
                ref="uploadTypesRef"
                class="uploadTypes"
                :file-list="fileList"
                :files="files"
                @delFile="delFile"
              />
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <div v-if="showProcess" slot="footer" class="safeweb-web search-buttons">
        <el-button class="el-btn-new reset-btn" plain size="small" @click="close()"
          >取 消</el-button
        >
        <el-button
          v-debounce="[submitRelationWork]"
          class="el-btn-new search-btn"
          plain
          type="primary"
          size="small"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrgTree from '@/components/common/form/OrgTree.vue';
import uploadTypes from '@/components/common/file/uploadTypes';
import echoFiles from '@/components/common/file/echoFiles';
import API from '@/api/hierarchicalControl/surpervision.js';

export default {
  name: 'SurpervisionEdit',
  components: {
    OrgTree,
    uploadTypes,
    echoFiles,
  },
  props: {
    // 弹窗显示字段
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 督办单ID
    superviseId: {
      type: Number,
      default: null,
    },
    // 是否可处理标识符
    showProcess: {
      type: Boolean,
      default: false,
    },
    // 下拉单位数据
    // unitData: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      showDialogNew: this.showDialog,
      detailData: {}, // 督办单详情信息
      // timelineList: [{}, {}, {}, {}],
      // signRslt: "01",
      // recipientList: [],
      submitData: {
        backReason: '',
        // recipientOrg: "",
        // recipient: "",
        // tranferIns: "",
      },
      rules: {
        backReason: [{ required: true, message: '请输入反馈内容', trigger: 'change' }],
      },
      fileAction: this.url + '/commonUtil/uploadFile', //图片上传地址
      fileList: [], // 文件上传数据
      fileters: [], // 文件fileMark
      files: [],
      files1: [], // 文件回显数据
      files2: [], // 文件回显数据
    };
  },
  watch: {
    showDialog(newVal) {
      this.showDialogNew = newVal;
    },
  },
  mounted() {
    this.superviseDetail();
  },
  methods: {
    // 获取督办单详情
    superviseDetail() {
      let params = {
        superviseId: this.superviseId,
      };
      API.superviseDetail(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.detailData = DTS;
          // 处理组件回显需要的数据 文件组件
          DTS?.fileMarks?.forEach((item) => {
            this.files1.push({
              ATTACH_SRC: item.fileMark,
              FILE_NAME: item.fileName,
              ATTACH_TYPE: item.fileType,
            });
          });
          DTS?.dealFileMarks?.forEach((item) => {
            this.files2.push({
              ATTACH_SRC: item.fileMark,
              FILE_NAME: item.fileName,
              ATTACH_TYPE: item.fileType,
            });
          });
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 处理督办单提交
    submitRelationWork() {
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          let params = {
            superviseId: this.superviseId,
            dealContent: this.submitData.backReason,
            fileMarks: this.fileters.join(','),
          };
          API.superviseDeal(params).then((res) => {
            const { RT_F } = res.data;
            if (RT_F == 1) {
              this.close('relode');
            } else {
              this.$message.error(`${RT_D}`);
            }
          });
        } else {
          return false;
        }
      });
    },
    //图片上传之前的限制
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension =
        // 图片
        testmsg === 'bmp' ||
        testmsg === 'jpg' ||
        testmsg === 'jpeg' ||
        testmsg === 'png' ||
        // 文档
        testmsg === 'doc' ||
        testmsg === 'docx' ||
        testmsg === 'xls' ||
        testmsg === 'xlsx' ||
        testmsg === 'pdf';
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$alert('只支持DOC,DOCX,XLS,XLSX,PDF,JPG,PNG,BMP,JPEG格式!', '提示');
      }
      if (!isLt10M) {
        this.$alert('上传图片大小不能超过 10MB!', '提示');
      }
      return extension && isLt10M;
    },
    //附件上传
    handleAvatarSuccessOther(res, file, fileList) {
      if (res.successful) {
        this.fileters.push(res.DTS.fileMark);
        this.files.push(res);
        this.fileList = fileList;
        this.$forceUpdate();
      }
    },
    // 文件删除
    delFile(file) {
      let index = this.fileters.findIndex((item) => item === file.fileMark);
      this.fileters.splice(index, 1);
    },
    // 关闭弹窗
    close(data) {
      this.showDialogNew = false;
      this.$emit('close', data);
    },
    // 选择功能
    // changerules() {},
  },
};
</script>

<style lang="scss" scoped>
.process {
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
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
.uploadTypes {
  height: 235px;
  margin-top: 12px;
  overflow-x: auto;
  display: flex;
  :deep(.fileBox) {
    display: flex !important;
    flex-wrap: nowrap !important;
  }
}
:deep(.el-dialog) {
  height: 700px;
}
</style>
