import { createRouter, createWebHashHistory } from 'vue-router'
import { pinia } from '@/stores/index';
import { useMenuStore } from '@/stores/menu'
const menuStore = useMenuStore(pinia)
const { setMenuList } = menuStore
const isDev = import.meta.env.MODE === 'development'
const routes = await import('./routes.js').then((module) => module.default);

// 开发环境扁平化路由
const flattenRoutes = (routes, result = []) => {
  routes.forEach((route) => {
    if (!route?.children || route?.children?.length === 0) {
      route?.path && result.push(route);
    }
    if (route?.children?.length) {
      flattenRoutes(route.children, result);
    }
  });
  return result;
};
const flattenDevRoutes = flattenRoutes(routes);
const router = createRouter({
  history: createWebHashHistory(),
  routes: flattenDevRoutes,
})
setMenuList(isDev ? routes : flattenDevRoutes)
export default router
