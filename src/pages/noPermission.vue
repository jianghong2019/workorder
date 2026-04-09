<template>
  <div class="no-permission">
    <nullData title="暂无权限" />
  </div>
</template>

<script>
import nullData from '@/components/common/nullData.vue'
export default {
  name: 'nullAuth',
  components: {
    nullData,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped>
.no-permission {
  width: 100%;
  height: 100%;
}
</style>
