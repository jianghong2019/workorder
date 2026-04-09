---
name: 'use-scss-variables'
description: '指导使用 src/styles 目录下的 SCSS 变量和混用进行一致的样式设计。在为组件或页面设置样式时调用，以确保设计一致性。'
---

# 使用 SCSS 变量和混用

此技能帮助您使用 `src/styles` 目录中的 SCSS 变量和混用，以在应用程序中保持一致的样式。

## 文件结构

```
src/styles/
├── var.scss          # 设计变量（颜色、字体、间距、圆角、渐变等）
├── mixins.scss       # SCSS 混用（文字溢出、边框、间距、按钮等）
├── index.scss        # 主入口文件（导入所有变量和混用）
└── element/
    └── index.scss    # Element Plus 自定义样式
```

## 使用时机

当以下情况时调用此技能：

- 您正在为新组件或页面设置样式
- 您需要确保应用程序中的设计一致性
- 您希望使用预定义的颜色、字体、间距或其他设计标记
- 您正在重构现有样式以使用变量
- 您需要使用通用的样式混用

## 主要功能

### 1. var.scss - 设计变量

#### 颜色变量

```scss
// 主色调
$color-primary: #009b83;           // 主色调，用于强调文字、按钮和图标
$color-primary-fuzhu: #33af9c;     // 辅助色
$color-primary-hover: #33af9c;     // 悬停状态
$color-primary-click: #028671;     // 点击状态

// 功能色
$color-warning: #fc8e32;           // 警告
$color-error: #fe3333;             // 错误、违章、问题
$color-blue: #15acfc;              // 蓝色

// 灰色系
$color-gray: #f6f6f6;              // 灰色 1
$color-gray2: #eee;                // 灰色 2
$color-gray3: #ddd;                // 灰色 3
$color-gray4: #ccc;                // 灰色 4

// 字体颜色
$font-color-dark: #426170;         // 深色，用于标题、重要信息
$font-color-main: #2a2b2f;         // 主色，用于主要文字
$font-color-middle: #7b919b;       // 中灰色，用于普通段落
$font-color-light: #99a09e;        // 浅灰色，用于提示文字

// 边框和背景
$border-color: #e7ecee;            // 边框色
$card-color: #f5f7f7;              // 卡片背景色
$border-color-lighter: #dee0e6;    // 按钮浅色边框
$border-color-primary: #009b83;    // 按钮边框色
```

#### 字体大小

```scss
$font-big: 18px;        // 卡片标题重要文字
$font-middle: 16px;     // 二级标题、顶部导航标题
$font-base: 14px;       // 正文使用
$font-sm: 12px;         // 辅助性文字
$font-xs: 10px;         // 极小文字
```

#### 间距

```scss
$spacing-base: 20px;    // 基本间距
$spacing-md: 10px;      // 卡片间间距
$spacing-sm: 8px;       // 小间距
$spacing-normal: 16px;  // 大部分编辑页面间距
```

#### 圆角

```scss
$border-radio: 4px;       // 通用圆角
$border-radio-lg: 12px;   // 大圆角（工作台页面卡片）
$border-radio-md: 4px;    // 中等圆角（卡片、弹框、输入框、按钮）
$border-radio-sm: 2px;    // 小圆角（复选框、小元素）
```

#### 表单尺寸

```scss
// 表单高度
$form-item-height-lg: 40px;   // 表单大高度
$form-item-height-md: 32px;   // 表单中等高度
$form-item-height-sm: 28px;   // 表单小高度

// 输入框高度
$input-height-md: 32px;       // 输入框中等高度
$input-height-sm: 28px;       // 输入框小高度
```

#### 渐变色

