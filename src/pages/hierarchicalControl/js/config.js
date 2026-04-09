export const mapconfig = {
  //思极地图sdk引入所需地址与秘钥配置
  srcSdk: 'http://172.29.192.164:12001/maps?v=3.0.0',
  appkey: '2416909a56f03b8faa2dc01d21fc4710',
  appsecret: '6ad810cb6ee232638021d65f223642c7',
  style: 'aegis://styles/aegis/Streets-v2',
  zoom: 10,
  // center: [118.74184497827201, 32.011873898178465],
  center: [121.71559228379567, 31.12201791250034],
  maxZoom: 24,
};
export const funBtnList = [
  {
    id: 'report',
    label: '报表生成',
    icon: require('../../../assets/iconfont/icon/baobiao.svg'),
    event: 'report',
  },
  {
    id: 'surpervision',
    label: '督办消息',
    icon: require('../../../assets/iconfont/icon/duban.svg'),
    value: 0,
    event: 'jumpPage',
  },
  {
    id: 'workReminder',
    label: '工作提醒',
    icon: require('../../../assets/iconfont/icon/tixing.svg'),
    value: 0,
    prop: 'allNum',
    event: 'jumpPage',
  },
  {
    id: 'legend',
    label: '图例说明',
    icon: require('../../../assets/iconfont/icon/shuoming.svg'),
    event: 'legend',
  },
  {
    id: 'screen',
    label: '全屏预览',
    icon: require('../../../assets/iconfont/icon/quanping.svg'),
    event: 'screen',
  },
];
//路由跳转页面
export const routers = {
  surpervision: '/hierarchicalControl/surpervision', // 督办列表
  workReminder: '/hierarchicalControl/workReminder', // 工作提醒
  order: '/hierarchicalControl/order', // 工单总览
  warningStatistics: '/hierarchicalControl/warningStatistics', // 预警统计
  personnelStatistics: '/hierarchicalControl/personnelStatistics', // 人员情况统计
  productionFactorsMore: '/hierarchicalControl/productionFactorsMore', // 生产要素
  problemmMoniMore: '/hierarchicalControl/problemmMoniMore', // 问题监控
};
//地图控件配置项
export const controlConfig = [
  {
    id: '01',
    label: '全部',
    width: '500',
    hasChildren: false, //本级单位展示
    orderTree: true, //是否从orderTree接口获取下拉内容
    checkList: [],
    active: 'problemclick', //选中样式
    unactive: 'problemnormal', //未选中样式
    event: 'workOrder', //按钮点击触发事件名称
    filter: false, //是否展示筛选内容
  },
  {
    id: '02',
    label: '工单',
    width: '500',
    orderTree: true, //是否从orderTree接口获取下拉内容
    checkList: [],
    active: 'orderclick', //选中样式
    unactive: 'ordernormal', //未选中样式
    event: 'workOrder', //按钮点击触发事件名称
    filter: false, //是否展示筛选内容
  },
  {
    id: '03',
    label: '人员',
    width: '300',
    checkList: [
      {
        codeValue: 'person',
        codeName: '人员性质',
        checkAll: true,
        isIndeterminate: false,
        checkeds: ['02', '01'],
        childList: [
          {
            codeValue: '02',
            codeName: '主业人员',
          },
          {
            codeValue: '01',
            codeName: '外包人员',
          },
        ],
      },
    ],
    active: 'peopleclick', //选中样式
    unactive: 'peoplenormal', //未选中样式
    event: 'personNature', //按钮点击触发事件名称
    filter: false, //是否展示筛选内容
  },
  {
    id: '04',
    label: '问题',
    width: '300',
    hasChildren: true, //管辖单位展示
    checkList: [
      {
        codeValue: 'problem',
        codeName: '问题类型',
        checkAll: true,
        isIndeterminate: false,
        checkeds: ['04', '01'],
        width: '300px',
        childList: [
          {
            codeValue: '04',
            codeName: '质量问题',
          },
          {
            codeValue: '01',
            codeName: '风险问题',
          },
        ],
      },
    ],
    dateList: {
      label: '问题时间',
      active: '05',
      childList: [
        {
          label: '本周',
          value: '05',
        },
        {
          label: '本月',
          value: '02',
        },
        {
          label: '本年',
          value: '04',
        },
      ],
    },
    active: 'problemclick', //选中样式
    unactive: 'problemnormal', //未选中样式
    event: 'questionType', //按钮点击触发事件名称
    filter: false, //是否展示筛选内容
  },
];
//左侧卡片配置项
export const leftCardConfig = [
  {
    name: '工单管理',
    is: 'WorkOrderManageNext',
    hasChildren: true,
    toggle: true, //是否收起true未收起，false收起
  },
  {
    name: '工单管理',
    is: 'WorkOrderManage',
    hasChildren: false,
    toggle: true, //是否收起true未收起，false收起
  },
  {
    name: '预警情况',
    is: 'WarningSituation',
    hasChildren: false,
    toggle: true, //是否收起true未收起，false收起
  },
];
export const rightCardConfig = [
  //管辖单位
  {
    name: '问题监控',
    is: 'ProblemMonitor',
    hasChildren: true,
    toggle: true, //是否收起true未收起，false收起
  },
  {
    name: '生产要素',
    is: 'ProductionFactorsSub',
    hasChildren: true,
    toggle: true, //是否收起true未收起，false收起
  },
  //本级单位
  {
    name: '人员情况',
    is: 'PeopleSituation',
    hasChildren: false,
    toggle: true, //是否收起true未收起，false收起
  },
  {
    name: '生产要素',
    is: 'ProductionFactors',
    hasChildren: false,
    toggle: true, //是否收起true未收起，false收起
  },
];
