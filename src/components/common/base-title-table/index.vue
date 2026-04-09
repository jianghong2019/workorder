<template>
  <div
    class="title-com box-linear-gradient flex-row-bw flex-row-vcenter"
    :class="{ border: isborder }"
    :style="{ height: height + 'px' }"
  >
    <div class="flex-row-vcenter">
      <slot v-if="showTitleIcon" name="left">
        <span class="titleicon"></span>
      </slot>
      <span class="title-text flex-row-vcenter">{{ title }}</span>
      <slot name="subTitle"></slot>
    </div>
    <slot name="content"></slot>
    <div class="flex-row-vcenter title-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    isborder: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '60',
    },
    showTitleIcon: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
.title-com {
  padding: 0 $spacing-base;
}
.titleicon {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  display: block;
  vertical-align: middle;
  margin-right: 10px;
  background: linear-gradient(180deg, $color-primary 80%, $color-primary 100%);
}
.title-text {
  position: relative;
  color: $font-color-dark;
  font-size: $font-big;
  font-weight: 700;
}
@media screen and (max-width: 1440px) {
  .title-text {
    font-size: 18px;
  }
}
.border {
  border-bottom: 1px solid #e5e5e5;
}
</style>
