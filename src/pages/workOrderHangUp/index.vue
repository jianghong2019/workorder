<script setup>
import BaseTitle from '@/components/common/BaseTitle.vue'
import OrgTree from '@/components/common/OrgTree.vue'
import ProblemRecordDialog from './components/ProblemRecordDialog.vue'
defineOptions({
  name: 'workOrderHangUp',
})
import workOrderHangUp from '@/pages/workOrderHangUp/components/workOrderHangUp.vue'
const router = useRouter()
const input = ref('')
const value1 = ref('')
const size = ref('small')
const options = [
  {
    orgId: '32401',
    label: '江西省',
    child: [
      {
        orgId: '3240101',
        label: '南昌市',
        child: [
          {
            orgId: '324010101',
            label: '新建区',
          },
          {
            orgId: '324010102',
            label: '东湖区',
          },
          {
            orgId: '324010103',
            label: '西湖区',
          },
          {
            orgId: '324010104',
            label: '赣州市',
          },
          {
            orgId: '324010105',
            label: '宜春市',
          },
        ],
      },
      {
        orgId: '3240102',
        label: '九江市',
        child: [
          {
            orgId: '324010201',
            label: '九江市',
          },
        ],
      },
      {
        orgId: '3240103',
        label: '宜春市',
        child: [
          {
            orgId: '324010301',
            label: '宜春市',
          },
          {
            orgId: '324010302',
            label: '吉安市',
          },
          {
            orgId: '324010303',
            label: '吉安市',
          },
        ],
      },
      {
        orgId: '3240104',
        label: '吉安市',
        child: [
          {
            orgId: '324010401',
            label: '吉安市',
          },
          {
            orgId: '324010402',
            label: '吉安市',
          },
          {
            orgId: '324010403',
            label: '吉安市',
          },
        ],
      },
    ],
  },
]

const state = reactive({
  value: '3240102',
})
const checked = ref(false)
const problemDialogVisible = ref(false)

// OrgTree 数据标准化函数
const normalizer = (node) => {
  return {
    id: node.orgId,
    label: node.label,
    children: node.child,
  }
}

const handlerBack = () => {
  console.log('点击了返回按钮')
  router.back()
}
const handlerDetail = () => {
  console.log('点击了详情按钮')
  router.push('/nullAuth')
}
const handlerOpenProblemDialog = () => {
  console.log('打开问题记录卡弹窗')
  problemDialogVisible.value = true
}
const handlerProblemConfirm = (formData) => {
  console.log('问题记录卡提交数据:', formData)
  ElMessage.success('保存成功')
  // 这里可以调用 API 保存数据
}
const handlerProblemCancel = () => {
  console.log('取消问题记录卡')
}
onMounted(() => {
  console.log('workOrderHangUp index 页面被挂载了')
})
onActivated(() => {
  console.log('workOrderHangUp index 页面被激活了')
})
</script>
<template>
  <div class="new-safeweb-web indexPages">
    <BaseTitle title="工单挂起" :back="true" :border="true" @click-go-back="handlerBack" />
    <div class="content-area">
      <el-input v-model="input" style="width: 240px" placeholder="请输入工单编号" />
      <el-date-picker v-model="value1" type="date" placeholder="请选择日期" />
      <button style="width: 80px; height: 32px" v-ripple>按钮</button>
      <el-button type="primary" @click="handlerDetail" style="margin: 10px"> 详情 </el-button>
      <el-button type="primary" @click="handlerOpenProblemDialog"> 问题记录 </el-button>
      <OrgTree
        style="width: 460px"
        v-model="state.value"
        :is-show-include="true"
        v-model:is-include="checked"
        :multiple="false"
        :options="options"
        :normalizer="normalizer"
        :default-expand-level="1"
        placeholder="请选择单位"
      />
      <!-- <workOrderHangUp></workOrderHangUp> -->
    </div>

    <!-- 问题记录卡弹窗 -->
    <ProblemRecordDialog
      v-model="problemDialogVisible"
      @confirm="handlerProblemConfirm"
      @cancel="handlerProblemCancel"
    />
  </div>
</template>
<style lang="scss" scoped>
.indexPages {
  height: 100%;
  background: #fff;
  .content-area {
    padding: 20px;
  }
}
</style>
