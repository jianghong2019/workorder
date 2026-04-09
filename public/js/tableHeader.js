/**
 * @描述信息: 表格表头配置
 * @Author: zwm
 * @Date: 2022/2/11
 */

export default {
  /*外部队伍表头信息*/
  extTeamManagement: [{
      prop: "UNIT_NAME",
      label: "外部单位",
      width: "220"
    },
    {
      prop: "TEAM_NAME",
      label: "队伍名称",
      width: "220"
    },
    {
      prop: "TEAM_TYPE",
      label: "队伍类型",
      width: "150"
    },
    {
      prop: "EXT_TEAM_USER_NUM",
      label: "人数",
      width: "100"
    },
    {
      prop: "TIAFFIC_RECORD_NUM",
      label: "违章记录",
      width: "120"
    },
    {
      prop: "EXT_TEAM_SERVER_NUM",
      label: "服务单位数",
      width: "150"
    },
    {
      prop: "TEAM_LEADER",
      label: "负责人",
      width: "100"
    },
    {
      prop: "CONTACT_NO",
      label: "联系电话",
      width: "130"
    },
    {
      prop: "START_DATE",
      label: "成立时间",
      width: "120"
    }
  ],
  /*外包人员弹窗信息表头*/
  outsourcingList: [{
      prop: "PERSON_NAME",
      label: "人员姓名",
      width: "150",
    },
    {
      prop: "SKILLS",
      label: "专业技能",
      width: "150",
    },
    {
      prop: "THEEKINDSIDENITFICATION_NAME",
      label: "三种人标识",
      width: "150",
    },
    {
      prop: "WORK_YEARS",
      label: "工作年限",
      width: "150",
    },
    {
      prop: "TECHNICAL",
      label: "职称",
      width: "150",
    },
    {
      prop: "TEL",
      label: "联系方式",
      width: "150",
    }
  ],
  /*违章记录弹窗表头*/
  violationList: [{
      prop: "TIAFFIC_NO",
      label: "违章记录编号",
      width: "220",
    },
    {
      prop: "VOILATION_TYPE",
      label: "违章类别",
      width: "150",
    },
    {
      prop: "VOILATION_LEVEL",
      label: "违章等级",
      width: "150",
    },
    {
      prop: "VOILATION_DESC",
      label: "违章描述",
      width: "150",
    },
    {
      prop: "PLAN_NO",
      label: "计划编号",
      width: "100",
    },
    {
      prop: "WORK_NO",
      label: "业务分类",
      width: "150",
    },
    {
      prop: "WT_NO",
      label: "工作票编号",
      width: "120",
    },
    {
      prop: "RECTIFY_LEADER_ID",
      label: "工作负责人",
      width: "100",
    },
    {
      prop: "APP_NO",
      label: "工单编号",
      width: "130",
    },
    {
      prop: "APP_TYPE",
      label: "工单类型",
      width: "120",
    },
    {
      prop: "CHECK_TYPE",
      label: "检查类型",
      width: "120",
    },
    {
      prop: "statu",
      label: "通报状态",
      width: "120",
    },
    {
      prop: "CREATOR",
      label: "核查人",
      width: "120",
    },
    {
      prop: "CREATE_TIME",
      label: "核查时间",
      width: "120",
    }
  ]
}
