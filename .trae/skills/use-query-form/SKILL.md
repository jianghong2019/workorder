# 查询条件表单生成技能

## 功能说明

本技能用于生成标准的查询条件表单，支持以下功能：

- 表单元素支持 `el-input`、`el-select`、`el-date-picker`、`OrgTree` 等
- 一行展示 3 个表单项
- 初始展示最多 5 个表单项，第二行最后一个位置留给操作按钮，多余项可展开/收起
- 表单末尾包含重置、查询、展开/收起按钮
- 使用预定义的样式类确保视觉一致性

## 样式参考

- 表单容器：使用 `searchData` 和 `cardboxpd` 类
- 表单：使用 `search_input` 类
- 表单项：使用 `form-item-new` 类（宽度 30%）
- 按钮样式：使用 `search-btn`、`reset-btn`、`isshow-btn` 类（配合 `el-btn-new` 使用）
- 布局类：`flex-row-bw`、`flex-row-end`、`flex-wrap`

## 实现示例

### 示例 1：静态表单项（使用 Options API）

```vue
<template>
  <el-header class="cardboxpd">
    <el-form
      ref="searchData"
      :model="searchData"
      label-position="right"
      label-width="100px"
      class="searchData search_input"
    >
      <!-- 第一行：3 个表单项 -->
      <div class="flex-row-bw">
        <el-form-item label="工单类型" class="form-item-new">
          <el-select
            v-model="searchData.workTypeNo"
            filterable
            clearable
            placeholder="请选择"
            @change="changeType"
          >
            <el-option
              v-for="(item, index) in workTypeList"
              :key="index"
              :label="item.codeName"
              :value="item.codeValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工单子类" class="form-item-new">
          <el-select v-model="searchData.orderSubtype" filterable clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in workTypeSonList"
              :key="index"
              :label="item.codeName"
              :value="item.codeValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间" prop="time" class="date-box form-item-new">
          <el-date-picker
            v-model="time"
            type="daterange"
            class="timeBox"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
          <i class="el-icon-date data-icon"></i>
        </el-form-item>
      </div>
      
      <!-- 第二行：表单项 + 按钮区域 -->
      <div class="flex-row-bw flex-wrap">
        <el-form-item label="工单编号" class="form-item-new">
          <el-input
            v-model="searchData.appNo"
            class="input-box"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        
        <!-- 按钮区域：根据表单项数量动态选择类名 -->
        <div class="flex-row-end search-buttons form-item-btn30">
          <el-button class="el-btn-new reset-btn" plain size="small" @click="formReset">
            重 置
          </el-button>
          <el-button class="el-btn-new search-btn" type="primary" plain size="small" @click="formSubmit">
            查 询
          </el-button>
        </div>
      </div>
    </el-form>
  </el-header>
</template>

<script>
export default {
  name: 'WorkOrderConfig',
  data() {
    return {
      searchData: {
        workTypeNo: '',
        orderSubtype: '',
        appNo: '',
      },
      time: [],
      workTypeList: [],
      workTypeSonList: [],
    }
  },
  mounted() {
    this.getWorkTypelList()
    this.search()
  },
  methods: {
    // 查询工单类型
    getWorkTypelList() {
      // API 调用逻辑
    },
    // 查询工单子类型
    changeType(val) {
      // 处理工单类型变化
    },
    // 重置按钮
    formReset() {
      this.searchData = {
        workTypeNo: '',
        orderSubtype: '',
        appNo: '',
      }
      this.time = []
      this.workTypeSonList = []
      this.pageSize = 10
      this.pageIndex = 1
      this.search()
    },
    // 查询按钮
    formSubmit() {
      this.search()
    },
    // 查询调接口
    search() {
      // API 调用逻辑
    },
  },
}
</script>
```

### 示例 2：动态表单项（使用 Composition API + 展开/收起）

