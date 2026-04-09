<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 组件导入
import Header from '@/layout/Header.vue'
import Left from '@/layout/Left.vue'

// 环境配置
const isDev = import.meta.env.MODE === 'development'

// 响应式状态
const isCollapse = ref(false)
const isOnReady = ref(false)
const isLargeScreen = ref(false)
const cachedViews = ref(new Set()) // 使用 Set 避免重复

// 计算属性
const cachedViewsArray = computed(() => {
  return Array.from(cachedViews.value)
})

// 路由实例
const route = useRoute()

// 方法
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 监听路由变化，动态管理缓存
watch(
  () => route,
  (to, from) => {
    // 进入新路由时，如果需要缓存，则添加
    if (to?.meta?.keepAlive && to?.name) {
      cachedViews.value.add(to?.name)
    }

    // 离开路由时，如果需要清除缓存，则移除
    if (from?.meta?.clearCacheOnLeave && from?.name) {
      cachedViews.value.delete(from?.name)
    }
  },
  { immediate: true, deep: true },
)

// 生命周期钩子
onMounted(() => {
  // 应用初始化完成后设置为就绪状态
  isOnReady.value = true
})
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <!-- 生产环境布局 (iframe 模式) -->
    <div
      v-if="!isDev"
      :class="{
        'production-layout': true,
        'safeweb-web-bg': !isLargeScreen,
        'padding-0': isLargeScreen,
      }"
    >
      <router-view v-if="isOnReady" v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <keep-alive :include="cachedViewsArray">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </div>

    <!-- 开发环境布局 (模拟 iframe 架构) -->
    <div v-else class="development-layout">
      <!-- 模拟外层容器的 100px 头部 -->
      <div class="mock-outer-header">
        <div class="mock-header-content">
          <Header :is-collapse="isCollapse" @toggle-collapse="toggleCollapse" />
        </div>
      </div>
      <!-- 模拟 iframe 内容区域 -->
      <div class="mock-iframe-content">
        <el-container class="app-container">
          <el-container>
            <el-aside
              :class="{ 'app-aside': true, 'is-collapse': isCollapse, 'un-collapse': !isCollapse }"
            >
              <Left :is-collapse="isCollapse" />
            </el-aside>
            <el-main
              :class="{
                'app-main': true,
                'safeweb-web-bg': !isLargeScreen,
                'padding-0': isLargeScreen,
              }"
            >
              <router-view v-if="isOnReady" v-slot="{ Component, route }">
                <transition name="fade" mode="out-in">
                  <keep-alive :include="cachedViewsArray">
                    <component :is="Component" :key="route.fullPath" />
                  </keep-alive>
                </transition>
              </router-view>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </div>
  </ElConfigProvider>
</template>

<style lang="scss">
// 全局样式重置
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 生产环境布局 (iframe 模式)
.production-layout {
  height: 100%;
  overflow: auto;
}

// 开发环境布局 (模拟 iframe 架构)
.development-layout {
  height: 100%;
  display: flex;
  flex-direction: column;

  // 模拟外层容器的 100px 头部
  .mock-outer-header {
    height: 100px;
    background-color: $color-primary;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .mock-header-content {
      h3 {
        margin-bottom: 5px;
        font-size: 16px;
      }
      p {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }

  // 模拟 iframe 内容区域
  .mock-iframe-content {
    flex: 1;
    overflow: hidden;
    border-top: 1px solid #e8e8e8;

    .app-container {
      height: 100%;
      .app-main {
        padding: 0;
        &.safeweb-web-bg {
          box-sizing: border-box;
          padding: 24px;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #e6fcf3 0%, #f5f7f7 100%);
        }
      }
    }
  }
}

// 应用布局组件样式
.app-header {
  height: 60px;
  padding: 0 20px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.app-aside {
  z-index: 10;
  position: absolute;
  top: 100px;
  left: 0;
  width: 240px;
  background-color: white;
  border-right: 1px solid #e8e8e8;
  transition: width 0.3s ease;
  overflow: hidden;

  &.is-collapse {
    width: 0;
  }

  &.un-collapse {
    width: 240px;
  }
}

.app-main {
  padding: 20px;
  overflow: auto;
  background-color: #f5f5f5;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #dddddd;
  border-radius: 4px;

  &:hover {
    background-color: #cccccc;
  }
}

// 响应式设计
@media (max-width: 1199px) {
  .development-layout {
    .app-aside {
      width: 200px;

      &.is-collapse {
        width: 56px;
      }
    }
  }
}

@media (max-width: 768px) {
  .development-layout {
    .mock-outer-header {
      height: 80px;
      padding: 0 15px;

      .mock-header-content {
        h3 {
          font-size: 14px;
        }
        p {
          font-size: 12px;
        }
      }
    }

    .app-header {
      padding: 0 10px;
    }

    .app-main {
      padding: 10px;
    }
  }
}
</style>
