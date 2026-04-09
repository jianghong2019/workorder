<template>
  <!-- 报表 -->
  <el-dialog append-to-body :visible.sync="showDialog" class="dialogclass" width="801px">
    <div class="da-title">
      {{ tableCount.orgName }}全业务工单化管理{{ timeName }}
      <img
        class="img"
        :src="require('@/assets/images/icon-hui.svg')"
        alt=""
        @click="showDialog = false"
      />
    </div>
    <div class="box">
      <div class="positionTab">
        <div
          v-for="item in timeList"
          :key="item.name"
          class="itemTab"
          :class="item.prop == currentProp ? 'isActive' : ''"
          @click="currentProp = item.prop"
        >
          {{ item.name }}
        </div>
        <div style="width: 50%">
          <el-date-picker
            v-if="searchData.timeType == '01'"
            key="date"
            v-model="searchData.time.date"
            placeholder="选择日"
            type="date"
            size="small"
            :clearable="false"
            @change="dateChange"
          >
          </el-date-picker>
          <el-date-picker
            v-if="searchData.timeType == '02'"
            key="week"
            v-model="searchData.time.week"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="选择周"
            size="small"
            :clearable="false"
            :picker-options="timeOptions"
            @change="dateChange"
          >
          </el-date-picker>
          <el-date-picker
            v-if="searchData.timeType == '03'"
            v-model="searchData.time.month"
            type="month"
            key="month"
            format="yyyy 年 M月"
            placeholder="选择月"
            size="small"
            :clearable="false"
            @change="dateChange"
          >
          </el-date-picker>
        </div>
      </div>
      <div ref="box" v-loading="quyLoading" class="content">
        <div ref="conts" class="conts">
          <div v-for="(item, index) in dataList" :key="item.name" class="items">
            <div class="titlb">
              <div class="title">{{ item.name }}</div>
              <img class="icon" src="@/assets/images/icon-path.png" alt="" />
            </div>
            <div v-if="index == 0" class="text">
              {{ tableCount.dateStr }},工单总数<span class="colors">{{
                tableCount.orderTotal
              }}</span
              >个，工单处理完成数<span class="colors">{{ tableCount.finishNum }}</span
              >，工单完成率<span class="colors">{{ tableCount.finishRate }}%</span>。
              <span v-if="tableCount.finishHighPerson.length > 0"
                >其中<span class="colors"> {{ formArry(tableCount.finishHighPerson) }}</span
                >完成率较高。</span
              >
            </div>
            <div v-if="index == 1" class="text">
              工单类型分布情况为{{ tableCount.typeFinishList[0].workTypeName }}
              <span class="colors">{{ tableCount.typeFinishList[0].orderTotal }}</span
              >、{{ tableCount.typeFinishList[1].workTypeName
              }}<span class="colors">{{ tableCount.typeFinishList[1].orderTotal }}</span> 、{{
                tableCount.typeFinishList[2].workTypeName
              }}<span class="colors">{{ tableCount.typeFinishList[2].orderTotal }}</span
              >、{{ tableCount.typeFinishList[3].workTypeName
              }}<span class="colors">{{ tableCount.typeFinishList[3].orderTotal }}</span> 、{{
                tableCount.typeFinishList[4].workTypeName
              }}<span class="colors">{{ tableCount.typeFinishList[4].orderTotal }}</span
              >。

              <span v-if="tableCount.typeFinishHighOrg.length > 0"
                >其中 <span class="colors"> {{ formArry(tableCount.typeFinishHighOrg) }}</span
                >完成率较高</span
              >

              <!-- 情况如下： -->
            </div>
            <div v-if="index == 2" class="text">
              {{ tableCount.dateStr }},工单总数<span class="colors">{{
                tableCount.orderTotal
              }}</span
              >个， 派发至外包队伍<span class="colors">{{ tableCount.teamOrderTotal }}</span
              >， 已完成<span class="colors">{{ tableCount.teamOrderFinishTotal }}</span
              >， 完成率<span class="colors">{{ tableCount.teamOrderRate }}%</span>。
              <span v-if="tableCount.finishHighTeam.length > 0"
                >其中 <span class="colors"> {{ formArry(tableCount.finishHighTeam) }}</span
                >完成率较高</span
              >
            </div>

            <el-table
              ref="multipleTable"
              :data="tableData[index]"
              header-cell-class-name="table-header"
              min-height="200px"
              style="width: 100%"
            >
              <template v-for="ite in tableList[index]">
                <template>
                  <el-table-column
                    :key="ite.RECORD_ID + index + 7"
                    :sortable="ite.prop == 'orderRate'"
                    :prop="ite.prop"
                    :label="ite.label"
                    show-overflow-tooltip
                    :min-width="item.width"
                    align="center"
                  >
                  </el-table-column>
                </template>
              </template>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button class="el-btn-new search-btn" size="small" @click="goAddEdit()"> 导出 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import API from '@/api/hierarchicalControl/firstlevel.js';
