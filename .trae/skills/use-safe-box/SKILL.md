---
name: 'use-safe-box'
description: '指导使用 safe-box 和 new-safeweb-web 类进行一致的页面布局。创建详情、新增或编辑页面时调用，以确保适当的宽度限制和样式。'
---

# 使用安全盒布局

此技能通过应用适当的 CSS 类，帮助您为详情、新增和编辑页面创建一致的布局。

## 使用时机

当以下情况时调用此技能：

- 创建用于显示项目信息的详情页面
- 构建用于添加新项目的新增页面
- 开发用于修改现有项目的编辑页面
- 任何需要一致、居中且固定宽度布局的页面

## 主要功能

此技能提供关于使用两个重要 CSS 类的指导：

- `.safe-box`：将页面宽度限制为 1560px 并使内容居中
- `.new-safeweb-web`：对外层容器应用通用样式

## 使用指南

### 1. 基本结构

```vue
<template>
  <div class="new-safeweb-web">
    <div class="safe-box">
      <!-- 页面内容在这里 -->
    </div>
  </div>
</template>
```

### 2. 带 Element UI 的完整示例（Composition API）

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()

const form = reactive({
  field1: '',
  field2: '',
})

const handlerBack = () => {
  router.back()
}

const handleSubmit = () => {
  // 提交逻辑
  ElMessage.success('提交成功')
}

const handleCancel = () => {
  // 取消逻辑
  router.back()
}
</script>

<template>
  <div class="new-safeweb-web">
    <div class="safe-box">
      <!-- 页面标题 -->
      <BaseTitle
        title="页面标题"
        :back="true"
        :border="true"
        @clickGoBack="handlerBack"
      />

      <!-- 表单或内容区域 -->
      <el-card class="page-card">
        <template #header>
          <div class="card-header">
            <span>表单标题</span>
          </div>
        </template>

        <el-form :model="form" label-width="120px">
          <el-form-item label="字段 1">
            <el-input v-model="form.field1" />
          </el-form-item>
          <el-form-item label="字段 2">
            <el-select v-model="form.field2" placeholder="选择">
              <el-option label="选项 1" value="1" />
              <el-option label="选项 2" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-card {
  margin-top: 20px;
}
</style>
```

### 3. 最佳实践

1. ✅ **始终使用正确的结构**：将页面内容包裹在 `.new-safeweb-web` 和 `.safe-box` 中
2. ✅ **使用 Composition API**：使用 `<script setup>` 语法和组合式 API
3. ✅ **使用 Element UI 组件**：利用 Element UI 组件进行表单、卡片和其他 UI 元素
4. ✅ **保持一致性**：在所有详情、新增和编辑页面中应用相同的结构
5. ✅ **使用 BaseTitle 组件**：用于带有可选返回按钮的一致页面标题
6. ✅ **使用 SCSS 变量**：在自定义样式时使用项目定义的 SCSS 变量

### 4. 组件层次结构

```
.new-safeweb-web
  └── .safe-box
      ├── BaseTitle (可选)
      ├── el-card (用于内容)
      │   └── el-form (用于新增/编辑页面)
      └── 其他页面内容
```

### 5. 关键说明

- **无需导入样式**：`.safe-box` 和 `.new-safeweb-web` 类已经在 `src/styles/index.scss` 中定义
- **Element UI 集成**：Element UI 组件与此布局结构无缝协作
- **响应式行为**：布局将自动调整以适应不同的屏幕尺寸
- **一致性**：使用此结构确保所有页面具有统一的外观
- **页面特定样式**：即使有这些基础类，您仍然需要为内容、表单和其他元素编写页面特定的样式
- **DOM 结构**：这些类用作 DOM 结构的前置样式，但它们不会替代特定页面样式的需要
- **固定宽度**：`.safe-box` 的宽度为 1560px，并居中显示

## 示例实现

### 详情页面示例

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
  <div class="new-safeweb-web">
    <div class="safe-box">
      <BaseTitle
        title="项目详情"
        :back="true"
        :border="true"
        @clickGoBack="handlerBack"
      />

      <el-card class="detail-card">
        <el-descriptions title="项目信息" :column="2">
          <el-descriptions-item label="名称">项目名称</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success">活跃</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">2025-01-01</el-descriptions-item>
          <el-descriptions-item label="更新时间">2025-01-02</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-card {
  margin-top: $spacing-base;
}
</style>
```

### 新增页面示例

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()

const form = reactive({
  name: '',
  description: '',
})

const handlerBack = () => {
  router.back()
}

const handleCreate = () => {
  // 创建逻辑
  ElMessage.success('创建成功')
  router.back()
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="new-safeweb-web">
    <div class="safe-box">
      <BaseTitle
        title="创建新项目"
        :back="true"
        :border="true"
        @clickGoBack="handlerBack"
      />

      <el-card class="create-card">
        <el-form :model="form" label-width="120px">
          <el-form-item label="名称" required>
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" rows="4" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCreate">创建</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.create-card {
  margin-top: $spacing-base;
}
</style>
```

### 编辑页面示例

```vue
<script setup>
import BaseTitle from '@/components/common/baseTitle.vue'
import { useRouter } from 'vue-router'
import { reactive, onMounted } from 'vue'

const router = useRouter()

const form = reactive({
  id: null,
  name: '',
  description: '',
})

const handlerBack = () => {
  router.back()
}

const handleUpdate = () => {
  // 更新逻辑
  ElMessage.success('更新成功')
  router.back()
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  // 加载数据逻辑
  // loadData()
})
</script>

<template>
  <div class="new-safeweb-web">
    <div class="safe-box">
      <BaseTitle
        title="编辑项目"
        :back="true"
        :border="true"
        @clickGoBack="handlerBack"
      />

      <el-card class="edit-card">
        <el-form :model="form" label-width="120px">
          <el-form-item label="名称" required>
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" rows="4" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdate">更新</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edit-card {
  margin-top: $spacing-base;
}
</style>
```

### 带自定义内容的页面示例

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
  <div class="new-safeweb-web">
    <div class="safe-box">
      <BaseTitle
        title="数据列表"
        :back="true"
        :border="true"
        @clickGoBack="handlerBack"
      >
        <template #right>
          <el-button type="primary" icon="Plus">新增</el-button>
        </template>
      </BaseTitle>

      <el-card class="table-card">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { name: '项目 1', status: '进行中' },
  { name: '项目 2', status: '已完成' },
])

const handleEdit = (row) => {
  // 编辑逻辑
}

const handleDelete = (row) => {
  // 删除逻辑
}
</script>

<style lang="scss" scoped>
.table-card {
  margin-top: $spacing-base;
}
</style>
```

## 样式变量参考

在自定义页面样式时，可以使用以下 SCSS 变量：

```scss
// 间距
$spacing-base: 20px;      // 基础间距
$spacing-normal: 16px;    // 普通间距

// 圆角
$border-radio-md: 4px;    // 中等圆角

// 颜色
$color-primary: #009b83;  // 主色调

// 字体
$font-base: 14px;         // 基础字体
$font-middle: 16px;       // 中标题字体
```

通过遵循此技能的指导，您可以确保应用程序中的所有详情、新增和编辑页面都具有一致、专业的外观，具有正确的宽度限制和样式。
