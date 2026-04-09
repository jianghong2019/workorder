<template>
  <div class="person-tooltip-box">
    <div class="title">{{ name }}</div>
    <div class="flex-row-vcenter value">
      <i></i>作业人员：<span>{{ workCount }}</span>
    </div>
    <div class="flex-row-vcenter value">
      <i></i>主业人员：<span>{{ mainCount }}</span>
    </div>
    <div class="flex-row-vcenter value">
      <i></i>外包人员：<span>{{ outCount }}</span>
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
    workCount: {
      type: Number,
      default: 0,
    },
    mainCount: {
      type: Number,
      default: 0,
    },
    outCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="scss">
.person-tooltip-box {
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
