/**
 * @description: 全局定义数据字典,从后端获取value值,对应展示文本内容.
 * 示例":   'WORK_PLAN_TYPE': {
                '01': '计划类型1',
                '02': '计划类型2',
                '01': '计划类型3',
                '04': '计划类型4',
            },
    用法:    $dict['WORK_PLAN_TYPE][data.type] 或 $dict.WORK_PLAN_TYPE[data.type]
*/

export default {
  /**
   * 弹窗宽度
   * 弹出层宽度共 4 种，分别是分别是 大尺寸（ 固定宽度为 1000px ）、中尺寸（ 固定宽度为 800px ）、小尺寸（ 固定宽度为680px ）、特小尺寸（ 固定宽度为480px ）
   */
  DIALOG_WIDTH: {
    LARGE: '1000px',
    MEDIUM: '800px',
    SMALL: '680px',
    MINI: '480px',
  },
  // 禁止选择未来日期
  DISABLE_FUTURE_DATE_OPTIONS: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  },
  /**
   * 工单类型配置状态标记图标
   * key 值目前是自定义0 1, 后期与后端联调时定义
   * value 值需与引入的图标的名称保持一致
   */
  ORDER_CONFIG_STATUS_ICON: {
    0: 'unconfigured',
    1: 'configured',
  },

  /**
   * 自定义枚举工单配置类型
   * 01:台区 02:高压用户
   */
  ORDER_CONFIG_TYPE: {
    '01': '公变台区',
    '02': '高压用户',
  },
  ORDER_CONFIG_TYPE_ZH: {
    公变台区: '01',
    高压用户: '02',
  },
};
