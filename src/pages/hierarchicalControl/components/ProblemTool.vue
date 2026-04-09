<template>
  <div class="problem-tooltip-box">
    <div class="title">{{ name }}</div>
    <div class="flex-row-vcenter value">
      <i></i>问题总数：<span>{{ qualityProblemCount + riskProblemCount }}</span>
    </div>
    <div class="flex-row-vcenter value">
      <i></i>质量问题数：<span>{{ qualityProblemCount }}</span>
    </div>
    <div class="flex-row-vcenter value">
      <i></i>风险问题数：<span>{{ riskProblemCount }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: '上海',
    },
    qualityProblemCount: {
      type: Number,
      default: 0,
    },
    riskProblemCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="scss">
.problem-tooltip-box {
  box-sizing: border-box;
  padding: 16px 12px;
  width: 158px;
  height: 134px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  .title {
    color: $color-primary;
    font-size: $font-sm;
  }
  .value {
    margin: 6px 0;
    color: $font-color-light;
    i {
      margin-right: 10px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #7b807e;
    }
    span {
      margin-left: 6px;
      color: $font-color-main;
    }
  }
}
</style>
