export default [
  {
    path: '/visual',
    title: 'FJGK',
    isShow: true,
    meta: {
      keepAlive: true,
    },
    component: () => import('@/pages/visual/index.vue'),
  },
  {
    path: '/wwpj',
    title: 'WWPJ',
    isShow: true,
    meta: {
      keepAlive: true,
    },
    component: () => import('@/pages/wwpj/index.vue'),
  },
  {
    path: '/workOrderHangUp',
    name: 'workOrderHangUp',
    title: 'GDGQQL',
    isShow: true,
    meta: {
      keepAlive: true,
    },
    component: () => import('@/pages/workOrderHangUp/index.vue'),
  },
  {
    path: '/nullAuth',
    name: 'nullAuth',
    title: '暂无权限',
    isShow: true,
    component: () => import('@/pages/noPermission.vue'),
  },
];
