<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="通知公告详情"
      class="addWorkStyle"
      :visible.sync="showDialogNew"
      :destroy-on-close="false"
      :width="$dict['DIALOG_WIDTH']['LARGE']"
      height="650px"
      @close="close"
    >
      <div class="detailDialogBody">
        <div class="div1">
          <div class="row1">{{ singleAnnounceDetails.noticeTypeName }}</div>
          <div class="row2">
            <div class="row21">
              <div>{{ singleAnnounceDetails.publishOrgName }}</div>
              <div>#{{ singleAnnounceDetails.noticeTypeName }}#</div>
              <div>{{ singleAnnounceDetails.publishTime }}</div>
            </div>
            <div class="row22">
              <div class="ql-snow">
                <div
                  class="ql-editor"
                  v-html="escape2Html(singleAnnounceDetails.noticeContent)"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="attachSrcurl.length" class="div2">
          <div class="row1">图片 :</div>
          <div v-if="attachSrcurl.length" class="row2">
            <div v-for="(item, index) in attachSrcurl" :key="'photo-' + index">
              <el-image
                :src="$store.state.newfileurl + item.url"
                alt=""
                @click="handlePictureCardPreview($store.state.newfileurl + item.url)"
              ></el-image>
            </div>
          </div>
        </div>
        <div v-if="attachSrcurl_WD.length" class="div3">
          <div class="row1">文档 :</div>
          <div v-if="attachSrcurl_WD.length" class="row2">
            <div
              v-for="(item, index) in attachSrcurl_WD"
              :key="'wd-' + index"
              @click.stop="downloadFile($store.state.newfileurl + item.url, item.name)"
            >
              <span :title="item.name"> {{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div v-if="dialogVisible">
      <el-dialog
        v-dialogDrag
        class="spjk-previewImgDialog"
        :visible.sync="dialogVisible"
        width="800px"
        append-to-body
        custom-class="fillet"
      >
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import API from '@/api/hierarchicalControl/workReminder.js';

export default {
  name: 'AnnouncementDetails',
  props: {
    // 弹窗显示字段
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 消息ID
    noticeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showDialogNew: this.showDialog,
      singleAnnounceDetails: {}, //单条公告详情
      attachSrcurl: [], //图片路径
      attachSrcurl_WD: [], //文档路径
      dialogVisible: false,
      dialogImageUrl: '',
    };
  },
  watch: {
    showDialog(newVal) {
      this.showDialogNew = newVal;
    },
  },
  mounted() {
    let noticeId = this.noticeId;
    this.getAnnounceInfo(noticeId);
  },
  methods: {
    getAnnounceInfo(noticeId) {
      API.quertNoticeDetails({ noticeId }).then((res) => {
        if (!res.data.successful) {
          this.$message.error('会话连接超时!请刷新重试！');
          return;
        } else {
          let data = res.data.resultValue.items[0];
          let attach = data.attachInfolist;
          this.singleAnnounceDetails = data.msNotify;
          this.attachSrcurl = [];
          this.attachSrcurl_SP = [];
          this.attachSrcurl_YP = [];
          this.attachSrcurl_WD = [];
          attach.forEach((item) => {
            if (item.fileType == '01') {
              // 图片
              this.attachSrcurl.push({
                url: item.fileMark,
                text: item.fileName,
              });
            } else if (item.fileType == '04') {
              // 文档
              let testmsg = item.fileName.substring(item.fileName.lastIndexOf('.') + 1);
              this.attachSrcurl_WD.push({
                url: item.fileMark,
                text: testmsg,
                name: item.fileName,
              });
            }
          });
        }
      });
    },
    escape2Html(str) {
      var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
      return str?.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
        return arrEntities[t];
      });
    },
    //下载
    downloadFile(url, filename) {
      function getBlob(url) {
        return new Promise((resolve) => {
          const XML = new XMLHttpRequest();
          XML.open('GET', url, true);
          XML.responseType = 'blob';
          XML.onload = () => {
            if (XML.status === 200) {
              resolve(XML.response);
            }
          };
          XML.send();
        });
      }
      //下载文件
      function saveAs(blob, filename) {
        const elelink = document.createElement('a');
        elelink.style.display = 'none';
        elelink.download = filename;
        elelink.href = window.URL.createObjectURL(blob);
        document.body.appendChild(elelink);
        elelink.click();
        document.body.removeChild(elelink);
      }
      // 调用以上方法进行下载
      getBlob(url).then((blob) => {
        saveAs(blob, filename);
      });
    },
    //点击图片放大
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 关闭弹窗
    close(data) {
      this.showDialogNew = false;
      this.$emit('close', data);
    },
  },
};
</script>

<style lang="scss" scoped>
.detailDialogBody {
  color: #333;
  min-height: 400px;
  .div1 {
    border-bottom: 1px solid #e9e9e9;
    .row1 {
      line-height: 36px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .row2 {
      margin: 0 30px;
      .row21 {
        display: flex;
        align-items: center;
        color: #99a09e;
        font-size: 14px;
        font-weight: 400;
        line-height: 36px;
        > div {
          margin-right: 20px;
        }
        > div:nth-child(2) {
          color: #2ba174;
        }
      }
    }
  }
  .div2 {
    border-bottom: 1px solid #e9e9e9;
    .row1 {
      line-height: 72px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .row2 {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .div3 {
    margin-top: 30px;
    .row1 {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .row2 {
      margin-top: 10px;
      > div {
        line-height: 26px;
        cursor: pointer;
        color: #2ba174;
        > span {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 5px;
        }
      }
    }
  }
}
.el-image {
  width: 240px !important;
  height: 180px !important;
  margin-right: 20px !important;
  border-radius: 10px !important;
  margin-bottom: 16px;
  cursor: pointer;
}
:deep(.ql-editor) {
  p {
    line-height: 22px;
  }
}
:deep(.el-dialog) {
  height: 850px;
}
</style>