```scss
// 浅绿渐变（容器背景）
$gradient-sky-light-start: #e6fcf3;
$gradient-sky-light-end: #f5f7f7;
$gradient-sky-light-horizontal: linear-gradient(90deg, #e6fcf3 0%, #f5f7f7 100%);
$gradient-sky-light-vertical: linear-gradient(180deg, #e6fcf3 0%, #f5f7f7 100%);

// 深绿渐变
$gradient-green-dark-start: #029c84;
$gradient-green-dark-end: #54c8b6;
$gradient-green-dark-horizontal: linear-gradient(90deg, $gradient-green-dark-start 0%, $gradient-green-dark-end 100%);
$gradient-green-dark-vertical: linear-gradient(180deg, $gradient-green-dark-start 0%, $gradient-green-dark-end 100%);

// 浅绿渐变
$gradient-green-light-start: #00c4d9;
$gradient-green-light-end: rgba(1, 196, 217, 0.7);

// 蓝色渐变
$gradient-blue-start: #039dee;
$gradient-blue-end: #78d0ff;

// 黄色渐变
$gradient-yellow-start: #fc8e32;
$gradient-yellow-end: rgba(252, 142, 50, 0.702);

// Element 组件渐变
$el-gradient-green-horizontal: linear-gradient(90deg, #f3fcfa 0%, #ffffff 100%);
$el-gradient-green-vertical: linear-gradient(180deg, #f3fcfa 0%, #ffffff 100%);
```

#### 阴影

```scss
$box-shadow: 0px 4px 10px 0px #e8f4f3;           // 卡片、弹框等盒子阴影
$el-box-shadow: 0px 6px 12px 0px rgba(0, 62, 53, 0.12);  // Element 组件阴影
```

### 2. mixins.scss - SCSS 混用

#### 文字溢出处理

```scss
// 单行省略
@include text-overflow(1);

// 多行省略
@include text-overflow(2);  // 2 行省略
```

#### 边框

```scss
// 完整边框
@include border($color, $width);

// 单方向边框
@include border-dir(top, $width, $color);
@include border-dir(right, $width, $color);
@include border-dir(bottom, $width, $color);
@include border-dir(left, $width, $color);
```

#### 圆角

```scss
@include radius($radius, $overflow);
```

#### 间距

```scss
// 纵向间距（上下）
@include padding-col($n, $sizeKey);
@include margin-col($n, $sizeKey);

// 横向间距（左右）
@include padding-row($n, $sizeKey);
@include margin-row($n, $sizeKey);

// 使用示例：
@include padding-col(10px, 'zero');  // zero 表示使用 !important
@include margin-row(20px);
```

#### 按钮样式

```scss
// 按钮前置样式
@include el-btn-new;

// 深色按钮
@include primary-btn;

// 浅色按钮
@include light-btn;
```

## 使用指南

### 1. 全局导入

**重要**：`index.scss` 文件已经全局导入到项目中，因此您不需要在单个组件中手动导入。

在 `vite.config.js` 中已配置：

```javascript
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `
      @use "@/styles/var.scss" as *;
      @use "@/styles/index.scss" as *;
      `,
    },
  },
}
```

### 2. 使用示例

#### 使用颜色变量

```scss
.element {
  background-color: $color-primary;
  color: $font-color-dark;
  border: 1px solid $border-color;
}
```

#### 使用字体变量

```scss
.title {
  font-size: $font-big;
  font-weight: 600;
  color: $font-color-dark;
}
```

#### 使用间距变量

```scss
.container {
  padding: $spacing-base;
  margin-bottom: $spacing-md;
}
```

#### 使用圆角变量

```scss
.button {
  border-radius: $border-radio-md;
}
```

#### 使用渐变变量

```scss
.card-header {
  background: $gradient-green-dark-horizontal;
}
```

#### 使用阴影变量

```scss
.card {
  box-shadow: $box-shadow;
}
```

#### 使用文字溢出混用

```scss
.ellipsis {
  @include text-overflow(1);  // 单行省略
}

.multi-ellipsis {
  @include text-overflow(3);  // 3 行省略
}
```

#### 使用按钮混用

```scss
.new-button {
  @include el-btn-new;
  @include primary-btn;
}
```

#### 使用间距混用

```scss
.item {
  @include margin-col(10px);  // 上下外边距
  @include padding-row(16px); // 左右内边距
}
```

### 3. 完整组件示例

