<template>
  <!-- 使用Element UI的Dialog组件 -->
  <el-dialog
    v-dialogDrag
    append-to-body
    :title="title"
    class="addWorkStyle"
    :visible.sync="localVisible"
    :destroy-on-close="false"
    width="85%"
    top="5vh"
    @close="handleClose"
  >
    <!-- iframe容器 -->
    <div class="iframe-container">
      <!-- src="http://172.29.192.118:8000/doc.html" -->
      <iframe
        :id="compId"
        ref="iframe"
        :src="src"
        height="100%"
        width="100%"
        frameborder="0"
        @load="onIframeLoad"
      ></iframe>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'IframeDialog',
  props: {
    visible: Boolean, // 弹窗显示状态
    src: String, // iframe的src地址
    compId: String, // iframe的组件ID，用于消息通信识别
    iframeTitle: String, // 弹窗标题
  },
  data() {
    return {
      iframeHeight: 800, // iframe高度，会根据内容自适应
      messageHandler: null, // 消息处理器引用，用于清理
    };
  },
  computed: {
    /**
     * 本地visible状态，用于双向绑定
     */
    localVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      },
    },
    title() {
      let urlNames = {
        ORDER_DETAIL: '详情',
        BATCH_HANDLE: '提交',
        BATCH_APPROVE: '审批',
      };
      return `${this.iframeTitle}${urlNames[this.compId]}`;
    },
  },
  watch: {
    /**
     * 监听visible变化，显示时初始化消息监听，隐藏时清理
     */
    visible(newVal) {
      if (newVal) {
        this.initMessageListener();
      } else {
        this.removeMessageListener();
      }
    },
  },
  mounted() {
    // 组件挂载时初始化消息监听
    this.initMessageListener();
  },
  beforeDestroy() {
    // 组件销毁前清理消息监听
    this.removeMessageListener();
  },
  methods: {
    /**
     * 初始化消息监听器，监听来自iframe的消息
     */
    initMessageListener() {
      // 保存处理器引用以便后续移除
      this.messageHandler = this.handleMessage.bind(this);
      window.addEventListener('message', this.messageHandler);
      console.log('初始化iframe消息监听器');
    },

    /**
     * 移除消息监听器
     */
    removeMessageListener() {
      if (this.messageHandler) {
        window.removeEventListener('message', this.messageHandler);
        this.messageHandler = null;
        console.log('移除iframe消息监听器');
      }
    },

    /**
     * 处理来自iframe的消息
     * @param {MessageEvent} event - 消息事件
     */
    handleMessage(event) {
      const { type, compId, height, data } = event.data || {};

      // 验证消息来源的compId是否匹配当前弹窗（可选，增强安全性）
      if (compId && compId !== this.compId) {
        return;
      }

      console.log('收到iframe消息:', { type, compId, height, data });

      // 根据消息类型处理不同业务
      switch (type) {
        case 'childHeight':
          // 自适应高度处理：根据子页面内容调整iframe高度
          this.handleChildSize(height);
          break;

        case 'childSubmit':
          // 子页面提交成功：通知父组件
          this.$emit('child-submitted', { compId, data });
          break;

        case 'childCancel':
          // 子页面取消操作：通知父组件
          this.$emit('close', { compId, data });
          break;

        // case "childData":
        //   // 子页面数据上报：通知父组件
        //   this.$emit("child-data", { compId, data });
        //   break;

        default:
          console.warn('未知的iframe消息类型:', type);
      }
    },

    /**
     * 处理子页面高度变化
     * @param {number} height - 子页面高度
     */
    handleChildSize(height) {
      if (height && height > 0) {
        // 设置最小和最大高度限制
        const minHeight = 650;
        const maxHeight = 800;
        this.iframeHeight = Math.min(Math.max(height, minHeight), maxHeight);
        console.log(`调整iframe高度为: ${this.iframeHeight}px`);
      }
    },

    /**
     * iframe加载完成回调
     */
    onIframeLoad() {
      console.log('iframe加载完成:', this.src);
      // iframe加载完成后可以执行一些初始化操作
    },

    /**
     * 关闭弹窗
     */
    handleClose() {
      console.log('关闭弹窗');
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.iframe-container {
  height: 80vh;
  width: 100%;
  overflow: hidden;
}
:deep(.el-dialog__body) {
  max-height: unset;
  padding: 0;
  overflow: hidden;
}
</style>
