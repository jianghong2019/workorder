export default [
  {
    title: 'FJGK',
    isShow: true,
  },
  {
    title: 'WWPJ',
    isShow: true,
    children: [
    ],
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
