<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useDict } from '@/composables/useDict'

console.log('useDict', useDict, useDict())

// 使用全局字典
const $dict = useDict()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '问题记录卡',
  },
  width: {
    type: String,
    default: undefined,
  },
})

// 使用计算属性来获取实际的弹窗宽度
const dialogWidth = computed(() => {
  return props.width || $dict.DIALOG_WIDTH.LARGE
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 表单数据
const form = reactive({
  problemDesc: '',
  problemLevel: 'serious', // 安全问题：safety, 一般违章：general, 严重违章：serious
  problemClause: '',
  attachment: null,
})

// 问题等级选项
const problemLevelOptions = [
  { label: '安全问题', value: 'safety' },
  { label: '一般违章', value: 'general' },
  { label: '严重违章', value: 'serious' },
]

// 问题条款选项（示例数据，实际应从后端获取）
const problemClauseOptions = ref([
  { label: '未使用现场作业工作卡', value: 'clause1' },
  { label: '有限空间作业未执行"先通风、再检测、后作业"要求', value: 'clause2' },
  { label: '作业现场安全措施不到位', value: 'clause3' },
  { label: '作业人员未正确佩戴安全防护用品', value: 'clause4' },
])

// 监听弹窗关闭，重置表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  },
)

const handleConfirm = () => {
  // 表单验证
  if (!form.problemDesc) {
    ElMessage.warning('请输入问题描述')
    return
  }
  if (!form.problemLevel) {
    ElMessage.warning('请选择问题等级')
    return
  }
  if (!form.problemClause) {
    ElMessage.warning('请选择问题条款')
    return
  }

  console.log('提交的数据:', form)
  emit('confirm', form)
  dialogVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

const handleClose = () => {
  emit('cancel')
  dialogVisible.value = false
}

const resetForm = () => {
  form.problemDesc = ''
  form.problemLevel = 'serious'
  form.problemClause = ''
  form.attachment = null
}

// 处理文件上传
const handleFileChange = (file) => {
  console.log('选择的文件:', file)
  form.attachment = file
}

// 删除文件
const handleRemoveFile = () => {
  form.attachment = null
}
</script>

<template>
  <el-dialog
    class="new-safeweb-web"
    v-model="dialogVisible"
    :title="title"
    :width="dialogWidth"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-content">
      <el-form :model="form" label-width="100px" class="problem-form">
        <!-- 问题描述 -->
        <el-form-item label="问题描述" required>
          <div class="desc-wrapper">
            <el-input
              v-model="form.problemDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入问题描述"
              maxlength="140"
              show-word-limit
            />
          </div>
        </el-form-item>

        <!-- 问题等级 -->
        <el-form-item label="问题等级" required>
          <el-radio-group v-model="form.problemLevel">
            <el-radio value="safety">安全问题</el-radio>
            <el-radio value="general">一般违章</el-radio>
            <el-radio value="serious">严重违章</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 问题条款 -->
        <el-form-item label="问题条款" required>
          <el-select
            v-model="form.problemClause"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in problemClauseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 问题附件 -->
        <el-form-item label="问题附件" required>
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleRemoveFile"
            :limit="1"
          >
            <el-icon class="el-icon--upload">
              <EpUploadFilled />
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 5MB</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button class="reset-btn" @click="handleCancel">取消</el-button>
        <el-button class="search-btn" @click="handleConfirm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-content {
  padding: 10px 0;

  .problem-form {
    .el-form-item {
      margin-bottom: 24px;
    }

    .desc-wrapper {
      width: 100%;
    }

    .upload-demo {
      width: 100%;

      :deep(.el-upload-dragger) {
        width: 100%;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px dashed $border-color;
        border-radius: $border-radio-md;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: $transition-base;

        &:hover {
          border-color: $color-primary;
          background-color: $color-primary-light-9;
        }

        .el-icon--upload {
          font-size: 48px;
          color: $color-primary;
          margin-bottom: 8px;
        }

        .el-upload__text {
          font-size: $font-base;
          color: $font-color-light;

          em {
            color: $color-primary;
            font-style: normal;
          }
        }

        .el-upload__tip {
          font-size: $font-sm;
          color: $font-color-light;
          margin-top: 8px;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
