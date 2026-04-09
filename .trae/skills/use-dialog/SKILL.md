---
name: 'use-dialog'
description: '使用 Element Plus 的 el-dialog 组件实现弹窗功能，支持双向绑定控制显示隐藏，使用预定义的弹窗宽度和按钮样式。当需要创建弹窗功能时调用。'
---

# 弹窗功能使用指南

## 功能说明

本 skill 用于指导如何在项目中使用 Element Plus 的 `el-dialog` 组件实现弹窗功能，支持双向绑定控制弹窗显示隐藏，按钮样式使用 `src/styles/index.scss` 中定义的样式类。

## 实现步骤

### 1. 注意事项

- 使用 Vue 3 的 Composition API 和 `<script setup>` 语法
- `el-dialog` 使用 `v-model` 控制显示隐藏（Vue 3 中不再使用 `:visible.sync`）
- SCSS 文件位于 `src/styles` 目录中，已全局导入，无需手动引入
- 使用项目预定义的按钮样式类
- 弹窗拖拽：使用全局注册的 `v-dialogDrag` 指令实现弹窗拖拽功能

### 2. 基本弹窗结构

创建一个可复用的弹窗组件，通过 `v-model` 实现双向绑定控制显示隐藏：

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '弹窗标题'
  },
  width: {
    type: String,
    default: $dict.DIALOG_WIDTH.MEDIUM // 默认使用中尺寸 800px
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref({})

// 监听弹窗关闭，重置表单
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const handleConfirm = () => {
  console.log('确认操作', form.value)
  emit('confirm', form.value)
  dialogVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

const handleClose = () => {
  emit('close')
  dialogVisible.value = false
}

const resetForm = () => {
  form.value = {}
}
</script>

<template>
  <div class="new-safeweb-web">
    <!-- 弹窗组件 -->
    <el-dialog
      v-model="dialogVisible"
      v-dialogDrag
      :title="title"
      :width="width"
      :close-on-click-modal="closeOnClickModal"
      @close="handleClose"
    >
      <!-- 弹窗内容 -->
      <div class="dialog-content">
        <!-- 这里放置弹窗具体内容 -->
        <slot>
          <p>默认内容</p>
        </slot>
      </div>
      
      <!-- 弹窗底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button class="reset-btn" @click="handleCancel">取消</el-button>
          <el-button class="search-btn" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
```

### 3. 按钮样式使用

使用 `src/styles/index.scss` 中定义的按钮样式类：

- `search-btn`：查询/确定按钮样式（主色调按钮）
- `reset-btn`：重置/取消按钮样式（朴素按钮）
- `delete-btn`：删除按钮样式（危险按钮）
- `cancel-btn`：取消按钮样式（朴素按钮）
- `text-btn`：文字按钮样式
- `plain-btn`：朴素按钮样式

```vue
<template #footer>
  <div class="dialog-footer">
    <el-button class="reset-btn" @click="handleCancel">取消</el-button>
    <el-button class="search-btn" @click="handleConfirm">确定</el-button>
  </div>
</template>
```

## 完整示例

### 示例 1：基本弹窗组件

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '基本弹窗'
  },
  width: {
    type: String,
    default: $dict.DIALOG_WIDTH.MEDIUM
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  console.log('确认操作')
  emit('confirm')
  dialogVisible.value = false
}

const handleCancel = () => {
  dialogVisible.value = false
}
</script>

<template>
  <div class="new-safeweb-web">
    <el-dialog
      v-model="dialogVisible"
      v-dialogDrag
      :title="title"
      :width="width"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <p>这是一个基本弹窗示例</p>
        <p>可以在这里添加任意内容</p>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button class="reset-btn" @click="handleCancel">取消</el-button>
          <el-button class="search-btn" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
```

### 示例 2：带表单的弹窗组件

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '表单弹窗'
  },
  width: {
    type: String,
    default: $dict.DIALOG_WIDTH.LARGE // 表单弹窗使用大尺寸
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref({
  name: '',
  age: '',
  gender: 'male'
})

// 监听弹窗关闭，重置表单
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const handleSubmit = () => {
  console.log('表单数据:', form.value)
  emit('confirm', form.value)
  dialogVisible.value = false
}

const handleCancel = () => {
  dialogVisible.value = false
}

const resetForm = () => {
  form.value = {
    name: '',
    age: '',
    gender: 'male'
  }
}
</script>

<template>
  <div class="new-safeweb-web">
    <el-dialog
      v-model="dialogVisible"
      v-dialogDrag
      :title="title"
      :width="width"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <el-form :model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="年龄">
            <el-input type="number" v-model="form.age" placeholder="请输入年龄" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button class="reset-btn" @click="handleCancel">取消</el-button>
          <el-button class="search-btn" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
```

### 示例 3：带删除确认的弹窗组件

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '删除确认'
  },
  width: {
    type: String,
    default: $dict.DIALOG_WIDTH.MINI // 确认弹窗使用特小尺寸
  },
  content: {
    type: String,
    default: '确定要删除此记录吗？'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleDelete = () => {
  console.log('执行删除操作')
  emit('confirm')
  dialogVisible.value = false
}

const handleCancel = () => {
  dialogVisible.value = false
}
</script>

<template>
  <div class="new-safeweb-web">
    <el-dialog
      v-model="dialogVisible"
      v-dialogDrag
      :title="title"
      :width="width"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <p>{{ content }}</p>
        <p class="text-danger">删除后将无法恢复</p>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="handleCancel">取消</el-button>
          <el-button class="delete-btn" @click="handleDelete">删除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px 0;
  
  .text-danger {
    color: $color-error;
    margin-top: 10px;
    font-size: $font-sm;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
```

### 示例 4：父组件使用弹窗组件

```vue
<script setup>
import { ref } from 'vue'
import BaseDialog from './BaseDialog.vue'

const basicDialogVisible = ref(false)
const formDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const handleBasicConfirm = () => {
  console.log('基本弹窗确认')
}

const handleFormConfirm = (formData) => {
  console.log('表单弹窗确认:', formData)
  // 这里可以处理表单数据
}

const handleDeleteConfirm = () => {
  console.log('删除弹窗确认')
  // 这里可以处理删除逻辑
}
</script>

<template>
  <div class="new-safeweb-web">
    <!-- 触发按钮 -->
    <el-button type="primary" @click="basicDialogVisible = true">打开基本弹窗</el-button>
    <el-button type="primary" @click="formDialogVisible = true">打开表单弹窗</el-button>
    <el-button type="danger" @click="deleteDialogVisible = true">打开删除弹窗</el-button>
    
    <!-- 基本弹窗 -->
    <BaseDialog
      v-model="basicDialogVisible"
      title="基本弹窗"
      @confirm="handleBasicConfirm"
    />
    
    <!-- 表单弹窗 -->
    <BaseDialog
      v-model="formDialogVisible"
      title="表单弹窗"
      :width="$dict.DIALOG_WIDTH.LARGE"
      @confirm="handleFormConfirm"
    >
      <template #default>
        <!-- 自定义表单内容 -->
        <el-form label-width="100px">
          <el-form-item label="用户名">
            <el-input placeholder="请输入用户名" />
          </el-form-item>
        </el-form>
      </template>
    </BaseDialog>
    
    <!-- 删除弹窗 -->
    <BaseDialog
      v-model="deleteDialogVisible"
      title="删除确认"
      :width="$dict.DIALOG_WIDTH.MINI"
      @confirm="handleDeleteConfirm"
    >
      <template #default>
        <p>确定要删除此记录吗？</p>
        <p class="text-danger">删除后将无法恢复</p>
      </template>
    </BaseDialog>
  </div>
</template>

<style lang="scss" scoped>
.text-danger {
  color: $color-error;
  margin-top: 10px;
}
</style>
```

### 示例 5：使用插槽的自定义弹窗

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '自定义弹窗'
  },
  width: {
    type: String,
    default: $dict.DIALOG_WIDTH.MEDIUM
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
  dialogVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}
</script>

<template>
  <div class="new-safeweb-web">
    <el-dialog
      v-model="dialogVisible"
      v-dialogDrag
      :title="title"
      :width="width"
      :close-on-click-modal="false"
    >
      <!-- 默认插槽：弹窗内容 -->
      <slot>
        <div class="dialog-content">
          <p>默认内容</p>
        </div>
      </slot>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            v-if="showCancel" 
            class="reset-btn" 
            @click="handleCancel"
          >
            {{ cancelText }}
          </el-button>
          <el-button class="search-btn" @click="handleConfirm">
            {{ confirmText }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
```

## 最佳实践

### 1. 双向绑定

- ✅ 使用 `v-model` 在父组件中控制弹窗的显示和隐藏
- ✅ 弹窗组件通过 `props` 接收 `modelValue` 属性
- ✅ 通过 `emit('update:modelValue', false)` 关闭弹窗
- ✅ 使用计算属性实现双向绑定

### 2. 状态重置

- ✅ 使用 `watch` 监听 `modelValue` 变化
- ✅ 当弹窗关闭时（`modelValue` 变为 `false`），重置内部状态（如表单数据）
- ✅ 确保每次打开弹窗时都是初始状态

### 3. 按钮样式

使用 `src/styles/index.scss` 中定义的按钮样式类：

```scss
// 主按钮（确定、查询）
.el-button.search-btn {
  @include primary-btn;
}

// 朴素按钮（取消、重置）
.el-button.reset-btn,
.el-button.cancel-btn {
  @include light-btn;
}

// 危险按钮（删除）
.el-button.delete-btn {
  color: #ffffff;
  background-color: $color-error;
}
```

### 4. 事件传递

- ✅ 通过 `$emit('confirm', data)` 向父组件传递确认事件和数据
- ✅ 父组件处理具体的业务逻辑
- ✅ 保持组件职责单一

### 5. 插槽使用

- ✅ 使用默认插槽（`<slot>`）传递弹窗内容
- ✅ 使用具名插槽（`#footer`）自定义底部按钮
- ✅ 提供默认内容作为降级方案

### 6. 弹窗宽度

**默认宽度绑定全局字典**：

项目中使用全局字典 `$dict.DIALOG_WIDTH` 来统一管理弹窗宽度，确保全项目弹窗宽度一致：

```javascript
// src/utils/dict.js
export default {
  DIALOG_WIDTH: {
    LARGE: '1000px',   // 大尺寸：复杂表单、详情页面
    MEDIUM: '800px',   // 中尺寸：一般表单、列表
    SMALL: '680px',    // 小尺寸：简单表单、信息展示
    MINI: '480px',     // 特小尺寸：确认对话框、简单提示
  }
}
```

**使用方式**：

```vue
<script setup>
// 方式 1：直接使用字典值
const width = $dict.DIALOG_WIDTH.MEDIUM

// 方式 2：在 props 中设置默认值
const props = defineProps({
  width: {
    type: String,
    default: $dict.DIALOG_WIDTH.MEDIUM
  }
})

// 方式 3：在模板中直接使用
// <el-dialog :width="$dict.DIALOG_WIDTH.LARGE">
</script>
```

**推荐宽度使用场景**：

```javascript
const widths = {
  MINI: $dict.DIALOG_WIDTH.MINI,   // 480px - 确认对话框、简单提示
  SMALL: $dict.DIALOG_WIDTH.SMALL, // 680px - 简单表单、信息展示
  MEDIUM: $dict.DIALOG_WIDTH.MEDIUM, // 800px - 一般表单、列表
  LARGE: $dict.DIALOG_WIDTH.LARGE    // 1000px - 复杂表单、详情页面
}
```

### 7. 样式类使用

- ✅ 在弹窗组件的根元素上添加 `.new-safeweb-web` 样式类
- ✅ 使用 SCSS 变量保持样式一致性
- ✅ 遵循项目的设计规范

## 注意事项

1. **Vue 3 语法**：使用 Composition API 和 `<script setup>` 语法
2. **v-model 变化**：Vue 3 中 `v-model` 默认使用 `modelValue` 属性和 `update:modelValue` 事件
3. **SCSS 位置**：SCSS 文件位于 `src/styles` 目录，已全局导入
4. **自动导入**：Element Plus 组件已配置自动导入，无需手动引入
5. **响应式数据**：使用 `ref` 和 `computed` 创建响应式数据
6. **事件命名**：使用 kebab-case 命名事件（如 `update:modelValue`）
7. **插槽语法**：使用 `#插槽名` 语法代替 `v-slot:插槽名`
8. **样式变量**：使用 `$color-error`、`$font-sm` 等 SCSS 变量
9. **全局字典**：弹窗宽度默认使用 `$dict.DIALOG_WIDTH`，确保全项目统一
10. **弹窗拖拽**：使用 `v-dialogDrag` 指令实现弹窗拖拽功能，指令已全局注册，直接在 `el-dialog` 上使用即可
11. **全局字典使用（Vue 3 最佳实践）**：
    - 项目使用 `provide/inject` 模式提供全局字典，而非 `app.config.globalProperties`
    - 在组件中使用 `useDict()` composable 获取字典数据
    - **重要**：`defineProps` 的默认值中不能直接使用 `$dict`，因为 `defineProps` 在 setup 之前执行
    - 正确做法：将默认值设为 `undefined`，然后使用计算属性获取实际值

## 全局字典使用示例

### 1. 在 main.js 中提供字典

```javascript
// main.js
import { provideDict } from '@/composables/useDict'

const app = createApp(App)
// 使用 provide 提供全局字典
provideDict(app)
```

### 2. 在组件中使用字典（错误示范）

```vue
<script setup>
import { useDict } from '@/composables/useDict'

const $dict = useDict()

// ❌ 错误：不能在 defineProps 默认值中使用 $dict
const props = defineProps({
  width: {
    type: String,
    default: $dict.DIALOG_WIDTH.LARGE // 这会报错！
  }
})
</script>
```

### 3. 在组件中使用字典（正确示范）

```vue
<script setup>
import { computed } from 'vue'
import { useDict } from '@/composables/useDict'

const $dict = useDict()

// ✅ 正确：默认值设为 undefined，使用计算属性获取实际值
const props = defineProps({
  width: {
    type: String,
    default: undefined
  }
})

// 使用计算属性获取实际的弹窗宽度
const dialogWidth = computed(() => {
  return props.width || $dict.DIALOG_WIDTH.LARGE
})
</script>

<template>
  <el-dialog :width="dialogWidth">
    <!-- 弹窗内容 -->
  </el-dialog>
</template>
```

### 4. 完整的弹窗组件示例

```vue
<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useDict } from '@/composables/useDict'

// 使用全局字典
const $dict = useDict()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '弹窗标题'
  },
  width: {
    type: String,
    default: undefined
  }
})

// 使用计算属性来获取实际的弹窗宽度
const dialogWidth = computed(() => {
  return props.width || $dict.DIALOG_WIDTH.MEDIUM
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="new-safeweb-web">
    <el-dialog
      v-model="dialogVisible"
      v-dialogDrag
      :title="title"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <slot>默认内容</slot>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button class="reset-btn">取消</el-button>
          <el-button class="search-btn">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
```

## 总结

通过本 skill 的指导，你可以在项目中快速实现标准的弹窗功能，确保弹窗的样式和行为与项目整体保持一致。使用 Vue 3 的 Composition API 和预定义的样式类，提高代码的可维护性和一致性。
