<template>
  <div class="new-safeweb-web cardbox-pd0 safe-box box-shadow-normal workflow">
    <div class="title box-linear-gradient">
      <el-tabs v-model="activeIndex" class="tabs" @tab-click="tabClick">
        <el-tab-pane
          v-for="(item, index) in tabs"
          :key="item.value"
          :label="item.label"
          :name="item.value"
          :disabled="remindersLoading"
        >
          <template #label>
            <span class="tab-label">
              {{ item.label }}
              <span v-if="tabNum[index]" class="message-badge">
                {{ tabNum[index] }}
              </span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="flex-row-end">
        <el-button class="el-btn-new reset-btn" size="small" @click="goBack">
          <img src="@/assets/images/icon-img/icon-fanhui.png" alt="" />
          返回
        </el-button>
      </div>
    </div>
    <!-- 查询条件区域 -->
    <el-header class="cardboxpd">
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
        <div class="flex-row-bw flex-wrap">
          <el-form-item v-show="activeIndex == '01'" label="消息标题" class="form-item-new">
            <el-input
              v-model="searchData.surpervisionTitle"
              class="input-box"
              placeholder="请输入"
              name="searchData.surpervisionTitle"
              auto-complete="on"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item v-show="activeIndex == '02'" label="工单类型" class="form-item-new">
            <el-cascader
              v-model="searchData.orderType"
              popper-class="orderTypes-class"
              :options="orderTypes"
              :props="orderTypeProp"
              :show-all-levels="false"
              collapse-tags
            ></el-cascader>
          </el-form-item>
          <!-- <el-form-item
            label="审批类型"
            class="form-item-new"
            v-show="activeIndex == '03'"
          >
            <el-select
              v-model="searchData.type"
              filterable
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in types"
                :key="index"
                :label="item.NAME"
                :value="item.VALUE"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item v-show="activeIndex == '04'" label="消息内容" class="form-item-new">
            <el-input
              v-model="searchData.surpervisionContent"
              class="input-box"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="activeIndex != '01'"
            label="接收时间"
            prop="dateTime"
            class="date-box form-item-new"
          >
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
    </el-header>
    <!-- 未读/已读 -->
    <div v-if="activeIndex != '01' && activeIndex != '03'" class="check-box">
      <div :class="boxClickIndex == '00' ? 'check-box-click' : ''" @click="boxClick('00')">
        {{ checkingName }} {{ checkingNum }}
      </div>
      <div :class="boxClickIndex == '01' ? 'check-box-click' : ''" @click="boxClick('01')">
        {{ checkedName }} {{ checkedNum }}
      </div>
    </div>
    <!-- 消息列表 -->
    <div style="flex: 1; height: calc(100% - 180px)">
      <el-main v-loading="remindersLoading" class="work-reminders">
        <div v-if="reminders.length" class="work-reminders-content">
          <template v-for="(item, index) in reminders">
            <div class="work-reminder">
              <!-- 消息item 第一行 -->
              <div class="work-reminder-left1">
                <div class="left">
                  <div class="img">
                    <img
                      v-if="activeIndex == '01'"
                      src="@/assets/images/hierarchicalControl/reminder1.png"
                      alt=""
                    />
                    <img
                      v-else-if="activeIndex == '03'"
                      src="@/assets/images/hierarchicalControl/reminder3.png"
                      alt=""
                    />
                    <img v-else src="@/assets/images/hierarchicalControl/reminder2.png" alt="" />
                  </div>
                  {{ item.title }}
                  <div v-if="activeIndex == '03'" class="card">
                    {{ item.approvalName }}
                  </div>
                </div>
                <div v-if="activeIndex == '03'" class="right">
                  <span
                    v-if="
                      item.appNo &&
                      item.approvalName != '积分申诉审批' &&
                      item.approvalName == '物资申领审批'
                    "
                  >
                    工单编号:
                    {{ item.appNo }}
                  </span>
                  <span
                    v-if="
                      item.wpNo &&
                      item.approvalName != '积分申诉审批' &&
                      item.approvalName == '物资申领审批'
                    "
                  >
                    计划编号:
                    {{ item.wpNo }}
                  </span>
                  <span
                    v-if="
                      item.wtNo &&
                      item.approvalName != '积分申诉审批' &&
                      item.approvalName == '物资申领审批'
                    "
                  >
                    工作票编号:
                    {{ item.wtNo }}
                  </span>
                  <span v-if="item.recordId && item.approvalName == '积分申诉审批'">
                    申诉编号:
                    {{ item.recordId }}
                  </span>
                  <span v-if="item.recordNo && item.approvalName == '物资申领审批'">
                    申请单号:
                    {{ item.recordNo }}
                  </span>
                </div>
              </div>
              <div class="work-reminder-box">
                <div class="work-reminder-left">
                  <!-- 消息item 第二行 -->
                  <div class="work-reminder-left2">
                    <span v-if="activeIndex == '01'">{{ item.text }}</span>
                    <div v-else>
                      <span v-if="item.stopPerson || item.appNo"
                        >{{ firstLineText(item) }}
                        {{ item.interestsType == '04' ? item.stopPerson : item.appNo }}</span
                      >
                      <span v-if="item.text1">
                        {{ secondLineText(item) }}
                        {{ item.text1 }}
                      </span>
                      <span v-if="item.stopAcceptTime">
                        暂停接单时间:
                        {{ item.stopAcceptTime }}
                      </span>
                    </div>
                  </div>
                  <!-- 消息item 第三行 -->
                  <div class="work-reminder-left3">
                    <div>
                      <div class="img">
                        <img src="@/assets/images/hierarchicalControl/reminder4.png" alt="" />
                      </div>
                      <span>{{ personLabel(item.title) }} {{ item.name }}</span>
                    </div>
                    <div>
                      <div class="img">
                        <img src="@/assets/images/hierarchicalControl/reminder5.png" alt="" />
                      </div>
                      <span>{{ timeLabel(item) }} {{ item.time }}</span>
                    </div>
                  </div>
                </div>
                <!-- 消息item 按钮 -->
                <!-- @click="(val) => { handleInput(600,btnClick,item, item_1) }" -->
                <div class="btns">
                  <div
                    v-for="item_1 in btns(item)"
                    class="btn"
                    @click="handleInput(item, item_1, index)"
                  >
                    <div class="img">
                      <img
                        v-if="item_1.type == '01'"
                        src="@/assets/images/hierarchicalControl/reminder6.png"
                        alt=""
                      />
                      <img
                        v-else-if="item_1.type == '03'"
                        src="@/assets/images/hierarchicalControl/reminder8.png"
                        alt=""
                      />
                      <img v-else src="@/assets/images/hierarchicalControl/reminder7.png" alt="" />
                    </div>
                    <div>{{ item_1.btnName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <nullData v-else style="height: 600px" />
      </el-main>
      <el-pagination
        v-if="reminders.length"
        class="cardbox manage-main-pagination"
        :disabled="remindersLoading"
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
    </div>

    <!-- 公告详情弹窗 -->
    <announcementDetails
      v-if="showAnnouncementDetails"
      :show-dialog="showAnnouncementDetails"
      :notice-id="noticeId"
      @close="closeAnnouncementDetails"
    ></announcementDetails>
    <!-- iframe弹窗组件 -->
    <iframe-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :src="currentSrc"
      :iframe-title="iframeTitle"
      :comp-id="compId"
      @close="closeDialog"
      @child-submitted="handleChildSubmit"
    />
    <!-- 督办单详情 -->
    <surpervisionEdit
      v-if="showSurpervisionEdit"
      :show-dialog="showSurpervisionEdit"
      :supervise-id="superviseId"
      @close="closeSurpervisionEdit"
    ></surpervisionEdit>
    <!-- 暂停接单记录详情 -->
    <pauseReceptWorkOrderConfigEdit
      :show-dialog="showEditOrDetialPauseRecept"
      :detail-data="configEdit"
      @close="closePauseRecept"
    >
    </pauseReceptWorkOrderConfigEdit>
    <!-- 工单挂起记录 -->
    <workOrderHangUpConfigEdit
      :show-dialog="showEditOrDetialWorkOrder"
      :detail-data="configEdit"
      @close="closeWorkOrder"
    >
    </workOrderHangUpConfigEdit>
  </div>
</template>

<script>
import nullData from '@/components/common/form/nullData.vue';
import announcementDetails from './components/announcementDetails.vue';
import iframeDialog from './components/iframeDialog.vue';
import surpervisionEdit from '../surpervision/components/surpervisionEdit.vue';
import pauseReceptWorkOrderConfigEdit from '../../pauseReceptWorkOrder/components/pauseReceptWorkOrderConfigEdit.vue';
import workOrderHangUpConfigEdit from '../../workOrderHangUp/components/workOrderHangUpConfigEdit.vue';
import API from '@/api/hierarchicalControl/workReminder.js';
import API1 from '@/api/hierarchicalControl/firstlevel.js';
import { setItemStorage } from '@/utils/index.js';

export default {
  name: 'WorkReminder',
  components: {
    nullData,
    announcementDetails,
    iframeDialog,
    surpervisionEdit,
    pauseReceptWorkOrderConfigEdit,
    workOrderHangUpConfigEdit,
  },
  data() {
    return {
      activeIndex: '01', // tabs下标
      tabs: [
        {
          label: '通知公告',
          value: '01',
        },
        {
          label: '待办工单',
          value: '02',
        },
        {
          label: '我的审批',
          value: '03',
        },
        {
          label: '我的关注',
          value: '04',
        },
      ],
      tabNum: [0, 0, 0, 0], // tabs消息数
      orderTypes: [], //作业类型下拉框
      orderTypeProp: {
        //作业类型选项框配置
        multiple: true,
        expandTrigger: 'hover',
        children: 'childList',
        label: 'codeName',
        value: 'codeValue',
        emitPath: false,
      },
      types: [], // 工单类型/审批类型
      remindersLoading: false,
      searchData: {
        // 查询条件合集
        surpervisionTitle: '',
        orderType: [],
        // type: "",
        surpervisionContent: '',
        dateTime: [],
      },
      boxClickIndex: '00', // 已读未读 按钮下边
      checkingNum: '0', // 未处理/未读数
      checkedNum: '0', // 已处理/已读数
      reminders: [], // 消息数据集合
      tableCount: 0,
      pageIndex: 1,
      pageSize: 10,

      showAnnouncementDetails: false,
      noticeId: '', // 公告详情id

      dialogVisible: false, // iframe弹窗显示状态
      token: '',
      iframeUrl: '',
      iframeTitle: '',
      orderNo: '',
      compId: '',

      superviseId: '', // 督办单ID
      showSurpervisionEdit: false,
      configEdit: {}, // 弹窗详情内容
      showEditOrDetialPauseRecept: false,
      showEditOrDetialWorkOrder: false,
      itemArrs: [],

      timer: null,
    };
  },
  computed: {
    checkingName() {
      return this.activeIndex == '02' ? '未处理' : this.activeIndex == '03' ? '未审批' : '未读消息';
    },
    checkedName() {
      return this.activeIndex == '02' ? '已处理' : this.activeIndex == '03' ? '已审批' : '已读消息';
    },
    // 采集iframeURL
    currentSrc() {
      return `${this.iframeUrl}?workOrderNo=${this.orderNo}&token=${this.token}&compId=${this.compId}`;
    },
    // 页面ip
    pageIp() {
      return this.$store.state.config_fileUrl ?? '';
    },
  },
  mounted() {
    this.getOrderTypes();
    let data = this.$route?.query ?? {};
    this.activeIndex = data?.tabsIndex || '01';
    this.searchSubmit();
  },
  methods: {
    handleInput(val, val2, index) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.btnClick(val, val2, index);
      }, 600);
    },
    // 消息按钮点击
    btnClick(data, btnData, index) {
      console.log(data, btnData);
      if (this.activeIndex == '02') {
        // 待办工单
        if (data.appNo) {
          // 判断是否有工单编号
          if (['0207', '0111'].includes(data.businessCode)) {
            if (!data.operatorNo) {
              this.goWrkOrderManagement(data.appNo);
              return;
            }
            // 批量工单走该逻辑
            let urlNames = {
              '01': 'ORDER_DETAIL',
              '02': 'BATCH_HANDLE',
              '03': 'BATCH_APPROVE',
            };
            this.iframeTitle = data.title;
            this.orderNo = data.appNo;
            this.compId = urlNames[btnData.type];
            this.getAcqSysCommonAuthorize(urlNames[btnData.type]);
          } else {
            // 其余工单的按钮逻辑
            if (btnData.type == '02') {
              // 去处理跳转工单中心
              this.goWrkOrderManagement(data.appNo);
            } else {
              // 查看详情跳转工单详情
              this.goWorkOrderdetail(data);
            }
          }
        } else {
          this.$message.error('工单ID为空,操作失败');
          return;
        }
      } else if (this.activeIndex == '01') {
        // 通知公告
        if (!data.noticeId) {
          this.$message.error('公告ID为空,查看公告详情失败');
          return;
        }
        this.noticeId = data.noticeId;
        this.showAnnouncementDetails = true;
      } else if (this.activeIndex == '03') {
        // 我的审批
        console.log('我的审批');
        if (btnData.type === '01') {
          if (data.approvalName == '物资申领审批') {
            this.handleView(data);
            return;
          }
          if (data.approvalName == '积分申诉审批') {
            this.goDetail(data);
            return;
          }
          this.goFlowPathPage(data);
        } else {
          if (data.approvalName == '物资申领审批') {
            this.handleApprove(data);
            return;
          }
          if (data.approvalName == '积分申诉审批') {
            this.goAudit(data);
            return;
          }
          this.empowerFn(data);
        }
      } else {
        // 我的关注
        if (!data.recordId) {
          this.$message.error('该消息ID为空,查看详情失败');
          return;
        }
        if (this.boxClickIndex == '00') {
          this.getRead(data.messageRecordId);
        }
        if (data.interestsType == '02') {
          if (['0207', '0111'].includes(data.businessCode)) {
            // 批量工单走该逻辑
            this.iframeTitle = data.title;
            this.orderNo = data.appNo;
            this.compId = 'ORDER_DETAIL';
            this.getAcqSysCommonAuthorize('ORDER_DETAIL');
          } else {
            // 查看详情跳转工单详情
            this.goWorkOrderdetail(data);
          }
        } else if (data.interestsType == '01') {
          // 走督办单详情
          this.superviseId = data.recordId;
          this.showSurpervisionEdit = true;
        } else if (data.interestsType == '04') {
          // 暂停接单记录详情
          this.showEditOrDetialPauseRecept = true;
          this.configEdit = this.itemArrs[index];
        } else if (data.interestsType == '03') {
          // 工单挂起记录
          this.showEditOrDetialWorkOrder = true;
          this.configEdit = this.itemArrs[index];
        }
      }
    },
    // 不同模块按钮点击事件
    // 获取采集系统授权信息接口
    getAcqSysCommonAuthorize(urlName) {
      let params = {
        redirectUrl: this.pageIp,
        urlName: urlName,
      };
      API.getAcqSysCommonAuthorize(params).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.token = DTS.token;
          this.iframeUrl = DTS.url;
          this.dialogVisible = true;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // iframe弹窗关闭
    closeDialog() {
      this.dialogVisible = false;
    },
    // iframe弹窗提交操作
    handleChildSubmit(data) {
      this.closeDialog();
      setTimeout(() => {
        this.searchSubmit();
      }, 2000);
    },
    // 跳转工单中心
    goWrkOrderManagement(appNo) {
      localStorage.setItem(
        'UnifiedAnalysisJump',
        JSON.stringify({
          searchContent: appNo,
          wkstStatus: ['01'],
          insertTimeList: this.searchData.dateTime,
        })
      );
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/#/pages/workPlanManagementModule/workOrderManagement`;
      } else {
        window.parent.openNewTab(
          {
            text: '工单管理',
            name: 'XB_GDZX',
          },
          {
            text: '工单中心',
            name: 'XB_GDZX',
            url: '/siteOperationPlatform_front/siteOperationPlatform_front/index.html#/pages/workPlanManagementModule/workOrderManagement',
          }
        );
      }
    },
    // 跳转工单详情
    goWorkOrderdetail(data) {
      localStorage.setItem(
        'WorkOrderdetailData',
        JSON.stringify({
          OLD_APP_NO: data.appNo,
          TASK_ID: data.taskId,
          isNoShowBack: true,
        })
      );
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/#/pages/workPlanManagementModule/WorkOrderdetail`;
      } else {
        window.parent.openNewTab(
          {
            text: '工单管理',
            name: 'XB_GDZX',
          },
          {
            text: '工单概要',
            name: 'XB_GDGY',
            url: '/siteOperationPlatform_front/siteOperationPlatform_front/index.html#/pages/workPlanManagementModule/WorkOrderdetail',
          }
        );
      }
    },

    // 我的审批跳转到物资申述审批页面
    handleApprove(row) {
      console.log('审批跳转到审批页面', row);
      row.history = '/hierarchicalControl/workReminder';
      setItemStorage({ name: 'dealConsumables', value: row });
      this.$router.push({
        path: '/productionFactors/components/approvePage',
      });
    },
    // 我的审批跳转到物资申述详情页面
    handleView(row) {
      console.log('查看跳转到审批详情', row);
      row.history = '/hierarchicalControl/workReminder';
      setItemStorage({ name: 'materialsDetails', value: row });
      this.$router.push({
        path: '/productionFactors/components/requisitionDetails',
      });
    },
    // 我的审批跳转积分审批详情页面
    goDetail(row) {
      const { recordId, approvalId } = row;
      this.$router.push({
        path: '/pointsAppealApproval/detail',
        query: {
          row: JSON.stringify({
            recordId,
            appealId: approvalId,
            history: '/hierarchicalControl/workReminder',
          }),
        },
      });
    },
    // 我的审批跳转积分审批审批页面
    goAudit(row) {
      const { recordId, approvalId } = row;
      this.$router.push({
        path: '/pointsAppealApproval/audit',
        query: {
          row: JSON.stringify({
            recordId,
            appealId: approvalId,
            history: '/hierarchicalControl/workReminder',
          }),
        },
      });
    },
    // 跳转流程页面
    goFlowPathPage(data) {
      if (data.PLAN_MARK == '04' || data.planMark == '04') {
        let obj = {
          RECORD_ID: data.WT_ID || data.wtId,
          PLAN_ID: data.RECORD_ID || data.wpId,
        };
        setItemStorage({
          name: 'dispatchTicket',
          value: { val: obj, url: '/hierarchicalControl/workReminder' },
        });
        if (process.env.NODE_ENV === 'development') {
          window.location.href =
            '/#/pages/orderManagementModule/dispatchTicket?history=/hierarchicalControl/workReminder';
        } else {
          window.location.href =
            '/siteOperationPlatform_front/siteOperationPlatform_front/index.html#/pages/orderManagementModule/dispatchTicket?history=/hierarchicalControl/workReminder';
          this.$store.commit('addTab', {
            route: '/pages/orderManagementModule/dispatchTicket',
            name: '详情',
          });
        }
        return;
      } else if (data.PLAN_SOURCE_NO == '05' || data.planSourceNo == '05') {
        let str = '';
        if (data.approvalType != '15') {
          str = `planId=${data.RECORD_ID || data.dataId}&history=/hierarchicalControl/workReminder`;
        }
        if (data.approvalType == '15') {
          str = `id=${data.RECORD_ID || data.dataId}&history=/hierarchicalControl/workReminder`;
        }
        let url = '#/pages/workflow/hubeiindex?' + str;
        if (process.env.NODE_ENV === 'development') {
          window.location.href = '/' + url;
        } else {
          window.location.href =
            '/siteOperationPlatform_front/siteOperationPlatform_front/index.html?v=' +
            this.$Vvalue +
            '' +
            url;
          this.$store.commit('addTab', { route: '/pages/workflow/hubeiindex', name: '详情' });
        }
      } else {
        let str = `id=${data.WP_TO_DO_ID || data.toDoId}&history=/hierarchicalControl/workReminder&workType=${data.WORK_TYPE_CODE}`;
        let url = '#/pages/workflow/index?' + str;
        if (process.env.NODE_ENV === 'development') {
          window.location.href = '/' + url;
        } else {
          window.location.href =
            '/siteOperationPlatform_front/siteOperationPlatform_front/index.html?v=' +
            this.$Vvalue +
            '' +
            url;
          this.$store.commit('addTab', { route: '/pages/workflow/index', name: '详情' });
        }
      }
    },
    // 点击我的审批操作按钮
    empowerFn(data) {
      // 我的审批判断
      // 01	计划审批（去审批）
      // 02	计划一审（去审批）
      // 03	计划二审（去审批）
      // 04	计划三审（去审批）
      // 05	取消计划审批（去审批）
      // 06	撤回计划审批
      // 07	工作票签发
      // 09	开工许可
      // 10	转移终结许可
      // 11	工作终结许可
      // 12	延期审批
      // 13	转派审批（WEB只展示“查看流程”。APP去审批，转派审批页面）
      // 14	派工单审批
      // 15	派工单审批(湖北)
      // 16	工单归档审批
      // 17 时间计划审批
      // 18	时间签发审批
      // 19	负责人计划审批
      // 20	负责人签发审批
      // 作业计划审批页面
      if (['01', '02', '03', '04', '05', '06'].includes(data.approvalType)) this.toApprovalPage();
      // 工单审批
      if (data.approvalType == '16') this.FilingApplication(data);
      // 跳转签发页面
      if (data.approvalType == '07') this.toIssuePage();
      // 跳转工作票许可页面
      if (['09', '10', '11', '12'].includes(data.approvalType)) this.toPermitPage(data);
      //跳转派工单待审批页面（14派工审批、14.2转派审批、14.8延期审批 ywd 20230609）
      //if(data.approvalType == '14') this.toPprovalPage()
      if (['14', '14.2', '14.8'].includes(data.approvalType)) this.toPprovalPage(data);
      //跳转湖北派工单待审批页面
      if (data.approvalType == '15') this.toPprovalPageHubei(data);

      //跳转计划变更审批页面 17时间 19工作负责人
      if (['17', '19'].includes(data.approvalType)) this.toApprovalPage(data.approvalType);
      //跳转签发变更审批页面 18时间 20工作负责人
      if (['18', '20'].includes(data.approvalType)) this.toIssuePage(data.approvalType);
    },
    // 跳转审批页面
    toApprovalPage(approvalType) {
      let params = {};
      params.toShenPiPage = '0';
      params.orgId = data.wpOrgNo;
      params.workTicketPlan = '1';
      params.ticketRecordId = data.wpId;
      params.approver = data.approver;
      params.dataType = data.dataType;
      params.workStatus = data.dataStatus;
      let url = '';
      if (['17', '19'].includes(approvalType)) {
        url = '/workPlan/queryChangePlanExamined';
      } else {
        url = '/workPlan/queryWorkPlanExamined';
      }
      this.$axios.post(this.url + url, params).then((res) => {
        if (!res.data.successful) {
          this.$message.error('获取作业计划详细信息失败！请刷新重试！');
          return;
        }
        if (!res.data.resultValue.items.length)
          return this.$message.error('未查询到该作业计划审批信息，请联系管理员！');
        let temp = res.data.resultValue.items[0];
        if (approvalType == '17') {
          //17是时间变更审批
          temp = {
            ...temp,
            RECORD_TYPE: '02',
            replacementPicId: data.approvalId,
            isModified: true,
          };
        }
        if (approvalType == '19') {
          //19是负责人变更审批
          temp = {
            ...temp,
            RECORD_TYPE: '01',
            replacementPicId: data.approvalId,
            isModified: true,
          };
        }
        setItemStorage({
          name: 'approvalId',
          value: { val: temp, url: '/hierarchicalControl/workReminder' },
        });
        if (this.tjIdentiy) {
          // 天津作业可视化审批侧滑弹窗
          this.$emit('openApproveDrawer', {
            conName: 'PlanApprove',
            params: { recordId: data.toDoId },
          });
        } else {
          let url = '#/pages/workPlanManagementModule/approve';
          if (process.env.NODE_ENV === 'development') {
            window.location.href = '/' + url;
          } else {
            window.location.href =
              '/siteOperationPlatform_front/siteOperationPlatform_front/index.html?v=' +
              this.$Vvalue +
              '' +
              url;
            this.$store.commit('addTab', {
              route: '/pages/workPlanManagementModule/approve',
              name: '详情',
            });
          }
        }
      });
    },
    //工单审批
    FilingApplication(dataNew) {
      //去归档页面的接口
      let data = {};
      data.APP_NO = dataNew.dataNo;
      data.OPERATOR_CODE = dataNew.pic;
      data.OPERATOR_NAME = dataNew.picPropertyId;
      data.ORG_ID = dataNew.orgId;
      ((data.PLAN_ID = dataNew.dataId),
        (data.PLAN_NO = dataNew.dataNo),
        (data.BTIME = dataNew.beginTime),
        (data.WT_WORK_STATUS = dataNew.wtWorkStatus),
        (data = JSON.stringify(data)));
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/#/pages/workPlanManagementModule/components/FilingApplication?type=shenpi&data=${data}`;
      } else {
        window.location.href = `/siteOperationPlatform_front/siteOperationPlatform_front/index.html?v=${this.$Vvalue}#/pages/workPlanManagementModule/components/FilingApplication?type=shenpi&data=${data}`;
        this.$store.commit('addTab', {
          route: '/pages/workPlanManagementModule/components/FilingApplication',
          name: '详情',
        });
      }
    },
    // 跳转签发页面
    toIssuePage(approvalType) {
      this.$axios
        .post(this.url + '/workTicket/queryWorkTicket', { filter: { workTicketId: data.wtId } })
        .then((res) => {
          if (!res.data.successful) {
            this.$message.error('获取工作票详细信息失败！请刷新重试！');
            return;
          }
          let temp = res.data?.resultValue?.items[0];
          if (approvalType == '18') {
            //17是时间变更审批
            temp = {
              ...temp,
              RECORD_TYPE: '02',
              replacementPicId: data.approvalId,
              isModified: true,
            };
          }
          if (approvalType == '20') {
            //20是负责人审批
            temp = {
              ...temp,
              RECORD_TYPE: '01',
              replacementPicId: data.approvalId,
              isModified: true,
            };
          }
          setItemStorage({
            name: 'Issuingoperation',
            value: { val: temp, url: '/hierarchicalControl/workReminder' },
          });
          if (this.tjIdentiy) {
            // 天津作业可视化审批侧滑弹窗
            this.$emit('openApproveDrawer', {
              conName: 'IssueTicket',
              params: { recordId: data.toDoId, slug: 'issue' },
            });
          } else {
            let url = '#/pages/workTicketManagementModule/Issuingoperation';
            if (process.env.NODE_ENV === 'development') {
              window.location.href = '/' + url;
            } else {
              window.location.href =
                '/siteOperationPlatform_front/siteOperationPlatform_front/index.html?v=' +
                this.$Vvalue +
                '' +
                url;
              this.$store.commit('addTab', {
                route: '/pages/workTicketManagementModule/Issuingoperation',
                name: '详情',
              });
            }
          }
        });
    },
    // 跳转许可页面
    toPermitPage(data) {
      this.$axios
        .post(this.url + '/workTicket/queryWorkTicket', { filter: { workTicketId: data.wtId } })
        .then((res) => {
          if (!res.data.successful) {
            this.$message.error('获取工作票详细信息失败！请刷新重试！');
            return;
          }
          setItemStorage({
            name: 'permitoperation',
            value: { val: res.data.resultValue.items[0], url: '/hierarchicalControl/workReminder' },
          });
          if (this.tjIdentiy) {
            // 天津作业可视化审批侧滑弹窗
            console.log('aaaaaaa', this.tjIdentiy);
            this.$emit('openApproveDrawer', {
              conName: 'PermitTicket',
              params: { recordId: data.toDoId, slug: 'permit' },
            });
          } else {
            let url = '#/pages/workTicketManagementModule/permitoperation';
            if (process.env.NODE_ENV === 'development') {
              window.location.href = '/' + url;
            } else {
              window.location.href =
                '/siteOperationPlatform_front/siteOperationPlatform_front/index.html?v=' +
                this.$Vvalue +
                '' +
                url;
              this.$store.commit('addTab', {
                route: '/pages/workTicketManagementModule/permitoperation',
                name: '详情',
              });
            }
          }
        })
        .catch((err) => {
          this.$message.error('会话连接超时!请刷新重试！');
        });
    },
    // 跳转派工单审批页面
    toPprovalPage(data) {
      let newValue = '';
      if (data.approvalType == '14.2') {
        newValue = '13';
      } else if (data.approvalType == '14.8') {
        newValue = '12';
      } else {
        newValue = '14';
      }
      let obj = {
        RECORD_ID: data.wtId,
        WT_NO: data.wtNo,
        PERSON_NAME_FZR: data.picName,
        WT_APPROVE_TYPE: newValue,
        PLAN_ID: data.wtId,
      };
      setItemStorage({
        name: 'Dispatching',
        value: { val: obj, url: '/hierarchicalControl/workReminder' },
      });
      if (process.env.NODE_ENV === 'development') {
        window.location.href =
          '/#/pages/orderManagementModule/DispatchListApproval?history=/pages/hierarchicalControl/workReminder';
      } else {
        window.location.href =
          '/siteOperationPlatform_front/siteOperationPlatform_front/index.html#/pages/orderManagementModule/Dispatching';
        this.$store.commit('addTab', {
          route: '/pages/orderManagementModule/DispatchListApproval',
          name: '详情',
        });
      }
    },
    // 跳转湖北派工单审批页面
    toPprovalPageHubei(data) {
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/#/pages/orderManagementModule/DispatchingHubei?id=${data.dataId}`;
      } else {
        window.location.href = `/siteOperationPlatform_front/siteOperationPlatform_front/index.html?v=${this.$Vvalue}#/pages/orderManagementModule/DispatchingHubei?id=${data.dataId}`;
        this.$store.commit('addTab', {
          route: '/pages/orderManagementModule/DispatchingHubei',
          name: '审批',
        });
      }
    },

    // 公告详情弹窗关闭
    closeAnnouncementDetails() {
      this.showAnnouncementDetails = false;
      this.searchSubmit();
    },

    // 督办单弹窗关闭
    closeSurpervisionEdit() {
      this.showSurpervisionEdit = false;
      this.searchSubmit();
    },
    // 暂停接单记录详情关闭
    closePauseRecept() {
      this.showEditOrDetialPauseRecept = false;
      this.searchSubmit();
    },
    // 工单挂起记录关闭
    closeWorkOrder() {
      this.showEditOrDetialWorkOrder = false;
      this.searchSubmit();
    },
    // 消息转换已读
    async getRead(messageRecordId) {
      let res = await API.read({ recordId: messageRecordId });
    },

    // tabs切换
    tabClick() {
      this.reminders = [];
      this.checkingNum = '0';
      this.checkedNum = '0';
      this.refresh();
    },
    // 已读未读点击
    boxClick(index) {
      this.boxClickIndex = index;
      this.pageIndex = 1;
      this.pageSize = 10;
      this.searchSubmit();
    },
    refresh() {
      this.searchData = {
        surpervisionTitle: '',
        orderType: [],
        // type: "",
        surpervisionContent: '',
        dateTime: [],
      };
      this.pageIndex = 1;
      this.pageSize = 10;
      this.boxClickIndex = '00';
      this.searchSubmit();
    },
    // 查询消息数据
    searchSubmit() {
      this.getApprovalList();
      if (this.activeIndex == '01') {
        this.quertNoticeList();
      } else if (this.activeIndex == '02') {
        this.getPendingList();
      } else if (this.activeIndex == '04') {
        this.getMyInterestsList();
      } else if (this.activeIndex == '03') {
        this.getUserApproveList();
      }
    },
    // 通知公告查询
    quertNoticeList() {
      this.remindersLoading = true;
      let params = {
        keyWord: this.searchData.surpervisionTitle,
        logo: 'workBench',
        noticeType: null,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };
      API.quertNoticeList(params)
        .then((res) => {
          this.remindersLoading = false;
          const { successful, resultValue } = res.data;
          if (successful) {
            let arr = [];
            let data = resultValue?.items ?? [];
            data?.forEach((item) => {
              arr.push({
                noticeId: item.noticeId,
                title: `${item.noticeTitle}`,
                text: item.noticeContent,
                name: item.publisher,
                time: item.publishTime,
              });
            });
            this.reminders = arr;
            this.tableCount = resultValue?.itemCount ?? 0;
          } else {
            this.$message.error(`请联系管理员`);
          }
        })
        .catch((error) => {
          this.remindersLoading = false;
        });
    },
    // 待办工单查询
    getPendingList() {
      this.remindersLoading = true;
      let params = {
        businessCodes: this.searchData.orderType.join(','),
        endDate: this.searchData.dateTime?.[1] ? this.searchData.dateTime?.[1] + ' 23:59:59' : '',
        processStatus: this.boxClickIndex,
        startDate: this.searchData.dateTime?.[0] ? this.searchData.dateTime?.[0] + ' 00:00:00' : '',
        current: this.pageIndex,
        pageSize: this.pageSize,
      };
      API.getPendingList(params)
        .then((res) => {
          this.remindersLoading = false;
          const { RT_F, RT_D, DTS } = res.data;
          if (RT_F == 1 && DTS) {
            this.checkingNum = DTS?.unprocessCounts ?? '0';
            this.checkedNum = DTS?.processedCounts ?? '0';
            let arr = [];
            let data = DTS?.pendingWorkOrderList ?? [];
            data?.forEach((item) => {
              arr.push({
                approveOperatorNo: item.approveOperatorNo,
                operatorNo: item.operatorNo,
                businessCode: item.businessCode,
                title: `${item.businessName}工单`,
                taskId: item.recordId,
                appNo: item.appNo,
                text1: item.errorInfo,
                name: item.operatorName,
                time: item.overdureDate,
              });
            });
            this.reminders = arr;
            this.tableCount =
              this.boxClickIndex == '00'
                ? (DTS?.unprocessCounts ?? 0)
                : (DTS?.processedCounts ?? 0);
          } else {
            this.$message.error(`${RT_D}`);
          }
        })
        .catch((error) => {
          this.remindersLoading = false;
        });
    },
    // 我的关注查询
    getMyInterestsList() {
      this.remindersLoading = true;
      let params = {
        content: this.searchData.surpervisionContent,
        readFlag: this.boxClickIndex == '00' ? 0 : 1,
        current: this.pageIndex,
        pageSize: this.pageSize,
        sendEndDate: this.searchData.dateTime?.[1] ?? '',
        sendStartDate: this.searchData.dateTime?.[0] ?? '',
      };
      API.getMyInterestsList(params)
        .then((res) => {
          this.remindersLoading = false;
          const { RT_F, RT_D, DTS } = res.data;
          if (RT_F == 1 && DTS) {
            this.checkingNum = DTS?.notReadTotal ?? '0';
            this.checkedNum = DTS?.readTotal ?? '0';
            let arr = [];
            let data = DTS?.data ?? [];
            this.itemArrs = DTS?.data ?? [];
            data?.forEach((item) => {
              arr.push({
                interestsType: item.interestsType, // 关注类型 01督办 02工单
                recordId: item.interestsDataId, // 工单id或督办id
                businessCode: item.businessCode, // 工单类型
                taskId: item.interestsDataId, // 工单id
                title: item.interestsTitle,
                appNo: item.interestsNum, // 工单编号
                text1: item.interestsContent,
                name: item.createName,
                time:
                  item.interestsType == '03'
                    ? item.pendingTIme
                    : item.interestsType == '04'
                      ? item.submitTime
                      : item.needFinishTime,
                stopAcceptTime: item.stopAcceptTime,
                stopPerson: item.stopPerson,
                messageRecordId: item.recordId, // 消息id处理已读未读
              });
            });
            this.reminders = arr;
            this.tableCount = DTS?.total;
          } else {
            this.$message.error(`${RT_D}`);
          }
        })
        .catch((error) => {
          this.remindersLoading = false;
        });
    },
    // 我的审批
    getUserApproveList() {
      this.remindersLoading = true;
      let params = {
        orgNo: this.$store.state.UserData.orgId || '',
        stateNo: '01', // 全部
        current: this.pageIndex,
        pageSize: this.pageSize,
        startDate: this.searchData.dateTime?.[0] ?? '',
        endDate: this.searchData.dateTime?.[1] ?? '',
      };
      API.getApprovalListNew(params)
        .then((res) => {
          this.remindersLoading = false;
          const { RT_F, RT_D, DTS } = res.data;
          if (RT_F == 1 && DTS) {
            let arr = [];
            let data = DTS?.approvalListVos ?? [];
            data?.forEach((item) => {
              arr.push({
                ...item,
                title: item.workType, // 标题
                appNo: item.interestsNum, // 工单编号
                recordId: item.dataNo, // 积分id
                appealId: item.appealId, // 积分id2
                recordNo: item.dataNo, // 物资申述id
                requestTypeCodes: item.dataStatus, // 物资工器具分类编码
                text1: item.content, // 内容
                name: item.picName, // 人
                time:
                  item.approvalName == '积分申诉审批' || item.approvalName == '物资申领审批'
                    ? item.beginTime
                    : item.processedDate, // 时间
              });
            });
            this.reminders = arr;
            this.tableCount = DTS?.approvalHeaderVos[0].stateNum;
          } else {
            this.$message.error(`${RT_D}`);
          }
        })
        .catch((error) => {
          this.remindersLoading = false;
        });
    },

    // 分页
    sizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.searchSubmit();
    },
    pageChange(val) {
      this.pageIndex = val;
      this.searchSubmit();
    },
    // 获取各tabs头标数量
    getApprovalList() {
      API.getApprovalList({}).then((res) => {
        const { RT_F, RT_D, DTS } = res.data;
        if (RT_F == 1 && DTS) {
          this.tabNum[3] = DTS?.myInterestsNum ?? 0;
          this.tabNum[2] = DTS?.myApprovalNum ?? 0;
          this.tabNum[1] = DTS?.myOrderNum ?? 0;
        } else {
          this.$message.error(`${RT_D}`);
        }
      });
    },
    // 按钮合集
    btns(data) {
      const defaultBtn = [
        {
          btnName: '去看详情',
          type: '01',
        },
      ];
      // 根据 activeIndex 进行主要分支判断
      switch (this.activeIndex) {
        case '01':
          return defaultBtn;
        case '02':
          // 二级判断：根据 boxClickIndex
          if (this.boxClickIndex === '00') {
            if (['0207', '0111'].includes(data.businessCode)) {
              if (data.approveOperatorNo) {
                return [
                  ...defaultBtn,
                  {
                    btnName: '去审批',
                    type: '03',
                  },
                ];
              } else {
                return [
                  ...defaultBtn,
                  {
                    btnName: '去处理',
                    type: '02',
                  },
                ];
              }
            } else {
              return [
                ...defaultBtn,
                {
                  btnName: '去处理',
                  type: '02',
                },
              ];
            }
          } else {
            return defaultBtn;
          }
        case '03':
          // 二级判断：根据 boxClickIndex
          if (this.boxClickIndex === '00') {
            return [
              ...defaultBtn,
              {
                btnName: '去审批',
                type: '03',
              },
            ];
          } else {
            return defaultBtn;
          }

        default:
          return defaultBtn;
      }
    },
    // 第二行文本（标签部分）
    firstLineText(item) {
      if (item.interestsType === '04') {
        return '暂停接单人员:';
      }
      return '工单编号:';
    },
    // 第二行文本（标签部分）
    secondLineText(item) {
      if (this.activeIndex === '03') {
        return '申述原因:'; // 改
      }
      if (item.interestsType === '04') {
        return '暂停接单原因:';
      }
      if (item.interestsType === '03') {
        return '挂起原因:';
      }
      return '异常描述:';
    },
    personLabel(title) {
      if (this.activeIndex == '03') {
        return '';
      } else {
        return this.boxClickIndex == '01' || this.activeIndex == '02' ? '处理人:' : '编辑人:';
      }
    },
    timeLabel(item) {
      if (this.activeIndex == '03') {
        return '';
      } else if (this.activeIndex == '04') {
        return item.interestsType == '03'
          ? '挂起时间:'
          : item.interestsType == '04'
            ? '提交时间:'
            : '要求完成时间:';
      } else {
        return this.boxClickIndex == '01' || this.activeIndex == '02'
          ? '要求完成时间:'
          : '通知时间:';
      }
    },
    // 获取工单类型下拉数据
    async getOrderTypes() {
      const res = await API1.getOrderTree({});
      this.orderTypes = res.data.DTS || [];
      this.orderTypes.push({
        childList: [
          {
            codeName: '其他',
            codeValue: '9999',
          },
        ],
        codeName: '其他',
        codeValue: '9999',
        pcodeValue: null,
      });
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.workflow {
  width: 1560px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.title {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
}
.tab-label {
  position: relative;
}
.message-badge {
  position: absolute;
  top: -12px;
  right: -40px;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: #f03123;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}
.check-box {
  height: 32px;
  display: flex;
  div {
    width: 102px;
    margin-left: 18px;
    background: #f5f7f7;
    color: #666666;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
  }
  div.check-box-click {
    background: rgba(0, 155, 131, 0.1);
    color: #009b83;
  }
}

.work-reminder {
  border-bottom: 1px solid #e9ebef;
  padding: 24px 24px 12px 24px;
  .work-reminder-left1 {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      line-height: 18px;
      color: #426170;
      .img {
        width: 18px;
        height: 18px;
        margin-right: 12px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .card {
        background: #fae9e9;
        padding: 0 8px;
        // width: 72px;
        height: 20px;
        border-radius: 4px;
        color: #e73434;
        font-size: 12px;
        font-weight: normal;
        line-height: 20px;
        text-align: center;
        margin-left: 12px;
      }
    }
    .right {
      font-size: 14px;
      font-weight: bold;
      line-height: 18px;
      color: #99a09e;
      margin-right: 8px;
    }
  }
  .work-reminder-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .work-reminder-left {
      width: 60%;
      .work-reminder-left2 {
        font-size: 14px;
        font-weight: normal;
        line-height: 18px;
        color: #426170;
        margin: 12px;
        span {
          margin-right: 48px;
        }
        .green {
          color: #009b83;
        }
        .red {
          color: #f03123;
        }
      }
      .work-reminder-left3 {
        font-size: 12px;
        font-weight: normal;
        color: #99a09e;
        display: flex;
        align-items: center;
        & > div {
          margin-right: 24px;
          display: flex;
          align-items: center;
        }
        .img {
          width: 14px;
          height: 14px;
          margin-right: 12px;
        }
      }
    }
    .btns {
      display: flex;
      .btn {
        font-size: 14px;
        font-weight: normal;
        color: #009b83;
        display: flex;
        align-items: center;
        margin-right: 16px;
        cursor: pointer;
        .img {
          width: 14px;
          height: 14px;
          margin-right: 6px;
        }
      }
    }
  }
}
.work-reminders {
  margin-bottom: 12px;
  height: calc(100% - 50px);
}
:deep(.el-cascader) {
  width: 100%;
  line-height: 32px !important;
  height: 32px !important;
}
:deep(.el-input__inner) {
  line-height: 32px !important;
  height: 32px !important;
}

:deep(.el-tabs) {
  height: 70px;
}
:deep(.el-tabs__header) {
  margin: 0;
  height: 70px;
  div {
    height: 100%;
  }
  .el-tabs__active-bar {
    height: 2px;
  }
}
:deep(.el-tabs__nav-wrap::after) {
  opacity: 0;
}
:deep(.el-tabs__item) {
  width: 170px;
  text-align: center;
  line-height: 70px;
  font-size: 18px;
  font-weight: 600;
}
:deep(.el-tabs__item.is-active) {
  background-color: #fff;
  border-radius: 12px 12px 0 0;
}
:deep(.is-top:nth-child(2)) {
  padding-left: 20px !important;
}
:deep(.is-top:last-child) {
  padding-right: 20px !important;
}
</style>
