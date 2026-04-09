<!--
 * @Author: 杨舒文 874021960@qq.com
 * @Date: 2025-11-28 13:38:32
 * @LastEditors: 杨舒文 874021960@qq.com
 * @LastEditTime: 2025-11-28 16:22:31
 * @FilePath: \workordermapvisual_front\src\components\pages\hierarchicalControl\components\funButton.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="fun-btn">
    <template v-for="btn of btnList">
      <el-badge v-if="btn.value" :key="btn.id" :value="btn.value">
        <el-button size="mini" @click="btnClick(btn)">
          <img :src="btn.icon" class="img-size" />
          <span>{{ btn.label }}</span>
        </el-button>
      </el-badge>
      <el-button v-else :key="btn.id" size="mini" @click="btnClick(btn)">
        <img :src="btn.icon" class="img-size" />
        <span>{{ btn.label }}</span>
      </el-button>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    btnList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    btnClick(btn) {
      this.$emit(btn.event, btn);
    },
  },
};
</script>
<style lang="scss" scoped>
.fun-btn {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  ::v-deep .el-button {
    margin-left: 12px;
    color: $color-primary;
    box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
    .img-size {
      vertical-align: middle;
      width: 14px;
    }
  }
}
</style>
