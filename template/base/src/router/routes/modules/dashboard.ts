import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  id: '1',
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/index',
  meta: {
    orderNo: 1,
    icon: 'material-symbols:home',
    title: '首页',
    hideChildrenInMenu: true,
  },
  children: [
    {
      id: '1-1',
      path: 'index',
      name: 'DashboardIndex',
      component: () => import('/@/modules/dashboard/index.vue'),
      meta: {
        // affix: true,
        hideMenu: true,
        title: '首页',
      },
    },
  ],
};

export default dashboard;