// import { getUserOrgInfo } from "@/api/common/index.js";
export default {
  name: 'WorkOrderManage',
  props: {
    // orgNo: {
    //   type: String,
    // },
    // showDialog: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  data() {
    return {
      timeTypeData: [
        {
          name: '日',
          value: 'date',
        },
        {
          name: '周',
          value: 'week',
        },
        {
          name: '月',
          value: 'month',
        },
      ],
      quyLoading: false,
      showDialog: false, //页面打开
      timeName: '日报',
      currentProp: '01',
      timeList: [
        { name: '日报', prop: '01' },
        { name: '周报', prop: '02' },
        { name: '月报', prop: '03' },
      ],
      dataList: [{ name: '工单完成情况' }, { name: '工单分布情况' }, { name: '运维队伍情况' }],
      tableData: [
        // { stopOrderNo: "窃电", orgName: "1", creatorName: "2", beginTime: "3" },
      ],
      tableList: [
        [
          { label: '人员', prop: 'personName', RECORD_ID: '5', width: '' },
          { label: '工单总数', prop: 'orderTotal', RECORD_ID: '6', width: '' },
          {
            label: '未完成工单数',
            prop: 'notFinishOrderNum',
            RECORD_ID: '7',
            width: '',
          },
          { label: '完成率', prop: 'orderRate', RECORD_ID: '8', width: '' },
        ],
        [
          {
            label: '工单类型',
            prop: 'workTypeName',
            RECORD_ID: '5',
            width: '',
          },
          { label: '工单总数', prop: 'orderTotal', RECORD_ID: '6', width: '' },
          {
            label: '未完成工单数',
            prop: 'notFinishOrderNum',
            RECORD_ID: '7',
            width: '',
          },
          { label: '完成率', prop: 'orderRate', RECORD_ID: '8', width: '' },
        ],
        [],
        //  [
        // { label: "队伍名称", prop: "teamName", RECORD_ID: "5", width: "",showTeam: this.tableCount.showTeam },
        // { label: "工单类型", prop: "workTypeName", RECORD_ID: "6", width: "",showTeam: !this.tableCount.showTeam },
        //    { label: "队伍名称", prop: "teamName", RECORD_ID: "5", width: "" },
        //   { label: "工单类型", prop: "workTypeName", RECORD_ID: "6", width: "" },
        // { label: "工单总数", prop: "orderTotal", RECORD_ID: "7", width: "" },
        // { label: "未完成工单数", prop: "notFinishOrderNum", RECORD_ID: "8", width: "" },
        // { label: "完成率", prop: "orderRate", RECORD_ID: "9", width: "" },]
      ],
      tableCount: '', //总数据
      orgNo: '3140302', //管理单位编码
      timeOptions: {
        firstDayOfWeek: 1,
      },
      startDate: formatDate(new Date()),
      endDate: formatDate(new Date()),
      searchData: {
        timeType: '01',
        time: {
          date: new Date(),
          week: '',
          month: '',
        },
      },
    };
  },
  watch: {
    currentProp() {
      // this.getList();
      this.changetimeType();
    },
    // searchData: {
    //   handler(newValue) {
    //     if (newValue.orgId == "" || newValue.orgId == null) return;
    //     if (this.limitTime) {
    //       clearTimeout(this.limitTime);
    //     }
    //     this.limitTime = setTimeout(() => {
    //       console.log("监听到条件变化",newValue);
    //       this.$emit("changesearchData", newValue);
    //     }, 100);
    //   },
    //   deep: true,
    //   immediate: false,
    // },
  },
  methods: {
    formArry(arr) {
      return arr.join(',');
    },
    changetimeType() {
      switch (this.currentProp) {
        case '01':
          this.processingDate();
          break;
        case '02':
          this.processingweek();
          break;
        case '03':
          this.processingmonth();
          break;
      }
      this.searchData.timeType = this.currentProp;
    },
    // 手动选择时间单位
    dateChange() {
      switch (this.currentProp) {
        case '01':
          // this.processingDate();
          this.startDate = formatDate(this.searchData.time.date);
          this.endDate = formatDate(this.searchData.time.date);
          // console.log(this.startDate,this.startDate);
          this.getList();
          break;
        case '02':
          this.startDate = this.addDate(this.searchData.time.week, -1);
          this.endDate = this.addDate(this.searchData.time.week, 5);
          // console.log(this.startDate,this.endDate);

          this.getList();
          break;
        case '03':
          // 查询这月多少天
          let num = this.getData(this.searchData.time.month);
          console.log(num);
          this.startDate = formatDate(this.searchData.time.month);
          this.endDate = this.addDate(this.searchData.time.month, num - 1);
          console.log(this.startDate, this.endDate);
          this.getList();
          break;
      }
    },
    // 查询当月天数
    getData(num) {
      let date = new Date(num);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      // 下月第一天
      let nextMonthFirstDay = new Date(year, month, 1);
      // 上月第一天减去本月第一天
      let days = new Date(nextMonthFirstDay.getTime() - 1).getDate();
      return days;
    },
    // 查询首尾日期
    addDate(date, days) {
      let d = new Date(date);
      d.setDate(d.getDate() + days);
      let m = d.getMonth() + 1;
      let day = d.getDate();
      if (m < 10) {
        m = '0' + m;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return d.getFullYear() + '-' + m + '-' + day;
    },

    // 周第一天和最后一天
    nowtimeTypeweek() {
      let day = new Date().getDay();
      var nowTime = new Date().getTime();
      var oneDayTime = 24 * 60 * 60 * 1000;
      var MondayTime = nowTime - (day - 1) * oneDayTime;
      var SundayTime = nowTime + (7 - day) * oneDayTime;
      var beginTime = new Date(MondayTime);
      var endTime = new Date(SundayTime);
      this.startDate = formatDate(beginTime);
      this.endDate = formatDate(endTime);
      this.getList();
    },
    //月第一天和最后一天
    nowtimeTypemonth() {
      let month = new Date().getMonth();
      let year = new Date().getFullYear();
      let beginTime = new Date(year, month, 1);
      let endTime = new Date(year, month + 1, 0);
      beginTime = formatDate(beginTime);
      endTime = formatDate(endTime);
      // this.searchData.NowTime = [beginTime, endTime];
      this.startDate = beginTime;
      this.endDate = endTime;
      this.getList();
    },
    // 统计类型为“按年统计”时，统计年度默认为今年，当前日期为每年第一天默认为去年。
    processingDate() {
      this.searchData.time.date = new Date();
      this.startDate = formatDate(this.searchData.time.date);
      this.endDate = formatDate(this.searchData.time.date);
      this.getList();
    },
    // 统计类型为“按周统计”时，统计周度默认为今年的本周，当前日期为每周第一天默认为上周
    processingweek() {
      if (new Date().getDay() == 1) {
        let day = new Date().getDay();
        var nowTime = new Date().getTime();
        var oneDayTime = 24 * 60 * 60 * 1000;
        var MondayTime = nowTime - (day - 1) * oneDayTime;
        this.searchData.time.week = new Date(MondayTime - oneDayTime);
      } else {
        this.searchData.time.week = new Date();
      }
      this.nowtimeTypeweek();
    },
    // 统计类型为“按月统计”时，统计月度默认为今年的本月，当前日期为每月第一天默认为上月。
    processingmonth() {
      if (new Date().getDate() == 1) {
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        this.searchData.time.month = new Date(year, month - 1, 1);
      } else {
        this.searchData.time.month = new Date();
      }
      this.nowtimeTypemonth();
    },
    // 卡片折叠
    opan(e) {
      // console.log(1111, e);
      this.orgNo = e;
      this.quyLoading = true;
      this.showDialog = true;
      this.getList();
    },
    // 查询
    async getList() {
      this.timeName =
        this.currentProp == '01' ? '日报' : this.currentProp == '02' ? '周报' : '月报';
      this.quyLoading = true;
      let param = {
        orgNo: this.orgNo,
        reportType: this.currentProp,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      let res = await API.getIndirectOrderReportInfo(param).finally(
        () => (this.quyLoading = false)
      );
      // console.log(11111, res.data);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.tableCount = DTS;
        this.tableList[2] = DTS.showTeam
          ? [
              {
                label: '队伍',
                prop: 'teamName',
                RECORD_ID: '6',
                width: '',
              },
              {
                label: '工单总数',
                prop: 'orderTotal',
                RECORD_ID: '7',
                width: '',
              },
              {
                label: '未完成工单数',
                prop: 'notFinishOrderNum',
                RECORD_ID: '8',
                width: '',
              },
              { label: '完成率', prop: 'orderRate', RECORD_ID: '9', width: '' },
            ]
          : [
              {
                label: '工单类型',
                prop: 'workTypeName',
                RECORD_ID: '6',
                width: '',
              },
              {
                label: '工单总数',
                prop: 'orderTotal',
                RECORD_ID: '7',
                width: '',
              },
              {
                label: '未完成工单数',
                prop: 'notFinishOrderNum',
                RECORD_ID: '8',
                width: '',
              },
              { label: '完成率', prop: 'orderRate', RECORD_ID: '9', width: '' },
            ];
        this.tableData[0] = DTS.tgFinishList; //单位直派列表
        this.tableData[1] = DTS.typeFinishList; //单位完成列表
        this.tableData[2] = DTS.teamFinishList; //单位及时列表
        this.quyLoading = false;
      } else {
        this.$message.error(RT_D);
      }
    },
    // goNewPage() {
    //   this.showDialog = false;
    // },
    // 导出
    goAddEdit() {
      if (this.tableData.length > 0) {
        let content = this.$refs.conts;
        let contentClone = content.cloneNode(true);
        contentClone.style.position = 'fixed';
        contentClone.style.left = '-10000px';
        contentClone.style.top = '-10000px';
        contentClone.style.width = '100%';
        this.$refs.box.appendChild(contentClone);
        this.$nextTick(async () => {
          const title = document.createElement('div');
          title.style.cssText = 'font-size: 30px; font-weight: 700;';
          title.className = 'da-title';
          title.style.textAlign = 'center';
          title.style.marginTop = '20px';
          title.style.marginBottom = '20px';
          title.style.color = '#009b83';
          title.textContent = this.tableCount.orgName + '全业务工单化管理' + this.timeName;
          contentClone.insertBefore(title, contentClone.firstChild);
          const canvas = await html2canvas(contentClone, {
            scale: 0.8,
            allowTaint: true,
            logging: false,
            letterRendering: true,
          }); //width：1522 height:7016
          const doc = new jsPDF('p', 'mm', 'a4');
          let itemWidth = 210;
          let itemHeight = (canvas.height * itemWidth) / canvas.width; //969
          let pageHeight = doc.internal.pageSize.height;
          let heightLeft = itemHeight + 30;
          let position = 0;
          // 内容
          while (heightLeft > 0) {
            doc.addImage(
              canvas.toDataURL('image/jpeg', 0.7),
              'JPEG',
              0,
              position,
              itemWidth,
              itemHeight
            );
            heightLeft -= pageHeight;
            position -= pageHeight;
            if (heightLeft > 0) {
              doc.addPage();
            }
          }
          doc.save(this.tableCount.orgName + '全业务工单化管理' + this.timeName + '.pdf');
          this.$refs.box.removeChild(contentClone);
        });
      } else {
        this.$message.error('暂无数据可导出！');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.da-title {
  width: 100%;
  padding-top: 10px;
  text-align: center;
  font-size: 29px;
  font-weight: 700;
  color: #009b83;
  .img {
    cursor: pointer;
    position: absolute;
    top: 35px;
    right: 40px;
  }
}
.box {
  width: 100%;
  border-radius: 0px;
  .positionTab {
    width: 100%;
    cursor: pointer;
    background: #fff;
    color: #009b83;
    font-size: 12px;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    // justify-content: space-around;
    .itemTab {
      margin-right: 10px;
      height: 31px;
      line-height: 31px;
      width: 62px;
      text-align: center;
      &:first-child {
        // margin-left: 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    // .itemTab {
    //   height: 31px;
    //   line-height: 31px;
    //   width: 62px;
    //   text-align: center;
    //   &:first-child {
    //     // margin-left: 0;
    //     border-top-left-radius: 4px;
    //     border-bottom-left-radius: 4px;
    //   }

    //   &:last-child {
    //     border-top-right-radius: 4px;
    //     border-bottom-right-radius: 4px;
    //   }
    // }
  }
  .isActive {
    color: #fff;
    background: #14c893;
  }
  .content {
    width: 100%;
    height: 65vh;
    overflow: auto;
    .conts {
      // width: 100%;
      // height: 100%;
    }
    .items {
      margin: 16px;
      .titlb {
        display: flex;
        .title {
          width: 110px;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          background-color: #14c89c;
          clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 90% 0%);
          padding: 0 0 0 10px;
        }
        .icon {
          position: relative;
          top: 8px;
          left: -15px;
          width: 160px;
          height: 28px;
        }
      }
      // .itemtim {
      // .mintob {
      //   margin: 15px 0;
      //   text-indent: 2em;
      //   font-size: 16px;
      //   font-weight: 700;
      //   color: #3d3d3d;
      // }
      .text {
        line-height: normal;
        margin: 10px 0;
        text-indent: 2em;
        font-size: 14px;
        font-weight: 350px;
        color: #000;
        .colors {
          color: #31969a;
        }
        .colorc {
          color: #d9001b;
        }
      }
      // }
    }
  }
}
.btn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  .search-btn {
    margin-right: 16px;
    font-size: 14px;
    font-weight: 350;
    color: #ffffff;
    background: #009b83;
    width: 80px;
    height: 32px;
  }
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.has-gutter tr) {
  background-color: rgba(90, 206, 172, 0.75);
  th {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
  }
}
:deep.el-table thead.is-group th.el-table__cell {
  background: none;
}
:deep.el-table--fit {
  min-height: 200px;
}
:deep.el-table .sort-caret.ascending {
  border-bottom-color: #ffffff;
}
:deep.el-table .sort-caret.descending {
  border-top-color: #ffffff;
}
:deep.el-table .ascending .sort-caret.ascending {
  border-bottom-color: #009b83;
}
:deep.el-table .descending .sort-caret.descending {
  border-top-color: #009b83;
}
</style>
