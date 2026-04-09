---
name: 'use-el-col-layout'
description: '指导使用el-col布局进行键值对和表单式显示。当以键值对格式显示数据并需要适当的换行和省略号时调用。'
---

# 使用 Element UI Col 布局进行键值对显示

此技能帮助您使用 Element UI 的 el-col 组件创建一致的键值对和表单式显示布局，确保适当的换行和省略号行为。

## 使用时机

当以下情况时调用此技能：

- 以键值对格式显示数据
- 创建表单式布局
- 需要控制文本换行和省略号行为
- 希望确保一致的间距和对齐
- 需要根据设计稿实现布局时

## 设计稿实现要求

**重要**：当根据设计稿实现布局时，务必：

- 100%按照设计稿的样式和布局实现
- 不要添加设计稿中没有的元素或样式
- 保持与设计稿完全一致的间距、对齐和样式
- 严格遵循设计稿中的数据展示格式
- 避免画蛇添足，只实现设计稿中明确要求的内容

## 主要功能

此技能提供以下指导：

- 使用 el-row 和 el-col 进行一致的布局
- 将键和值保持在同一列的同一行
- 允许值换行但限制为最多 3 行
- 对长值显示省略号
- 提供悬停时显示完整数据的工具提示

## 使用指南

### 1. 基本结构（键和值在同一列）

```vue
<template>
  <div class="key-value-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="key-value-pair">
          <span class="key">键 1：</span>
          <span class="value">值 1</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="key-value-pair">
          <span class="key">键 2：</span>
          <span class="value">可能会换行但应限制为 3 行并显示省略号的长值</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="key-value-pair">
          <span class="key">键 3：</span>
          <span class="value">值 3</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.key-value-container {
  .key-value-pair {
    display: flex;
    flex-direction: column;

    .key {
      font-size: $font-sm;
      color: $font-color-light;
      margin-bottom: 4px;
    }

    .value {
      font-size: $font-base;
      color: $font-color-main;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
```

### 2. 带完整显示工具提示

```vue
<template>
  <div class="key-value-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="key-value-pair">
          <span class="key">描述：</span>
          <el-tooltip :content="longDescription" placement="top">
            <span class="value">{{ longDescription }}</span>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      longDescription:
        '这是一个非常长的描述，会超过 3 行限制，应该显示省略号，但完整内容应该通过悬停时的工具提示可见。',
    };
  },
};
</script>

<style lang="scss" scoped>
.key-value-container {
  .key-value-pair {
    display: flex;
    flex-direction: column;

    .key {
      font-size: $font-sm;
      color: $font-color-light;
      margin-bottom: 4px;
    }

    .value {
      font-size: $font-base;
      color: $font-color-main;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
```

### 3. 表单式布局

```vue
<template>
  <div class="form-like-container">
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="选择">
          <el-option label="活跃" value="active" />
          <el-option label="非活跃" value="inactive" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        status: '',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.form-like-container {
  .el-form-item {
    margin-bottom: $spacing-md;
  }
}
</style>
```

### 4. 响应式布局

```vue
<template>
  <div class="key-value-container">
    <el-row :gutter="20">
      <el-col :span="8" :xs="24" :sm="12" :md="8">
        <div class="key-value-pair">
          <span class="key">键 1：</span>
          <span class="value">值 1</span>
        </div>
      </el-col>
      <el-col :span="8" :xs="24" :sm="12" :md="8">
        <div class="key-value-pair">
          <span class="key">键 2：</span>
          <span class="value">可能会换行但应限制为 3 行并显示省略号的长值</span>
        </div>
      </el-col>
      <el-col :span="8" :xs="24" :sm="12" :md="8">
        <div class="key-value-pair">
          <span class="key">键 3：</span>
          <span class="value">值 3</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.key-value-container {
  .key-value-pair {
    display: flex;
    flex-direction: column;

    .key {
      font-size: $font-sm;
      color: $font-color-light;
      margin-bottom: 4px;
    }

    .value {
      font-size: $font-base;
      color: $font-color-main;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
```

### 5. 最佳实践

1. **使用一致的列宽**：通常每个键值对使用 8 列（常见场景）
2. **设置适当的间距**：使用 `:gutter="20"` 确保列之间的一致间距
3. **实现响应式设计**：为不同屏幕尺寸使用断点
4. **添加工具提示**：为长值添加工具提示以确保悬停时完整可见
5. **限制行数**：使用 `-webkit-line-clamp: 3` 将值限制为最多 3 行
6. **确保适当的省略号**：对截断的文本使用 `text-overflow: ellipsis`
7. **保持一致的样式**：使用 SCSS 变量设置字体大小和颜色
8. **结构化键值对**：将键和值放在同一列中以获得更好的组织（所有场景推荐）

### 6. 关键 CSS 属性

```scss
.key-value-pair {
  /* 键值对结构 */
  display: flex;
  flex-direction: column;
}

.key {
  /* 键样式 */
  font-size: $font-sm;
  color: $font-color-light;
  margin-bottom: 4px;
}

.value {
  /* 带省略号的值样式 */
  font-size: $font-base;
  color: $font-color-main;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## 示例实现

### 键值对显示

```vue
<template>
  <div class="info-card">
    <h3 class="card-title">用户信息</h3>
    <div class="key-value-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="key-value-pair">
            <span class="key">姓名：</span>
            <span class="value">{{ user.name }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="key-value-pair">
            <span class="key">邮箱：</span>
            <span class="value">{{ user.email }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="key-value-pair">
            <span class="key">描述：</span>
            <el-tooltip :content="user.description" placement="top">
              <span class="value">{{ user.description }}</span>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '张三',
        email: 'zhangsan@example.com',
        description:
          '这是用户的详细描述，超过 3 行限制，应该显示省略号。完整内容将通过悬停时的工具提示可见。',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.info-card {
  background-color: #fff;
  border-radius: $border-radio-md;
  box-shadow: $box-shadow;
  padding: $spacing-base;

  .card-title {
    font-size: $font-middle;
    color: $font-color-dark;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-color;
  }
}

.key-value-container {
  .key {
    font-size: $font-base;
    color: $font-color-middle;
    line-height: 1.5;
  }

  .value {
    font-size: $font-base;
    color: $font-color-main;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-row {
    margin-bottom: $spacing-sm;
  }
}
</style>
```

### 表单式显示

```vue
<template>
  <div class="form-container">
    <h3 class="form-title">项目详情</h3>
    <el-form :model="project" label-width="120px">
      <el-form-item label="项目名称">
        <el-input v-model="project.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="project.description" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="project.status" placeholder="选择状态">
          <el-option label="活跃" value="active" />
          <el-option label="非活跃" value="inactive" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker v-model="project.startDate" type="date" placeholder="选择日期" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      project: {
        name: '',
        description: '',
        status: '',
        startDate: '',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  background-color: #fff;
  border-radius: $border-radio-md;
  box-shadow: $box-shadow;
  padding: $spacing-base;

  .form-title {
    font-size: $font-middle;
    color: $font-color-dark;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-color;
  }

  .el-form-item {
    margin-bottom: $spacing-md;
  }
}
</style>
```

通过遵循此技能的指导，您可以创建一致、专业的键值对和表单式显示布局，具有适当的换行、省略号和工具提示功能。
