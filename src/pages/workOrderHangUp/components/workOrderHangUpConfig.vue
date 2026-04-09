<template>
  <el-container style="width: 100%; height: 100%" class="new-safeweb-web">
    <!-- 头 -->
    <el-header class="cardboxpd">
      <!-- 计划管理查询表单 -->
      <!-- stop的iframe阻止submit后跳转 -->
      <iframe name="stop" class="none"></iframe>
      <!-- stop的iframe阻止submit后跳转 -->
      <el-form
        id="searchData"
        ref="searchData"
        :model="searchData"
        label-position="right"
        label-width="100px"
        class="searchData search_input"
        action="http://"
        target="stop"
      >
        <!-- 第一行 -->
        <div class="flex-row-bw">
          <el-form-item label="工单类型" class="form-item-new">
            <el-select
              v-model="searchData.workTypeNo"
              filterable
              clearable
              placeholder="请选择"
              @change="changeType"
            >
              <el-option
                v-for="(item, index) in workTypeList"
                :key="index"
                :label="item.codeName"
                :value="item.codeValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单子类" class="form-item-new">
            <el-select v-model="searchData.orderSubtype" filterable clearable placeholder="请选择">
              <el-option
                v-for="(item, index) in workTypeSonList"
                :key="index"
                :label="item.codeName"
                :value="item.codeValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间" prop="time" class="date-box form-item-new">
            <el-date-picker
              v-model="time"
              type="daterange"
              class="timeBox"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <i class="el-icon-date data-icon"></i>
          </el-form-item>
        </div>
        <!-- 第二行 -->
        <div class="flex-row-bw flex-wrap">
          <el-form-item label="工单编号" class="form-item-new">
            <el-input
              v-model="searchData.appNo"
              class="input-box"
              placeholder="请输入"
              name="searchData.appNo"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <div class="flex-row-end search-buttons form-item-btn30">
            <el-button class="el-btn-new reset-btn" plain size="small" @click="formReset"
              >重 置</el-button
            >
            <el-button
              class="el-btn-new search-btn"
              type="primary"
              plain
              size="small"
              @click="formSubmit"
              >查 询</el-button
            >
          </div>
        </div>
      </el-form>
      <!-- 计划管理查询表单end -->
    </el-header>
    <!-- 头 end -->
    <!-- table -->
    <el-main class="cardbox-pd0 manage-main">
      <base-title-table title="详情列表">
        <template #right>
          <div class="flex-row-end">
            <!-- <el-button
              class="el-btn-new search-btn"
              type="primary"
              size="small"
              @click="isShowAdd = !isShowAdd"
            >
              <i class="iconfont icon-xinzeng2"></i>
              新增
            </el-button> -->
            <!-- <customTable
              ref="customTable"
              :fundCode="fundCode"
              class="customTable"
              @submitEnd="gettablechange"
            ></customTable> -->
          </div>
        </template>
      </base-title-table>
      <div v-loading="tableLoading" class="cardbox box-shadow-normal table-wrap">
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          border
          header-cell-class-name="table-header"
          height="100%"
          style="width: 100%"
        >
          <!-- <el-table-column
            type="index"
            label="序号"
            width="80"
            fixed="left"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column> -->

          <template v-for="item in tableList">
            <!-- 有视频添加视频的图标 end   张前  2022-06-01 -->
            <template>
              <el-table-column
                :key="item.RECORD_ID"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
                :min-width="item.width"
              >
              </el-table-column>
            </template>
          </template>

          <el-table-column label="操作" min-width="80" fixed="right" align="center">
            <template v-slot="scope">
              <div>
                <template v-for="button in getActionButtons" :key="button.label">
                  <el-button
                    type="text"
                    size="small"
                    @click.stop="handleButtonClick(button, scope.row)"
                    >{{ button.label }}</el-button
                  >
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <nullData /> -->
      </div>
      <el-pagination
        class="cardbox manage-main-pagination"
        :page-sizes="[10, 20, 30, 40]"
        v-model:page-size="pageSize"
        v-model:current-page="pageIndex"
        layout="total, prev, pager, next, sizes, jumper"
        background
        :total="tableCount"
        @size-change="sizeChange"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-main>
    <workOrderHangUpConfigEdit
      :show-dialog="showEditOrDetial"
      :detail-data="item"
      @close="showEditOrDetial = false"
    >
    </workOrderHangUpConfigEdit>
  </el-container>
</template>

<script>
// import customTable from "@/components/common/form/customTable.vue";
import BaseTitleTable from '@/components/common/base-title-table/index.vue'
// 引入表格/表单 头部标题组件
// import table_header_title from "@/components/common/TableHeaderTitle";
// import {
//   getWorkTypelList,
//   getBusinessSub,
//   getOrderPendingList,
// } from '@/pages/workOrderHangUp/api/index.js'
import workOrderHangUpConfigEdit from './workOrderHangUpConfigEdit.vue'