```vue
<template>
  <div class="user-card">
    <div class="card-header">
      <h3>{{ user.name }}</h3>
    </div>
    <div class="card-body">
      <p class="user-email">{{ user.email }}</p>
      <p class="user-role">{{ user.role }}</p>
    </div>
    <div class="card-footer">
      <el-button type="primary" class="action-button">编辑</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-card {
  background-color: #fff;
  border-radius: $border-radio-md;
  box-shadow: $box-shadow;
  overflow: hidden;

  .card-header {
    background: $gradient-sky-light-vertical;
    padding: $spacing-md;

    h3 {
      font-size: $font-middle;
      color: $font-color-dark;
      margin: 0;
      @include text-overflow(1);
    }
  }

  .card-body {
    padding: $spacing-base;

    .user-email {
      font-size: $font-base;
      color: $font-color-main;
      margin-bottom: $spacing-sm;
    }

    .user-role {
      font-size: $font-sm;
      color: $font-color-middle;
    }
  }

  .card-footer {
    padding: $spacing-md $spacing-base;
    border-top: 1px solid $border-color;
    text-align: right;

    .action-button {
      @include el-btn-new;
      @include primary-btn;
      border-radius: $border-radio-sm;
    }
  }
}
</style>
```

## 最佳实践

1. ✅ **始终使用变量**：避免硬编码颜色、大小或间距
2. ✅ **一致性**：在相似元素上使用相同的变量
3. ✅ **语义使用**：使用与用途匹配的变量（例如，使用 `$color-error` 用于错误消息）
4. ✅ **使用混用**：对于常用样式模式，使用混用以减少重复代码
5. ✅ **响应式设计**：将变量用作响应式布局的基础
6. ✅ **文档**：在复杂场景中使用变量时，为样式添加注释
7. ✅ **使用全局导入**：不需要在每个组件中手动导入 SCSS 文件

## 常用工具类

项目中已定义了一些常用的工具类，可以直接使用：

```scss
// 弹性布局
.flex-row { display: flex; }
.flex-row-vcenter { display: flex; align-items: center; }
.flex-row-c { display: flex; align-items: center; justify-content: center; }
.flex-row-bw { display: flex; justify-content: space-between; }
.flex-row-start { display: flex; justify-content: flex-start; }
.flex-row-end { display: flex; justify-content: flex-end; }
.flex-col { display: flex; flex-direction: column; }

// 卡片容器
.cardbox { 
  border-radius: $border-radio-md;
  background-color: #fff;
  padding: 0 $spacing-base;
}

.cardboxpd-all {
  border-radius: $border-radio-md;
  background-color: #fff;
  padding: $spacing-base;
}

// 渐变色
.box-linear-gradient {
  background: linear-gradient(180deg, #def6eb 4%, #ffffff 100%) !important;
}

// 盒子阴影
.box-shadow-normal {
  box-shadow: $box-shadow;
}
```

## 变量参考表

| 类别 | 变量 | 值/描述 |
|------|------|---------|
| **颜色** | `$color-primary` | #009b83（主品牌色） |
| **颜色** | `$color-warning` | #fc8e32（警告色） |
| **颜色** | `$color-error` | #fe3333（错误色） |
| **颜色** | `$color-blue` | #15acfc（蓝色） |
| **字体** | `$font-big` | 18px |
| **字体** | `$font-middle` | 16px |
| **字体** | `$font-base` | 14px |
| **字体** | `$font-sm` | 12px |
| **间距** | `$spacing-base` | 20px |
| **间距** | `$spacing-normal` | 16px |
| **间距** | `$spacing-md` | 10px |
| **圆角** | `$border-radio-md` | 4px |
| **圆角** | `$border-radio-lg` | 12px |
| **阴影** | `$box-shadow` | 0px 4px 10px 0px #e8f4f3 |
| **渐变** | `$gradient-sky-light-vertical` | 浅色垂直渐变（容器背景） |
| **渐变** | `$gradient-green-dark-vertical` | 深绿垂直渐变 |