```vue
<script setup>
import { ref, reactive, computed } from 'vue'
import OrgTree from '@/components/common/OrgTree.vue'
import { useUnitData } from '@/composables/useUnitData.js'

// 使用 useUnitData hook 获取组织机构数据
const { unitData, unitDataLoading, unitDataError, fetchUnitData } = useUnitData()

// 搜索表单数据
const searchForm = reactive({
  deviceName: '',
  deviceType: '',
  area: '',
  manager: '',
  status: '',
  createTime: '',
  deviceCode: '',
  orgId: '',
  includeSubOrg: false,
  lastMaintain: '',
  manufacturer: '',
  installLocation: '',
  deviceModel: '',
})

const showMore = ref(false)

// 表单项配置 - 初始显示的 5 个表单项
const formItems = [
  {
    key: 'deviceName',
    label: '设备名称',
    type: 'input',
    placeholder: '请输入设备名称',
  },
  {
    key: 'deviceType',
    label: '设备类型',
    type: 'select',
    placeholder: '请选择设备类型',
    options: [
      { label: '类型 1', value: '1' },
      { label: '类型 2', value: '2' },
    ],
  },
  {
    key: 'area',
    label: '所属区域',
    type: 'select',
    placeholder: '请选择所属区域',
    options: [
      { label: '区域 1', value: '1' },
      { label: '区域 2', value: '2' },
    ],
  },
  {
    key: 'manager',
    label: '负责人',
    type: 'input',
    placeholder: '请输入负责人',
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '正常', value: 'normal' },
      { label: '异常', value: 'abnormal' },
    ],
  },
]

// 展开后显示的表单项 - 超过 5 个的表单项
const moreFormItems = [
  {
    key: 'createTime',
    label: '创建时间',
    type: 'date',
    dateType: 'daterange',
  },
  {
    key: 'deviceCode',
    label: '设备编号',
    type: 'input',
    placeholder: '请输入设备编号',
  },
  {
    key: 'orgId',
    label: '管理机构',
    type: 'org',
    includeKey: 'includeSubOrg',
  },
  {
    key: 'lastMaintain',
    label: '上次维护',
    type: 'date',
  },
  {
    key: 'manufacturer',
    label: '制造商',
    type: 'input',
    placeholder: '请输入制造商',
  },
  {
    key: 'installLocation',
    label: '安装位置',
    type: 'input',
    placeholder: '请输入安装位置',
  },
  {
    key: 'deviceModel',
    label: '设备型号',
    type: 'input',
    placeholder: '请输入设备型号',
  },
]

// 计算按钮区域的表单项类名
const buttonFormItemClass = computed(() => {
  // 计算实际显示的表单项数量
  const visibleFormItems = formItems.length + (showMore.value ? moreFormItems.length : 0)
  // 对 3 取余，为 0 时使用 form-item-btn100，否则使用 form-item-btn30
  return visibleFormItems % 3 === 0 ? 'form-item-btn100' : 'form-item-btn30'
})

// 检查是否显示展开/收起按钮
const showToggleButton = computed(() => {
  return formItems.length + moreFormItems.length > 5
})

// 查询方法
const search = () => {
  console.log('查询参数:', searchForm)
}

// 重置表单
const resetForm = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = ''
  })
  searchForm.includeSubOrg = false
}

// 切换展开/收起
const toggleMore = () => {
  showMore.value = !showMore.value
}

// 处理组织机构选择
const handleOrgSelect = (selectedOrg, key) => {
  console.log('选择的组织机构:', selectedOrg, 'key:', key)
}
</script>

<template>
  <el-header class="cardboxpd">
    <el-form
      ref="searchData"
      :model="searchForm"
      label-position="right"
      label-width="100px"
      class="searchData search_input"
    >
      <!-- 初始显示的表单项 -->
      <div class="flex-row-bw" v-for="item in formItems" :key="item.key">
        <el-form-item :label="item.label" class="form-item-new">
          <!-- 输入框类型 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="searchForm[item.key]"
            :placeholder="item.placeholder"
          />

          <!-- 选择器类型 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="searchForm[item.key]"
            :placeholder="item.placeholder"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <!-- 日期选择器类型 -->
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="searchForm[item.key]"
            :type="item.dateType || 'date'"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />

          <!-- 组织机构选择器 -->
          <OrgTree
            v-else-if="item.type === 'org'"
            v-model="searchForm[item.key]"
            :unit-data="unitData"
            :is-show-include="true"
            v-model:is-include="searchForm[item.includeKey]"
            @handler-tree-select="(org) => handleOrgSelect(org, item.key)"
          />
        </el-form-item>
      </div>

      <!-- 展开/收起部分 -->
      <div class="flex-row-bw flex-wrap">
        <template v-if="showMore">
          <el-form-item
            v-for="item in moreFormItems"
            :key="item.key"
            :label="item.label"
            class="form-item-new"
          >
            <!-- 输入框类型 -->
            <el-input
              v-if="item.type === 'input'"
              v-model="searchForm[item.key]"
              :placeholder="item.placeholder"
            />

            <!-- 选择器类型 -->
            <el-select
              v-else-if="item.type === 'select'"
              v-model="searchForm[item.key]"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <!-- 日期选择器类型 -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="searchForm[item.key]"
              :type="item.dateType || 'date'"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </template>

        <!-- 按钮区域 -->
        <div :class="['flex-row-end search-buttons', buttonFormItemClass]">
          <el-button class="el-btn-new reset-btn" plain size="small" @click="resetForm">
            重 置
          </el-button>
          <el-button class="el-btn-new search-btn" type="primary" plain size="small" @click="search">
            查 询
          </el-button>
          <!-- 仅当表单项数量超过 5 个时显示展开/收起按钮 -->
          <el-button
            v-if="showToggleButton"
            type="text"
            class="isshow-btn"
            @click="toggleMore"
          >
            {{ showMore ? '收起' : '展开' }}
            <i :class="['el-icon-arrow-down', { active: showMore }]"></i>
          </el-button>
        </div>
      </div>
    </el-form>
  </el-header>
</template>
```

