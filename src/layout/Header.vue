<script setup>
import { ref } from 'vue'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['toggle-collapse'])
const userName = ref('张三丰')

const toggleCollapse = () => {
  emit('toggle-collapse')
}
</script>
<template>
  <div class="header">
    <!-- 左侧logo和标题区域 -->
    <div class="logo-section">
      <div class="logo flex-row-vcenter">
        <div class="logoLeft" :class="[isCollapse ? 'isCollapse' : 'unCollapse']">
          <h1 class="company-name">标题</h1>
          <span v-if="!isCollapse" class="line-divider">|</span>
          <EpFold class="collapse-icon" @click="toggleCollapse" />
        </div>
        <h2 class="system-title">全yw工单</h2>
      </div>
    </div>

    <!-- 右侧用户信息区域 -->
    <div class="user-section flex-row-vcenter">
      <div class="user-info flex-row-vcenter">
        <div class="user-avatar">{{ userName.charAt(0) }}</div>
        <span class="user-name">{{ userName }}</span>
        <span class="dropdown-icon">▼</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: relative;
  z-index: 100;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logoLeft {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 16px;
  border-right: 1px solid #e8e8e8;
  transition: all 0.3s ease;

  &.isCollapse {
    padding-right: 8px;

    .company-name {
      font-size: 16px;
    }

    .line-divider {
      display: none;
    }
  }

  &.unCollapse {
    .company-name {
      font-size: 18px;
    }
  }
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  transition: font-size 0.3s ease;
}

.line-divider {
  color: #e8e8e8;
  font-size: 20px;
  font-weight: 300;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #fff;
  transition: color 0.3s ease;

  &:hover {
    color: #1890ff;
  }
}

.system-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.user-name {
  font-size: 14px;
  color: #fff;
  font-weight: 400;
}

.dropdown-icon {
  font-size: 10px;
  cursor: pointer;
  color: #fff;
  transition: color 0.3s ease;
  opacity: 0.8;

  &:hover {
    color: #1890ff;
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .logo {
    gap: 12px;
  }

  .company-name {
    font-size: 16px !important;
  }

  .system-title {
    font-size: 14px;
  }

  .user-info {
    gap: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .user-name {
    font-size: 13px;
  }
}
</style>
