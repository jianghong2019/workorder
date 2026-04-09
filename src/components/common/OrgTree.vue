<template>
  <div class="flex-row org-tree-select">
    <treeselect
      v-model="localValue"
      :multiple="multiple"
      :options="options"
      :placeholder="placeholder"
      :async="async"
      :load-options="loadOptions"
      :searchable="searchable"
      :clearable="clearable"
      :disabled="disabled"
      :normalizer="normalizer"
      :default-expand-level="defaultExpandLevel"
      @select="handleSelect"
      @deselect="handleDeselect"
      @input="handleInput"
    />
    <el-checkbox class="include-checkbox" v-if="isShowInclude" v-model="checked">
      包含下级
    </el-checkbox>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Treeselect from '@zanmato/vue3-treeselect'
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css'

const props = defineProps({
  isShowInclude: {
    type: Boolean,
    default: true,
  },
  isInclude: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  async: {
    type: Boolean,
    default: false,
  },
  loadOptions: {
    type: Function,
    default: null,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  normalizer: {
    type: Function,
    default: (node) => {
      return {
        id: node.orgId,
        label: node.label,
        children: node.child,
      }
    },
  },
  defaultExpandLevel: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['update:modelValue', 'select', 'deselect', 'input', 'update:isInclude'])
const checked = computed({
  get: () => props.isInclude,
  set: (val) => {
    emit('update:isInclude', val)
  },
})

const localValue = ref(props.modelValue)

// // 监听 modelValue 变化
// watch(
//   () => props.modelValue,
//   (newValue) => {
//     localValue.value = newValue
//   },
//   { deep: true },
// )

// 监听本地值变化
watch(
  localValue,
  (newValue) => {
    emit('update:modelValue', newValue)
    emit('input', newValue)
  },
  { deep: true },
)

// 处理选择事件
const handleSelect = (value, instanceId) => {
  emit('select', value, instanceId)
}

// 处理取消选择事件
const handleDeselect = (value, instanceId) => {
  emit('deselect', value, instanceId)
}

// 处理输入事件
const handleInput = (value) => {
  emit('input', value)
}
</script>

<style scoped lang="scss">
.org-tree-select {
  width: 100%;

  :deep(.vue3-treeselect) {
    width: 100%;
    height: $input-height-md;
    /* 下拉列表样式 */
    .vue3-treeselect__menu-container {
      z-index: 3000 !important;
      .vue3-treeselect__option--selected,
      .vue3-treeselect__option--highlight {
        background: rgba($color-primary, 0.05);
      }
    }

    .vue3-treeselect__placeholder {
      line-height: $input-height-md;
    }
    .vue3-treeselect__control {
      height: $input-height-md;
      border-color: $border-color !important;
      padding-left: 12px;
      color: $font-color-light;
    }
    .vue3-treeselect__placeholder {
      font-size: $font-base;
      padding-left: 0px;
    }
    .vue3-treeselect--searchable .vue3-treeselect__input-container {
      padding-left: 0;
    }
    .vue3-treeselect__single-value {
      color: $font-color-main;
      padding-left: 0px;
    }
  }
  :deep(.vue3-treeselect--focused) {
    .vue3-treeselect__control {
      border-color: $border-color-primary !important;
    }
  }
  :deep(.vue3-treeselect--open-below) {
    .vue3-treeselect__menu {
      border-color: $border-color-primary;
    }
  }
  .include-checkbox {
    margin-left: 10px;
  }
}
</style>
