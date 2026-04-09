<template>
  <div class="new-safeweb-web title" :class="{ 'border-bottom': border }">
    <div class="flex-row-bw" :class="smallTitle ? 'smalltitle-content' : 'title-content'">
      <div class="title-bar flex-row-bw">
        <div v-if="titleIcon" class="title-icon"></div>
        <div v-if="required" class="require">*</div>
        <div v-if="!smallTitle" :class="back ? 'title-text2' : 'title-text'">{{ baseTitle }}</div>
        <div v-if="totalNum" class="totalNum">
          <span class="m-l-4 text-#999999">|</span> {{ totalNum }}
        </div>
        <slot name="text-tip" />
        <div v-if="smallTitle" class="title-text3">{{ smallTitleText }}</div>
        <span v-if="opinionfeedback" class="aftertitle-text">{{ opinionfeedbackText }}</span>
        <div class="assist flex-row-c">
          <slot name="title-sub">
            <div v-if="assistMsgOn" class="assistMsg-icon"></div>
            <div v-if="assistMsgOn" class="assistMsg-text">
              {{ assistMsg || '' }}
            </div>
          </slot>
        </div>
        <div class="flex-row-start">
          <slot name="center"> </slot>
        </div>
      </div>

      <div class="flex-row-vcenter flex-row-end title-right">
        <slot name="right">
          <div v-ripple v-if="back" class="back flex-row-c el-btn-new optionbtns" @click="goBack">
            <i class="iconfont icon-fanhui"></i>
            返回
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 标题内容
  title: {
    type: String,
    required: true,
  },
  // 是否显示返回按钮
  back: {
    type: Boolean,
    default: false,
  },
  // 是否显示底边框
  border: {
    type: Boolean,
    default: false,
  },
  // 是否显示标题图标
  titleIcon: {
    type: Boolean,
    default: false,
  },
  // 是否显示必填星号
  required: {
    type: Boolean,
    default: false,
  },
  // 是否显示辅助消息
  assistMsgOn: {
    type: Boolean,
    default: false,
  },
  // 辅助消息内容
  assistMsg: {
    type: String,
    default: '',
  },
  // 是否显示意见反馈
  opinionfeedback: {
    type: Boolean,
    default: false,
  },
  // 意见反馈文本
  opinionfeedbackText: {
    type: String,
    default: '',
  },
  // 是否小标题模式
  smallTitle: {
    type: Boolean,
    default: false,
  },
  // 小标题内容
  smallTitleText: {
    type: String,
    default: '',
  },
  // 总数量
  totalNum: {
    type: [Number, String],
    default: 0,
  },
})

const emit = defineEmits(['clickGoBack'])

const baseTitle = computed(() => props.title)

const goBack = () => {
  emit('clickGoBack')
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 60px;
  line-height: 32px;
  // background: #ffffff;
}
.border-bottom {
  border-bottom: 1px solid $border-color;
}
.title .title-content {
  padding: 14px 16px;
  width: 100%;
  height: 100%;
  align-items: center;
}
// 小标题上下间距调整
.title .smalltitle-content {
  padding: 0 16px;
  width: 100%;
  height: 100%;
  align-items: center;
}
.title-bar {
  align-items: center;
  // background: #ffffff;
  > .title-icon {
    width: 4px;
    height: 16px;
    background: linear-gradient(180deg, #51b377 0%, #2ba174 100%);
    opacity: 1;
    border-radius: 2px;
    margin-right: 10px;
  }
  > .require {
    color: #f56c6c;
    padding: 0 5px;
  }
  > .title-text {
    font-size: $font-middle;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: $color-primary;
  }
  > .title-text2 {
    font-size: $font-big;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: $font-color-dark;
  }
  // 小标题
  > .title-text3 {
    font-size: $font-base; //14px
    font-family: Source Han Sans CN;
    font-weight: normal;
    color: $color-primary;
  }
  > .assist {
    margin-left: 4px;
    > .assistMsg-icon {
      margin-right: 5px;
      width: 1px;
      height: 14px;
      background: #e9e9e9;
      opacity: 1;
      border-radius: 10px 10px 10px 2px;
    }
    > .assistMsg-text {
      height: 14px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 14px;
      color: #999999;
    }
  }
  //标题后的按钮  粘贴/模板
  .stick-btn {
    color: $font-color-middle;
    border: none;
    box-shadow: 0px 1px 6px rgba(204, 204, 204, 0.08);
    &:hover,
    &:focus {
      color: $color-primary;
    }
  }
  //标题后的文本
  .aftertitle-text {
    font-size: $font-base !important;
    color: $font-color-light !important;
    font-weight: initial !important;
    margin-left: 8px;
  }
}

.title-right {
  //返回按钮样式
  .back {
    cursor: pointer;
    font-size: $font-base;
    color: $font-color-middle;
    background: #fff;
    > i {
      margin-right: 4px;
      font-size: $font-base;
    }
  }
}

.totalNum {
  color: #999999;
  font-size: 14px;
}
</style>
