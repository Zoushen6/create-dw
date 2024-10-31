import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  id: '6',
  path: '/userSet',
  name: 'UserSet',
  component: LAYOUT,
  redirect: '/userSet/index',
  meta: {
    // orderNo: 10,
    icon: 'ph:user-circle-fill',
    title: '用户',
    hideMenu: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      id: '6-1',
      path: 'index',
      name: 'userSetIndex',
      component: () => import('/@/modules/userSetting/index.vue'),
      meta: {
        // affix: true,
        hideMenu: true,
        title: '个人中心',
      },
    },
  ],
};

export default dashboard;