### 示例 3：使用 OrgTree 组件的查询表单

```vue
<script setup>
import { ref, reactive } from 'vue'
import OrgTree from '@/components/common/OrgTree.vue'
import { useUnitData } from '@/composables/useUnitData.js'

const { unitData } = useUnitData()

const searchForm = reactive({
  orgId: '',
  includeSubOrg: false,
  workType: '',
  status: '',
})

const handleOrgSelect = (selectedOrg) => {
  console.log('选择的组织机构:', selectedOrg)
}

const search = () => {
  console.log('查询参数:', searchForm)
}

const resetForm = () => {
  searchForm.orgId = ''
  searchForm.includeSubOrg = false
  searchForm.workType = ''
  searchForm.status = ''
}
</script>

<template>
  <el-header class="cardboxpd">
    <el-form
      ref="searchData"
      :model="searchForm"
      label-position="right"
      label-width="100px"
      class="searchData search_input"
    >
      <div class="flex-row-bw">
        <el-form-item label="管理机构" class="form-item-new">
          <OrgTree
            v-model="searchForm.orgId"
            :unit-data="unitData"
            :is-show-include="true"
            v-model:is-include="searchForm.includeSubOrg"
            @handler-tree-select="handleOrgSelect"
          />
        </el-form-item>
        <el-form-item label="工单类型" class="form-item-new">
          <el-select v-model="searchForm.workType" placeholder="请选择">
            <el-option label="类型 1" value="1" />
            <el-option label="类型 2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="form-item-new">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="正常" value="normal" />
            <el-option label="异常" value="abnormal" />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex-row-bw flex-wrap">
        <div class="flex-row-end search-buttons form-item-btn100">
          <el-button class="el-btn-new reset-btn" plain size="small" @click="resetForm">
            重 置
          </el-button>
          <el-button class="el-btn-new search-btn" type="primary" plain size="small" @click="search">
            查 询
          </el-button>
        </div>
      </div>
    </el-form>
  </el-header>
</template>
```

## 实现要点

### 1. 布局结构

- 表单容器使用 `el-header` 组件，添加 `cardboxpd` 类
- `el-form` 配置：`label-position="right"` 和 `label-width="100px"`
- 使用 `searchData` 和 `search_input` 类
- 使用 `flex-row-bw` 实现一行 3 个表单项的布局
- 每个表单项使用 `form-item-new` 类，宽度设置为 30%
- 支持直接在 `el-form` 下放置多个 `el-form-item`，它们会自动换行

