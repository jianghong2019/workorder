<template>
  <div id="mainPage">
    <el-tabs
      v-model="$store.state.tabs.activeIndex"
      type="card"
      closable
      @tab-click="tabClick"
      @tab-remove="removeTab"
    >
      <!-- tab标签首页图标 -->
      <el-tab-pane>
        <template v-slot:label>
          <span>
            <i class="iconfont icon-shouye" style="width: 12px; height: 12px; color: #c5c9c8"></i>
          </span>
        </template>
      </el-tab-pane>

      <el-tab-pane
        v-for="(item, index) in $store.state.tabs.editableTabs"
        :key="item.route"
        :label="item.name"
        :name="item.route"
      >
        <component :is="item.component" :ref="item.url" v-bind="item.params"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    //切换选项卡
    tabClick(tab) {
      this.$router.push({ path: this.$store.state.tabs.activeIndex })
    },
    //删除选项卡
    removeTab(targetName) {
      if (targetName == '/') {
        return
      }

      var activeIndex = this.$store.state.tabs.activeIndex
      var editableTabs = this.$store.state.tabs.editableTabs
      var hasRoute = this.$store.state.tabs.hasRoute

      this.$store.commit('deleteTab', targetName)
      if (activeIndex === targetName) {
        if (editableTabs && editableTabs.length >= 1) {
          this.$store.commit('setActiveTab', editableTabs[editableTabs.length - 1].route)
          if (hasRoute) {
            this.$router.push({ path: activeIndex })
          }
        } else {
          this.$router.push({ path: '/' })
        }
      }
    },
  },
}
</script>
<style>
/* 首页图标叉叉去掉 */
/* #tab-0 .el-icon-close{
  display: none;
}

#mainPage > .el-tabs > .el-tabs__header {
  height: auto;
  background: #fff;
  border-radius: 4px;
}
.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}
.el-tabs--card > .el-tabs__header .el-tabs__item {
  border-color: #dddddd;
  border-bottom: none;
  position: relative;
}
.el-tabs__item {
  height: 30px;
  line-height: 30px;
  color: #666;
  font-weight: 400;
}

.el-tabs__nav-next,
.el-tabs__nav-prev {
  line-height: 30px;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
  padding-left: 20px;
  padding-right: 20px;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-closable iconfont icon-shouye:hover {
  padding-left: 0px;
  padding-right: 0px;
}
.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
.el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
  transform-origin: 0 0;
  position: absolute;
  right: 3px;
  top: 7.5px;
  transition: none;
} */
</style>
