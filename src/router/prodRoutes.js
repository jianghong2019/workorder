import { defineAsyncComponent } from 'vue';
export default [
  // {
  //   path: '/responsibilityFied',
  //   name: '责任田',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/responsibilityFied/index.vue')
  //   ),
  //   // children: [
  //   //   {
  //   //     path: "leftMenu",
  //   //     name: "工单首页左侧菜单",
  //   //     isShow: true, //是否显示在菜单中
  //   //     component: defineAsyncComponent(() =>
  //   //       import("@/components/pages/responsibilityFied/views/responsibilityFied.vue")
  //   //     ),
  //   //   }
  //   // ],
  // },
  // {
  //   path: '/hierarchicalControl',
  //   name: '分级管控',
  //   isShow: true,
  //   meta: {
  //     keepAlive: true,
  //   },
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/index.vue')
  //   ),
  // },
  // {
  //   path: '/productionFactors',
  //   name: '生产要素',
  //   isShow: true,
  //   component: defineAsyncComponent(() => import('@/components/pages/productionFactors/index.vue')),
  // },
  // {
  //   path: '/inventoryPlanIndex',
  //   name: '盘点计划管理',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/inventoryPlan/inventoryPlanIndex.vue')
  //   ),
  // },
  // {
  //   path: '/inventoryReview',
  //   name: '盘点计划复核',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/inventoryPlan/inventoryReview.vue')
  //   ),
  // },
  {
    path: '/workOrderHangUp',
    name: '工单挂起记录',
    isShow: true,
    component: () => import('@/pages/workOrderHangUp/index.vue'),
  },
  // {
  //   path: '/pauseReceptWorkOrder',
  //   name: '暂停接单记录',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/pauseReceptWorkOrder/index.vue')
  //   ),
  // },
  // {
  //   path: '/fiveDimensionEvaluation',
  //   name: '五维评价',
  //   isShow: true,
  //   component: defineAsyncComponent(() => import('@/components/pages/workOrderHangUp/index.vue')),
  // },
  // {
  //   path: '/ruleConfiguration',
  //   name: '五维评价规则配置',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/fiveDimensionEvaluation/ruleConfiguration/index.vue')
  //   ),
  // },
  // {
  //   path: '/fiveDimensionEvaluation/workerCapabilityProfile',
  //   name: '人员能力画像',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/fiveDimensionEvaluation/workerCapabilityProfile/index.vue')
  //   ),
  // },
  // {
  //   path: '/pointsAppealApproval',
  //   name: '积分申诉审批',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/fiveDimensionEvaluation/pointsAppealApproval/index.vue')
  //   ),
  // },
  // {
  //   path: '/pointsAppealApproval/audit',
  //   name: '积分申诉审批审批',
  //   isShow: false,
  //   component: defineAsyncComponent(
  //     () =>
  //       import('@/components/pages/fiveDimensionEvaluation/pointsAppealApproval/ApprovalAudit.vue')
  //   ),
  // },
  // {
  //   path: '/pointsAppealApproval/detail',
  //   name: '积分申诉审批详情',
  //   isShow: false,
  //   component: defineAsyncComponent(
  //     () =>
  //       import('@/components/pages/fiveDimensionEvaluation/pointsAppealApproval/ApprovalDetail.vue')
  //   ),
  // },
  // {
  //   path: '/workTerminalVerify',
  //   name: '作业终端核查',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/fiveDimensionEvaluation/workTerminalVerify/index.vue')
  //   ),
  // },
  // {
  //   path: '/riskPerventionLedger',
  //   name: '风险防范问题台账管理',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/fiveDimensionEvaluation/riskPerventionLedger/index.vue')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/surpervision',
  //   name: '督办列表',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/surpervision/index.vue')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/order',
  //   name: '工单总览',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/order/index.vue')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/personnelStatistics',
  //   name: '人员情况统计',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/personnelStatistics/index.vue')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/workReminder',
  //   name: '工作提醒',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/workReminder/index.vue')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/alarmSetting',
  //   name: '分级管控预警规则配置',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/alarmSetting/index.vue')
  //   ),
  // },
  // {
  //   path: '/productionFactors/materialsConsumables',
  //   name: '物资与工器具管理',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/materialsConsumables')
  //   ),
  // },
  // {
  //   path: '/productionFactors/materialAllocation',
  //   name: '生产要素配置',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/materialAllocation')
  //   ),
  // },
  // {
  //   path: '/productionFactors/components/materialsDetails',
  //   name: '物资与工器具管理',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/components/materialsDetails')
  //   ),
  // },
  // {
  //   path: '/productionFactors/components/requisitionDetails',
  //   name: '生产要素审批',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/components/requisitionDetails')
  //   ),
  // },
  // {
  //   path: '/productionFactors/dealConsumables',
  //   name: '生产要素审批',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/dealConsumables')
  //   ),
  // },
  // {
  //   path: '/productionFactors/components/approvePage',
  //   name: '生产要素审批',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactors/components/approvePage')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/problemmMoniMore',
  //   name: '问题监控更多',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/problemmMoniMore/index.vue')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/productionFactorsMore',
  //   name: '生产要素更多',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/productionFactorsMore/index.vue')
  //   ),
  // },
  // {
  //   path: '/hierarchicalControl/warningStatistics',
  //   name: '预警统计',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/hierarchicalControl/warningStatistics/index.vue')
  //   ),
  // },
  // {
  //   path: '/mapJsonGather',
  //   name: '地图标注',
  //   isShow: true,
  //   component: defineAsyncComponent(() => import('@/components/pages/mapJsonGather/index.vue')),
  // },
  // {
  //   path: '/board',
  //   name: '生产要素看板',
  //   isShow: true,
  //   component: defineAsyncComponent(
  //     () => import('@/components/pages/productionFactorBoard/index.vue')
  //   ),
  // },
  {
    path: '/nullAuth',
    name: '暂无权限',
    isShow: true,
    component: () => import('@/pages/noPermission.vue'),
  },
];
