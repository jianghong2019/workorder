<script setup>
const route = useRoute()
const router = useRouter()
// import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/menu'
const menuStore = useMenuStore()
const { menuList } = storeToRefs(menuStore)

// 控制菜单折叠状态
const isCollapse = ref(false)

watch(
  () => menuStore.menuList,
  (newVal) => {
    console.log('menuList changed:', newVal)
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div>
    <el-menu
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="true"
      :default-active="route.path"
      router
      background-color="#158e7d"
      active-text-color="#FFFFFF"
      text-color="#FFFFFF"
    >
      <template v-for="(item, index) in menuList">
        <el-sub-menu
          :key="index"
          v-if="item.children && item.children.length > 0"
          :index="`submenu_${index}`"
        >
          <template v-slot:title>
            <i class="el-icon-folder" style="font-size: 16px; color: #fff"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(itemChild1, index2) in item.children"
            v-show="itemChild1.isShow"
            :key="`submenu_${index}_menuitem_${index2}`"
            :index="itemChild1.path || `menuitem_${index}_${index2}`"
          >
            <template v-slot:title>
              <span>{{ itemChild1.title }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item
          v-else
          :key="`menuitem_${index}`"
          :index="item.path || `menuitem_${index}`"
          v-show="item.isShow"
        >
          <template v-slot:title>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style></style>