export default {
  name: 'ProductionConfig',
  components: {
    BaseTitleTable,
    workOrderHangUpConfigEdit,
    // customTable,
  },
  data() {
    return {
      showEditOrDetial: false,
      item: {},
      searchData: {
        workTypeNo: '',
        orderSubtype: '',
        appNo: '',
      },
      time: [],
      // list
      pageIndex: 1,
      pageSize: 10,
      tableCount: 0,
      tableLoading: false,
      getActionButtons: [{ label: '详情', prop: 'detial' }],
      tableData: [],
      tableList: [
        { label: '所属单位', prop: 'orgName', RECORD_ID: '2', width: '' },
        { label: '工单类型', prop: 'workTypeName', RECORD_ID: '3', width: '' },
        { label: '工单子类型', prop: 'orderSubtype', RECORD_ID: '4', width: '' },
        { label: '申请人', prop: 'creatorName', RECORD_ID: '5', width: '' },
        { label: '申请时间', prop: 'createTime', RECORD_ID: '6', width: '' },
        { label: '工单编号', prop: 'appNo', RECORD_ID: '7', width: '' },
      ],
      workTypeList: [],
      workTypeSonList: [],
    }
  },

  // 创建
  mounted() {
    this.getWorkTypelList()
    this.search()
  },
  methods: {
    //查询工单类型
    getWorkTypelList() {
      let params = {}
      // getWorkTypelList(params)
      //   .then((res) => {
      //     console.log('列表接口res', res)
      //     if (res.data.RT_F === 1 && res.data.DTS) {
      //       this.workTypeList = (res.data.DTS || []).map((item) => {
      //         return {
      //           codeName: item.codeName,
      //           codeValue: item.codeValue,
      //           remark: item.remark,
      //         }
      //       })
      //       console.log(this.workTypeList, 'workTypeList')
      //     }
      //   })
      //   .catch((e) => {})
    },
    //查询工单子类型
    changeType(val) {
      let index = this.workTypeList.findIndex((item) => {
        return item.codeValue === val
      })
      if (index === -1) {
        console.log('出错了')
        return
      }
      let params = {
        remark: this.workTypeList[index].remark,
        podeValue: this.workTypeList[index].codeValue,
      }
      // getBusinessSub(params)
      //   .then((res) => {
      //     console.log('列表接口res', res)
      //     if (res.data.RT_F === 1 && res.data.DTS) {
      //       this.workTypeSonList = (res.data.DTS || []).map((item) => {
      //         return {
      //           codeName: item.codeName,
      //           codeValue: item.codeValue,
      //         }
      //       })
      //       console.log(this.workTypeSonList, 'workTypeSonList')
      //     }
      //   })
      //   .catch((e) => {})
    },
    // 列表接口
    getOrderPendingList() {
      let applyStartTime = ''
      let applyEndTime = ''
      if (this.time.length) {
        applyStartTime = this.time[0]
        applyEndTime = this.time[1]
      }
      let index = this.workTypeList.findIndex((item) => {
        return item.codeValue === this.searchData.workTypeNo
      })
      let remark = index === -1 ? '' : this.workTypeList[index].remark
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.searchData,
        applyStartTime: applyStartTime, //申请时间范围开始时间
        applyEndTime: applyEndTime, //申请时间范围结束时间
        remark: remark, //业务类型标识  01-工单类型  02-业务类型
      }
      console.log('列表接口params', params)
      // getOrderPendingList(params)
      //   .then((res) => {
      //     console.log('列表接口res', res)
      //     if (res.data.RT_F == 1) {
      //       console.log('列表接口res111', res)
      //       this.tableData = res.data.DTS.OrderPendingList || []
      //       this.tableCount = res.data.DTS.total
      //     } else {
      //       this.$message.error('会话连接超时!请刷新重试！')
      //     }
      //   })
      //   .catch((e) => {})
    },

    // 操作
    handleButtonClick(btnObj, item) {
      console.log('操作', btnObj, item)
      this.item = item
      this.showEditOrDetial = true
    },

    //重置按钮
    formReset() {
      this.searchData = {
        workTypeNo: '',
        orderSubtype: '',
        appNo: '',
      }
      this.time = []
      this.workTypeSonList = []
      this.pageSize = 10 //每页多少条
      this.pageIndex = 1 //当前第几页
      // 重新调接口
      this.search()
    },
    sizeChange(val) {
      //pagesize 每页多少条
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    pageChange(val) {
      // 当前第几页
      this.pageIndex = val
      this.search()
    },
    // 查询按钮
    formSubmit() {
      console.log('this.searchData', this.searchData)
      this.search()
    },
    // 查询调接口
    search() {
      this.getOrderPendingList()
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-upload .el-upload--picture-card {
  width: 83px !important;
  height: 83px !important;
}
.bg-image {
  width: 100%;
  // height: 4px;
  min-height: 200px;
}

.upload-text {
  color: #31969a;
}

.confirmText {
  color: #333;
}

/* 新增编辑名称背景 */
/* 上传框中间图片文字距离 */
.el-upload-dragger .el-icon-upload {
  margin: 25px 0 14px;
}
/* 上传提示左边距 */
.el-upload__tip {
  margin-left: 15px;
}
.upload-demo {
  display: flex;
  flex-direction: row;
  /* position: relative; */
}
.files {
  width: 38%;
  min-height: 51px;
  border-radius: 10px;
  background-color: #f4f7f6;
  margin-bottom: 15px;
  position: absolute;
  left: 255px;
  bottom: -12px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.jindutiaotext {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.covername {
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.timeBox {
  :deep(.el-range-separator) {
    display: flex;
    align-items: center;
  }
}
</style>
