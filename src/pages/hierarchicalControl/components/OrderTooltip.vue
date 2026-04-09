<template>
  <div v-Clickoutside="handlerOutside" class="tooltip-box">
    <div class="card">
      <div class="card-top">
        <div class="left">
          <div class="title">{{ data.workOrderTypeName || '其他' }}</div>
          <div class="order-row">
            <span class="label-small">工单编号：</span>
            <span class="order-value">{{ data.appNo }}</span>
          </div>
        </div>

        <div class="status safe">{{ data.workStatus }}</div>
      </div>

      <div class="info">
        <div class="info-row">
          <span class="label">处 理 人：</span>
          <span class="value">{{ data.operator || '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">用户编号：</span>
          <span class="value">{{ data.consNo || '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">用户名称：</span>
          <span class="value">{{ data.consName || '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">电　　压：</span>
          <span class="value">{{ data.voltCode || '-' }}</span>
        </div>

        <div class="info-row address-row">
          <span class="label">安装地址：</span>
          <span class="value address">{{ data.address || '-' }}</span>
        </div>
      </div>
      <ul v-if="data.timeOutText" class="efficiency">
        <li>
          <span
            :class="[
              'eff-title',
              data.warningDegree === '03' ? 'error' : data.warningDegree === '02' ? 'warning' : '',
            ]"
            >效率偏差：</span
          >
          <span class="eff-text">{{ data.timeOutText }}</span>
        </li>
        <!-- <li>
          <span class="eff-title error">效率偏差：</span>
          <span class="eff-text">{{ efficiencyText }}</span>
        </li> -->
      </ul>

      <div class="detail" @click="onDetail">
        <!-- <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z" fill="currentColor"/>
        </svg> -->
        <span class="detail-text" @click="handlerDetail">查看详情</span>
      </div>
    </div>
  </div>
  <!-- <el-popover placement="right" width="400" trigger="click">
   
    <el-button slot="reference">click 激活</el-button>
  </el-popover> -->
</template>

<script>
import Clickoutside from 'element-ui/lib/utils/clickoutside';
export default {
  name: 'Popup',
  directives: { Clickoutside },
  props: {
    data: { type: Object, default: () => {} },
    title: { type: String, default: '计量装置更换' },
    statusText: { type: String, default: '待处理' },
    orderNo: { type: String, default: '212165116000001232' },
    handler: { type: String, default: '李四 - 13611241121' },
    userNo: { type: String, default: '9464969411' },
    userName: { type: String, default: '付天龙' },
    voltage: { type: String, default: '220V' },
    address: { type: String, default: '上海市浦东新区拱极路58弄1-188号' },
    efficiencyText: {
      type: String,
      default: '当前工单作业时常超出标准作业时间20%',
    },
  },
  methods: {
    onDetail() {
      this.$emit('detail');
    },
    handlerDetail() {
      const data = {
        TASK_ID: this.data.id,
        OLD_APP_NO: this.data.appNo,
        isNoShowBack: true,
      };
      window.localStorage.setItem('WorkOrderdetailData', JSON.stringify(data));
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/siteOperationPlatform_front/siteOperationPlatform_front/index.html?#/pages/workPlanManagementModule/WorkOrderdetail`;
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
    handlerOutside() {
      console.log('OrderTooltip关闭');
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
/* 容器（居中） */
.tooltip-box {
  /* border:1px solid black; */
  /* width:500px; */
}

/* 卡片：更宽更扁，接近图中比例 */
.card {
  width: 360px; /* 增宽 */
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  padding: 12px 14px; /* 适度紧凑 */
  box-sizing: border-box;
  font-family: 'Helvetica Neue', 'Microsoft YaHei', Arial, sans-serif;
  color: #222;
}

/* 顶部区域：标题 + 状态 */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* 左侧标题与工单号 */
.left {
  display: flex;
  flex-direction: column;
}

/* 标题 — 改为黑色 */
.title {
  font-size: 16px;
  font-weight: 600;
  color: #111111; /* 黑色 */
  margin-bottom: 8px;
}

/* 工单编号一行（小标题灰色，值为绿色） */
.order-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 13px;
}
.label-small {
  color: #8f8f8f; /* 小标题灰色 */
  font-size: 12px;
  width: 74px;
}
.order-value {
  color: #159b6a; /* 明绿，第一行为绿色 */
  font-weight: 600;
  word-break: break-all;
  font-size: 13px;
}

/* 状态右上角 */
.status {
  font-size: 12px;
  padding: 0px 4px;
  white-space: nowrap;
  &.safe {
    background: #2ba174;
    color: #fff;
  }
  &.warning {
    background: #f7b94b;
    color: #7a4500;
  }
}

/* 信息区，更紧凑的行距 */
.info {
  margin-top: 6px;
}

/* 每一行对齐：左为灰色小标题，右为值（首行已单独处理） */
.info-row {
  display: flex;
  align-items: flex-start;
  margin: 6px 0;
  font-size: 13px;
}

/* 小标题（灰色） */
.label {
  width: 74px;
  color: #8f8f8f; /* 你的第3条：小标题灰色 */
  font-size: 13px;
  line-height: 18px;
}

/* 值（默认黑色） */
.value {
  color: #111111; /* 黑色（第4条：后面的内容是黑色） */
  font-size: 13px;
  line-height: 18px;
  word-break: break-word;
}

/* 地址允许换行 */
.address {
  max-width: 250px;
  display: block;
}

/* 效率偏差区域：底色灰色；“效率偏差”四字为橙色（靠左），描述文字为深灰 */
.efficiency {
  background: #f3f3f3; /* 灰色底（第5条） */
  border-radius: 6px;
  padding: 8px 10px;
  margin-top: 10px;
  box-sizing: border-box;
  .eff-title {
    color: #99a09e;
    font-weight: 700;
    font-size: 12px;
    &.warning {
      color: #ff981b;
    }
    &.error {
      color: #fe3333;
    }
  }
  .eff-text {
    color: #99a09e; /* 深灰/褐色，易读 */
    font-size: 12px;
    line-height: 16px;
  }
}

/* 查看详情：图标在左，文字在右，单行水平布局（第6条） */
.detail {
  margin-top: 12px;
  cursor: pointer;
  user-select: none;
  color: #2ba174;
  text-align: center;
  font-size: 14px;
}

/* 图标样式（绿色，与图片一致） */
.icon {
  width: 22px;
  height: 22px;
  margin-right: 8px;
  color: #10b48f; /* 亮绿色 */
  flex-shrink: 0;
}

/* 小屏幕适配 */
/* @media (max-width:380px){
  .card { width: 94%; }
  .address { max-width: 180px; }
} */
</style>
