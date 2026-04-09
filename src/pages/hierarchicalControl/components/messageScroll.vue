<template>
  <div class="message-scroll">
    <div>
      <img src="@/assets/images/hierarchicalControl/message1.png" alt="" />
      <transition :name="transitionName" mode="out-in">
        <div :key="currentIndex" class="transition-content">
          <div v-if="currentMessage && currentMessage.messageWarin">
            <img src="@/assets/images/hierarchicalControl/message2.png" alt="" />
            <span class="current-message">{{ currentMessage.messageWarin }}</span>
          </div>
          <span class="error-info">{{ currentMessage ? currentMessage.title : '暂无消息' }}</span>
        </div>
      </transition>
    </div>
    <span v-if="currentMessage" class="error-details" @click="handleViewDetail">查看详情</span>
  </div>
</template>

<script>
import API from '@/api/hierarchicalControl/workReminder.js';

export default {
  name: 'MessageScroll',
  data() {
    return {
      messageList: [],
      currentIndex: 0,
      timer: null,
      transitionName: 'slide-up',
    };
  },
  computed: {
    currentMessage() {
      return this.messageList[this.currentIndex];
    },
  },
  mounted() {
    this.fetchMessages();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async fetchMessages() {
      try {
        let params1 = {
          businessCodes: '',
          endDate: '',
          processStatus: '00',
          startDate: '',
        };
        let params2 = {
          content: '',
          readFlag: 0,
          current: 1,
          pageSize: 5,
          sendEndDate: '',
          sendStartDate: '',
        };
        // 调用消息接口
        const response1 = await API.getPendingList(params1);
        const response2 = await API.getMyInterestsList(params2);
        let data1 = response1?.data?.DTS?.pendingWorkOrderList ?? [];
        let data2 = response2?.data?.DTS?.data ?? [];
        let arr = [];
        data1?.forEach((item) => {
          arr.push({
            title: `${item.businessName}工单`,
            messageWarin: '待办工单',
            messageType: '02',
          });
        });
        data2?.forEach((item) => {
          arr.push({
            title: `${item.interestsTitle}`,
            messageWarin: '我的关注',
            messageType: '04',
          });
        });
        this.messageList = arr;

        if (this.messageList.length > 0) {
          this.startScroll();
        }
      } catch (error) {
        console.error('获取消息失败:', error);
      }
    },

    startScroll() {
      if (this.messageList.length > 1) {
        this.timer = setInterval(() => {
          this.transitionName = 'slide-up';
          this.currentIndex = (this.currentIndex + 1) % this.messageList.length;
        }, 5000);
      }
    },

    handleViewDetail() {
      if (this.currentMessage) {
        let data = {
          id: 'workReminder',
          tabsIndex: this.currentMessage.messageType,
        };
        this.$emit('jumpPage', data);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.message-scroll {
  background: #fff9f4;
  height: 36px;
  font-size: 14px;
  padding: 0 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
  & > div {
    position: relative;
    display: flex;
    align-items: center;
    & > img {
      margin-right: 12px;
    }
  }
  .transition-content {
    display: flex;
    align-items: center;
    & > div {
      position: relative;
      margin-right: 12px;
    }
    .current-message {
      font-size: 12px;
      color: #fe3333;
      position: absolute;
      top: 2px;
      left: 4px;
    }
  }
  .error-details {
    color: $color-warning;
    cursor: pointer;
    &::after {
      content: '>';
      margin-left: 3px;
    }
  }
}

/* 向上滚动动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter {
  transform: translateY(24px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-24px);
  opacity: 0;
}
</style>
