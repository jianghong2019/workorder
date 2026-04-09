<template>
  <!-- 人员详情 -->

  <el-dialog
    title="人员详情"
    :visible.sync="qualityDialogVisible"
    width="680px"
    :close-on-click-modal="false"
    append-to-body
    @opened="handlerOpen"
    @close="closeFn"
  >
    <div class="new-safeweb-web dialog-box">
      <el-row>
        <el-col :span="12">
          <div class="dialog-l">
            <div class="l-t">
              <div
                :class="[
                  't-i',
                  userInfo.warningDegree === '0'
                    ? 'safe'
                    : userInfo.warningDegree === '04'
                      ? 'gay'
                      : ['01', '02', '03'].includes(userInfo.warningDegree)
                        ? 'warning'
                        : 'safe',
                ]"
              >
                <img :src="userInfo.img" />
              </div>
              <div class="t-n">
                <div class="n-t">
                  <span> {{ userInfo.name }}</span>
                  <span>
                    {{ userInfo.peopleType }}
                  </span>
                </div>
                <div class="n-b">所在单位：{{ userInfo.orgName }}</div>
              </div>
            </div>
            <div class="l-b">
              <span
                v-for="(item, i) in personTags"
                :key="i"
                :class="[isIncludeError(item.tagCode) ? 'error' : '']"
                >{{ item.tagName }}</span
              >
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="dialog-r">
            <div class="r-t">
              <!-- 工作情况：当前已完成作业{{
                userInfo.completedNum
              }}个，未完成作业工单{{ userInfo.inpleteRate }}个 -->
              {{ workOrderCondition }}
            </div>
            <div class="r-b">
              <div class="r-b-a">
                <img src="@/assets/iconfont/icon/time.png" />
                <span :title="userInfo.address">{{ userInfo.address }}</span>
              </div>
              <div class="r-b-t">
                <img src="@/assets/iconfont/icon/address.png" />
                <span>{{ userInfo.locationTime }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" class="card-tabs">
        <el-tab-pane label="待办工单" name="01"></el-tab-pane>
        <el-tab-pane label="已办工单" name="02"></el-tab-pane>
      </el-tabs>
      <div class="input-box">
        <el-input
          v-model="form.appNo"
          placeholder="请输入工单编号"
          clearable
          @keyup.native.enter="search"
        ></el-input>
        <el-input
          v-model="form.consName"
          placeholder="请输入户名/户号"
          clearable
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <el-table
        v-if="tableData.length"
        :key="JSON.stringify(tableData.length)"
        ref="multipleTable"
        v-loading="loadingObj[activeTab]"
        :data="tableData"
        border
        height="200px"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="appNo"
          label="工单编号"
          show-overflow-tooltip
          min-width="120px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="workTypeName"
          label="工单类型"
          show-overflow-tooltip
          min-width="120px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="insertDate"
          label="生成时间"
          show-overflow-tooltip
          min-width="120px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="deadLineTime"
          label="要求完成时间"
          show-overflow-tooltip
          min-width="120px"
          align="center"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length"
        v-loading="loadingObj[activeTab]"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="pageInfo.pageSize"
        :current-page.sync="pageInfo.pageIndex"
        layout="prev, pager, next"
        background
        :total="pageInfo.tableCount"
        @size-change="sizeChange"
        @current-change="pageChange"
      >
      </el-pagination>
      <nullData v-else v-loading="loadingObj[activeTab]" />
    </div>
  </el-dialog>
</template>
<script>
import api from '@/api/hierarchicalControl/firstlevel.js';
export default {
  components: {
    nullData: () => import('@/components/common/form/nullData.vue'),
  },
  props: ['data'],
  data() {
    return {
      workOrderCondition: '',
      loadingObj: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        tableCount: 0,
      },
      tableData: [],
      form: {
        appNo: '',
        consName: '',
      },
      activeTab: '01',
      qualityDialogVisible: true,
      userInfo: {
        img: require('@/assets/images/uer-portrait/icon_person.png'),
        // name: "张三",
        // phone: "19526485634",
        // position: "负责人",
        // address: "惠南营业站",
        // tagList: ["消缺达人", "安全达人"],
        // completedNum: 12,
        // inpleteRate: 80,
        // positioning: "长宁区天山路街道南门外123456789米处",
        // time: "2023-02-01 12:25:63",
      },
      viewInfo: {},
    };
  },
  computed: {
    personTags() {
      return this.userInfo?.personTags ? JSON.parse(this.userInfo?.personTags) : [];
    },
  },
  watch: {
    activeTab(newVal, oldVal) {
      // 没有切换选项卡则不进行后续操作
      if (newVal === oldVal) return;
      // 若切换选项卡，则将当前选项卡的数据缓存起来，缓存到viewInfo中
      this.viewInfo[oldVal] = {
        pageInfo: { ...this.pageInfo },
        form: { ...this.form },
        tableData: [...this.tableData],
      };
      if (!this.viewInfo[newVal]) {
        // 若切换选项卡后，缓存中没有当前选项卡的数据，则将data中数据重置为初始值，并重新获取数据
        this.form = this.$options.data.call(this).form;
        this.pageInfo = this.$options.data.call(this).pageInfo;
        this.tableData = this.$options.data.call(this).tableData;
        this.getTableData();
      } else {
        // 若切换选项卡后，缓存中有当前选项卡的数据，则将缓存中的数据赋值给data中数据，此时不必重新获取数据
        this.pageInfo = { ...this.viewInfo[newVal].pageInfo };
        this.form = { ...this.viewInfo[newVal].form };
        this.tableData = [...this.viewInfo[newVal].tableData];
      }
    },
  },
  created() {
    this.handlerOpen();
  },
  methods: {
    //关闭弹窗
    closeFn() {
      // 关闭弹窗时将data中数据重置为初始值
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit('close');
    },
    //打开弹窗
    openFn(data) {
      console.log(data, this.data);
      // 弹窗打开后调用接口获取数据
      this.qualityDialogVisible = true;
      this.userInfo = Object.assign(this.userInfo, this.data);
      this.getTableData();
    },
    handlerOpen() {
      console.log('open===>', this.data);
      // this.userInfo = Object.assign(this.userInfo, this.data);
      this.userInfo = {
        img: require('@/assets/images/uer-portrait/icon_person.png'),
        ...this.data,
      };
      this.getTableData();
    },
    //输入框回车查询
    search() {
      console.log(this.form);
      //表格加载中不让查询
      if (this.loadingObj[this.activeTab]) return;
      this.getTableData();
    },
    sizeChange(e) {
      this.pageInfo.pageSize = e;
      this.pageInfo.pageIndex = 1;
      this.getTableData();
    },
    pageChange(e) {
      this.pageInfo.pageIndex = e;
      this.getTableData();
    },
    //获取表格数据
    async getTableData() {
      try {
        const params = {
          pageIndex: this.pageInfo.pageIndex,
          pageSize: this.pageInfo.pageSize,
          ...this.form,
          propertyId: this.userInfo.id,
          workType: this.activeTab === '01' ? '0' : '1',
          orgNo: this.data.orgNo,
        };
        const {
          data: {
            DTS: { workOrderCondition, workOrderList },
          },
        } = await api.selectWorkOrderToDoList(params);
        console.log('selectWorkOrderToDoList====>', workOrderCondition, workOrderList);
        this.workOrderCondition = workOrderCondition;
        this.pageInfo.tableCount = workOrderList?.totalCount;
        this.tableData = workOrderList?.data;
      } catch (error) {}
      //   this.loadingObj[this.activeTab] = true;
    },
    isIncludeError(code) {
      return code?.endsWith('99') ?? false;
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-box {
  .nullData {
    height: 252px;
    margin-top: 20px;
  }
  .el-table {
    margin: 20px 0;
  }
  .input-box {
    margin-top: 20px;
    .el-input {
      width: 200px;
      &:nth-child(1) {
        margin-right: 32px;
      }
    }
  }
  .el-tabs {
    border-bottom: 1px solid #e9e9e9;
  }
  .dialog-r {
    .r-t {
      color: #333;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 15px;
    }
    .r-b {
      display: flex;
      .r-b-a {
        margin-right: 5px;
      }
      & > div {
        flex: 1;
        font-size: 12px;
        display: flex;
        align-items: center;
        overflow: hidden;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 6px;
        }
      }
    }
  }
  .dialog-l {
    .l-b {
      display: flex;
      flex-wrap: wrap;
      span {
        padding: 3px 4px;
        font-size: 10px;
        color: #fff;
        margin-top: 7px;
        margin-right: 5px;
        background: #64d591;
        &.error {
          background: #fe3333;
        }
      }
    }
    .l-t {
      display: flex;
      align-items: center;
      .t-n {
        color: #7b807e;
        font-size: 12px;
        .n-t {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          span:nth-child(1) {
            color: #333;
            font-size: 14px;
            font-weight: bold;
            margin-right: 10px;
          }
          span:nth-child(2) {
            color: #fff;
            font-size: 10px;
            padding: 3px;
            display: inline-block;
            background: #14cb93;
            border-radius: 6px 0 6px 0;
          }
        }
      }
      .t-i {
        box-sizing: border-box;
        border-width: 4px;
        border-style: solid;
        border-radius: 50%;
        height: 45px;
        width: 45px;
        overflow: hidden;
        margin-right: 7px;
        &.safe {
          border-color: #2ba174;
        }
        &.warning {
          border-color: #f7b94b;
        }
        &.error {
          border-color: #fe3333;
        }
        &.gay {
          border-color: #bcbcbc;
        }
        img {
          height: 37px;
          width: 37px;
        }
      }
    }
  }
}
</style>