### 2. 展开/收起功能

- **仅当表单项数量超过 5 个时需要**：如果表单项数量在 5 个及以内，不需要展开/收起按钮
- 使用 `showMore` 变量控制额外表单项的显示/隐藏
- 点击展开/收起按钮时切换 `showMore` 状态
- 当表单项数量在 5 个及以内时，应移除展开/收起按钮和相关逻辑

### 3. 按钮区域布局

- 使用 `div` 包裹按钮区域，添加 `flex-row-end search-buttons` 类
- 根据表单项数量动态选择类名：
  - `form-item-btn100`：当表单项数量对 3 取余为 0 时（占满整行）
  - `form-item-btn30`：当表单项数量对 3 取余不为 0 时（占 30% 宽度）
- 使用 `flex-row-end` 确保按钮右对齐

### 4. 按钮样式

- 所有按钮都需要添加 `el-btn-new` 基础样式类
- 重置按钮：使用 `reset-btn` 类（配合 `plain` 和 `size="small"`）
- 查询按钮：使用 `search-btn` 类（配合 `type="primary"`、`plain` 和 `size="small"`）
- 展开/收起按钮：使用 `isshow-btn` 类（`type="text"`）

### 5. 表单元素

- 支持 `el-input`、`el-select`、`el-date-picker` 等常用表单元素
- 对于组织机构/单位选择，使用 `OrgTree.vue` 组件（已封装的树形选择器）
- 日期选择器需要添加 `value-format="yyyy-MM-dd"` 属性

### 6. 避免多余和空的表单项

- 不要生成空的 `el-form-item` 元素
- 确保每个表单项都有实际的表单控件或内容
- 当使用 `OrgTree` 组件时，不需要额外添加"包含下级"复选框，因为复选框是 `OrgTree` 组件的一部分
- 只添加实际需要的表单项，避免为了凑数而添加空的表单项

## 动态计算表单项数量的实现

### 1. 动态表单项（使用 v-for 渲染的表单项）

基于数据计算实际显示的表单项数量：

```javascript
// Vue 3 Composition API 版本
const buttonFormItemClass = computed(() => {
  // 计算实际显示的表单项数量
  const visibleFormItems = formItems.length + (showMore.value ? moreFormItems.length : 0)
  // 对 3 取余，为 0 时使用 form-item-btn100，否则使用 form-item-btn30
  return visibleFormItems % 3 === 0 ? 'form-item-btn100' : 'form-item-btn30'
})

// 检查是否显示展开/收起按钮（动态表单项）
const showToggleButton = computed(() => {
  return formItems.length + moreFormItems.length > 5
})
```

### 2. 展开/收起按钮显示逻辑

**动态表单项**：

```javascript
// Vue 3 Composition API 版本
const showToggleButton = computed(() => {
  return formItems.length + moreFormItems.length > 5
})
```

**静态表单项**（不推荐，建议使用动态表单项）：

```javascript
// Vue 3 Composition API 版本
const shouldShowToggleButton = () => {
  // 通过 class 选择器获取表单项数量
  const formItems = document.querySelectorAll('.form-item-new')
  return formItems.length > 5
}
```

### 3. 注意事项

1. **动态表单项**：基于数据计算更可靠，无需依赖 DOM 操作
2. **按钮区域类名绑定**：
   - 动态表单项：使用计算属性 `:class="buttonFormItemClass"`
3. **展开/收起按钮显示逻辑**：
   - **动态表单项**：基于数据计算表单项数量，超过 5 个时显示按钮

## 组织机构选择组件使用说明

当表单中需要选择管理机构/单位等组织机构时，使用 `OrgTree.vue` 组件，这是一个二次封装的树形选择器。

### 导入组件和 useUnitData hook

```javascript
// Vue 3 Composition API
import { ref, reactive } from 'vue'
import OrgTree from '@/components/common/OrgTree.vue'
import { useUnitData } from '@/composables/useUnitData.js'

// 使用 useUnitData hook 获取组织机构数据
const { unitData, unitDataLoading, unitDataError, fetchUnitData } = useUnitData()
```

