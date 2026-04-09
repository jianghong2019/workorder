import { defineStore } from 'pinia'
export const useMenuStore = defineStore('menu', () => {
    const menuList = ref([{
        name: '首页',
        path: '/home',
        isShow: true,
        children: []
    }]);

    const setMenuList = (menus) => {
        menuList.value = menus;
        console.log(menuList.value);

    };

    return { menuList, setMenuList };
})
