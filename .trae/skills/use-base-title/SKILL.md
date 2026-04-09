---
name: 'use-base-title'
description: '插入 BaseTitle 组件作为页面标题。当页面需要大标题、一致的样式和可选的返回按钮时调用。'
---

# 使用 BaseTitle 组件

此技能帮助您在需要大型、一致的页面标题时，将 `BaseTitle` 组件添加到 Vue 页面中。

## 使用时机

当以下情况时调用此技能：

- 页面顶部需要大标题
- 您希望在应用程序中保持一致的标题样式
- 页面需要在标题栏中显示返回按钮
- 您希望使用现有的 BaseTitle 组件而不是创建自定义标题

## 组件详情

`BaseTitle` 组件位于 `src/components/common/baseTitle.vue`，提供：

- 一致的标题样式（60px 高度）
- 可选的返回按钮
- 支持小标题模式
- 支持显示必填星号、标题图标等
- 支持显示辅助消息
- 支持自定义插槽（text-tip、title-sub、center、right）
- 适当的间距和布局

## 使用示例

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handlerBack = () => {
  router.back()
}
</script>

<template>
  <div class="page-container">
    <!-- 使用 BaseTitle 组件作为页面标题 -->
    <BaseTitle
      title="页面标题"
      :back="true"
      :border="true"
      @clickGoBack="handlerBack"
    />

    <!-- 页面内容在这里 -->
    <div class="content-area">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  
  .content-area {
    padding: 20px;
  }
}
</style>
```

## 主要属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | String | - | **必填** 页面标题文本 |
| `back` | Boolean | false | 是否显示返回按钮 |
| `border` | Boolean | false | 是否显示底部边框 |
| `titleIcon` | Boolean | false | 是否显示标题图标（绿色竖线） |
| `required` | Boolean | false | 是否显示必填星号 |
| `assistMsgOn` | Boolean | false | 是否显示辅助消息 |
| `assistMsg` | String | '' | 辅助消息内容 |
| `opinionfeedback` | Boolean | false | 是否显示意见反馈 |
| `opinionfeedbackText` | String | '' | 意见反馈文本 |
| `smallTitle` | Boolean | false | 是否小标题模式 |
| `smallTitleText` | String | '' | 小标题内容 |
| `totalNum` | Number/String | 0 | 总数量 |

## 事件

| 事件 | 描述 |
|------|------|
| `clickGoBack` | 当返回按钮被点击时触发 |

## 插槽

| 插槽名 | 描述 |
|--------|------|
| `text-tip` | 标题提示文字 |
| `title-sub` | 标题副标题/辅助信息 |
| `center` | 标题中间区域 |
| `right` | 标题右侧区域（可自定义按钮） |

## 最佳实践

1. ✅ 始终使用绝对路径正确导入组件：`@/components/common/baseTitle.vue`
2. ✅ 使用 Composition API 和 `<script setup>` 语法
3. ✅ 使用 `useRouter()` 和 `router.back()` 处理返回逻辑
4. ✅ 当页面应该有返回导航时，使用 `back` 属性
5. ✅ 处理 `clickGoBack` 事件以实现正确的导航
6. ✅ 保持标题简洁明了
7. ✅ 使用 `border` 属性添加底部边框以增强视觉分隔
8. ✅ 内容区域添加适当的 padding 以与标题区分

## 示例实现

### 基础示例 - 带返回按钮的页面标题

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handlerBack = () => {
  router.back()
}
</script>

<template>
  <div class="page-container">
    <BaseTitle
      title="工单挂起"
      :back="true"
      :border="true"
      @clickGoBack="handlerBack"
    />
    <div class="content-area">
      <!-- 页面内容 -->
    </div>
  </div>
</template>
```

### 高级示例 - 带标题图标和必填星号

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handlerBack = () => {
  router.back()
}
</script>

<template>
  <div class="page-container">
    <BaseTitle
      title="计量采集装置巡视详情"
      :back="true"
      :border="true"
      :titleIcon="true"
      :required="true"
      :total-num="10"
      @clickGoBack="handlerBack"
    />
    <div class="content-area">
      <!-- 页面内容 -->
    </div>
  </div>
</template>
```

### 带自定义右侧按钮

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handlerBack = () => {
  router.back()
}

const handleSave = () => {
  // 保存逻辑
}
</script>

<template>
  <div class="page-container">
    <BaseTitle
      title="编辑工单"
      :back="true"
      :border="true"
      @clickGoBack="handlerBack"
    >
      <template #right>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </BaseTitle>
    <div class="content-area">
      <!-- 页面内容 -->
    </div>
  </div>
</template>
```

### 带辅助消息

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handlerBack = () => {
  router.back()
}
</script>

<template>
  <div class="page-container">
    <BaseTitle
      title="工单详情"
      :back="true"
      :border="true"
      :assistMsgOn="true"
      assistMsg="共 10 条数据"
      @clickGoBack="handlerBack"
    />
    <div class="content-area">
      <!-- 页面内容 -->
    </div>
  </div>
</template>
```

## 注意事项

- ⚠️ `title` 属性是必填的
- ⚠️ 事件名称使用 camelCase：`clickGoBack`（不是 `click-go-back`）
- ⚠️ 组件已迁移到 Composition API，使用 `<script setup>` 语法
- ⚠️ 组件路径是 `@/components/common/baseTitle.vue`（不是 `form/baseTitle.vue`）
- ⚠️ 组件高度固定为 60px
- ⚠️ 使用 `border` 属性时会显示 1px 的底部边框