### 使用示例

```vue
<el-form-item label="管理机构" class="form-item-new">
  <OrgTree
    v-model="searchForm.orgId"
    :unit-data="unitData"
    :is-show-include="true"
    v-model:is-include="searchForm.includeSubOrg"
    @handler-tree-select="handleOrgSelect"
  />
</el-form-item>
```

### 属性说明

- `v-model`：绑定选中的组织机构 ID
- `:unit-data`：组织机构树形数据，使用 `useUnitData()` hook 的返回值
- `:is-show-include`：是否显示"包含下级"复选框
- `v-model:is-include`：是否包含下级组织（Vue 3 语法，替代 `:is-include.sync`）
- `@handler-tree-select`：选择组织机构时的回调

### 注意事项

- 使用 `useUnitData()` hook 自动获取组织机构数据，无需手动定义 `orgData`
- `useUnitData()` 会自动从缓存或 API 获取数据，并在用户信息变化时更新
- 可以根据需要调整 `is-show-include` 属性来控制是否显示"包含下级"选项
- 选择组织机构时，可以通过 `handler-tree-select` 事件获取详细的组织信息
- 当页面中有单位或组织机构的下拉选择器时，直接使用 `OrgTree` 组件，无需额外添加包含下级的复选框，因为复选框是 `OrgTree` 组件的一部分

## 重要强调

### 必须严格遵守的实现要求：

1. **OrgTree 组件使用**：

   - **必须使用** OrgTree 组件进行组织机构/单位选择
   - **禁止**额外添加"包含下级"复选框，因为 OrgTree 组件已经内置了该功能
   - **必须正确配置**：使用 `:unit-data` 传递数据，`:is-show-include="true"` 显示复选框，`v-model:is-include` 双向绑定

2. **表单布局和展示**：

   - **严格控制初始展示数量**：初始最多显示 5 个表单项
   - **严格遵守按钮位置**：第二行最后一个位置必须留给操作按钮
   - **必须实现展开/收起功能**：超过 5 个的表单项需要通过 `v-show="showMore"` 或条件渲染控制显示，并提供展开/收起按钮

3. **样式和类名**：

   - **必须使用指定的样式类**：表单容器使用 `searchData` 和 `cardboxpd`，表单使用 `search_input`
   - **必须使用正确的按钮样式**：所有按钮都必须添加 `el-btn-new` 基础类，查询按钮使用 `search-btn`，重置按钮使用 `reset-btn`，展开/收起按钮使用 `isshow-btn`
   - **必须动态计算按钮区域类名**：根据表单项数量使用 `form-item-btn100` 或 `form-item-btn30`

4. **功能实现**：

   - **必须添加必要的方法**：包括搜索、重置、展开/收起、按钮区域类名计算等
   - **必须使用 useUnitData hook**：获取组织机构数据
   - **必须正确处理事件**：使用 `@handler-tree-select` 处理组织选择事件

### 验证步骤：

实现完成后，必须验证以下内容：

1. 初始是否只显示 5 个表单项
2. 按钮是否位于第二行最后一个位置
3. 展开/收起功能是否正常工作
4. OrgTree 组件是否正确使用，没有额外的复选框
5. 所有样式类是否正确应用（特别是 `el-btn-new` 基础类）
6. 功能是否完整（搜索、重置等）

**任何不符合以上要求的实现都需要重新调整，确保严格按照本 skill 文件的规范执行。**

## 注意事项

1. **SCSS 样式**：公共样式已在 `src/styles/index.scss` 中定义，通过 `@use` 自动导入，无需手动引入
2. **表单项数量超过 5 个时**：会自动显示展开/收起按钮
3. **日期选择器**：需要添加 `value-format="yyyy-MM-dd"` 属性
4. **按钮样式**：所有按钮都必须添加 `el-btn-new` 基础样式类
5. **Vue 3 语法**：推荐使用 Composition API 和 `<script setup>` 语法
6. **v-model 语法**：Vue 3 中使用 `v-model:propName` 替代 `:propName.sync`
