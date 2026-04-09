<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="发起督办单"
      class="addWorkStyle"
      :visible.sync="showDialogNew"
      :destroy-on-close="false"
      :width="$dict['DIALOG_WIDTH']['LARGE']"
      height="700px"
      @close="close"
    >
      <div class="cardboxpd">
        <el-form
          id="submitForm"
          ref="submitForm"
          :model="submitData"
          :rules="rules"
          label-suffix=" :"
          label-position="right"
          label-width="120px"
          action="http://"
          target="stop"
        >
          <div>
            <el-form-item label="标题" prop="surpervisionTitle" class="form-item-new">
              <el-input
                v-model="submitData.surpervisionTitle"
                class="input-box"
                placeholder="请输入"
                maxlength="100"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="接收单位" prop="recipientOrg" class="form-item-new">
              <org-tree v-model="submitData.recipientOrg" :unit-data="unitDataNew"></org-tree>
            </el-form-item>
            <el-form-item label="接收人" prop="recipient" class="form-item-new">
              <el-select v-model="submitData.recipient" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in recipientList"
                  :key="index"
                  :label="item.personName"
                  :value="item.propertyId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="要求完成时间" prop="endTime" class="date-box form-item-new">
              <el-date-picker
                v-model="submitData.endTime"
                type="date"
                class="search_input"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期时间"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
              <i class="el-icon-date data-icon"></i>
            </el-form-item>
            <el-form-item label="督办内容" prop="surpervisionContent" class="form-item-new">
              <el-input
                v-model="submitData.surpervisionContent"
                class="input-box"
                placeholder="请输入"
                maxlength="140"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="附件" class="form-item-new">
              <el-upload
                v-if="fileters.length < 3"
                class="avatar-uploader"
                :action="fileAction"
                multiple
                :limit="6"
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
          </div>
        </el-form>
      </div>
      <div slot="footer" class="safeweb-web search-buttons">
        <el-button class="el-btn-new reset-btn" plain size="small" @click="close()"
          >取 消</el-button
        >
        <el-button
          v-debounce="[saveRelationWork]"
          class="el-btn-new search-btn"
          plain
          type="primary"
          size="small"
          >保 存</el-button
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
import API from '@/api/hierarchicalControl/surpervision.js';

export default {
  name: 'SurpervisionAdd',
  components: {
    OrgTree,
    uploadTypes,
  },
  props: {
    // 弹窗显示字段
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 下拉单位数据
    unitData: {
      type: Array,
      default: () => [],
    },
    // 督办单ID,用于编辑提交参数
    superviseId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      showDialogNew: this.showDialog,
      recipientList: [], // 接收人下拉数据
      submitData: {
        // 查询条件集合
        surpervisionTitle: '',
        recipientOrg: '',
        recipient: '',
        endTime: '',
        surpervisionContent: '',
      },
      rules: {
        surpervisionTitle: [{ required: true, message: '请输入督办名称', trigger: 'change' }],
        recipientOrg: [{ required: true, message: '请选择接收单位', trigger: 'change' }],
        recipient: [{ required: true, message: '请选择接收人', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择完成时间', trigger: 'change' }],
        surpervisionContent: [{ required: true, message: '请输入督办内容', trigger: 'change' }],
      },
      fileAction: this.url + '/commonUtil/uploadFile', //图片上传地址
      fileList: [], // 上传数据详情集合
      fileters: [], // 上传数据fileMark集合
      files: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  computed: {
    unitDataNew() {
      // 下级单位集合
      return this.unitData?.[0]?.child;
    },
  },
  watch: {
    'submitData.recipientOrg': {
      handler(newVal, oldVal) {
        if (newVal != oldVal) this.getPersonList(newVal); // 获取接收单位下的人员数据
      },
    },
    showDialog(newVal) {
      this.showDialogNew = newVal;
    },
  },
  mounted() {
    if (this.superviseId) {
      this.superviseDetail(); // 获取编辑详情
    } else {
      this.submitData.recipientOrg = this.unitData?.[0]?.child?.[0]?.orgId; // 默认选中下级单位中第一个单位的ID
    }
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
          this.submitData = {
            surpervisionTitle: DTS.formTitle,
            recipientOrg: DTS.receiveOrgId,
            recipient: DTS.receivePropertyId,
            endTime: DTS.needFinishTime?.split(' ')?.[0],
            surpervisionContent: DTS.content,
          };
          DTS?.fileMarks?.forEach((item) => {
            this.fileters.push(item.fileMark);
            // 处理组件回显需要的数据 文件组件
            this.files.push({
              DTS: { fileMark: item.fileMark },
              fileName: item.fileName,
              fileType: item.fileType,
            });
            this.fileList.push({
              response: {
                DTS: { fileMark: item.fileMark },
                fileName: item.fileName,
                fileType: item.fileType,
              },
            });
          });
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 保存督办单
    saveRelationWork() {
      this.save = true;
      this.submitRelationWork();
    },
    // 创建督办单提交
    submitRelationWork() {
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          let params = {
            formTitle: this.submitData.surpervisionTitle,
            receiveOrgId: this.submitData.recipientOrg,
            receivePropertyId: this.submitData.recipient,
            needFinishTime: this.submitData.endTime,
            content: this.submitData.surpervisionContent,
            fileMarks: this.fileters.join(','),
            superviseId: this.superviseId ? this.superviseId : '',
            actionWay: this.save ? '01' : '02',
          };
          API.saveSupervise(params).then((res) => {
            const { RT_F, RT_D } = res.data;
            this.save = false;
            if (RT_F === 1) {
              this.close('relode');
            } else {
              this.$message.error(`${RT_D}`);
            }
          });
        } else {
          this.save = false;
          return false;
        }
      });
    },
    // 获取下拉人员数据
    getPersonList(orgid) {
      let params = {
        orgNo: orgid,
      };
      API.getPersonList(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F === 1 && DTS) {
          this.recipientList = DTS;
        } else {
          this.$message.error(`${RT_D}`);
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
        console.log(this.files, '111111111');
        console.log(this.fileList, '2222222');

        this.$forceUpdate();
      }
    },
    // 文件删除
    delFile(file) {
      let index = this.fileters.findIndex((item) => item === file.fileMark);
      this.fileters.splice(index, 1);
    },
    close(data) {
      this.showDialogNew = false;
      this.$emit('close', data);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-new {
  width: 50%;
}
.uploadTypes {
  width: 200% !important;
  height: 235px;
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
