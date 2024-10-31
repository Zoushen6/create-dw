import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  id: '5',
  path: '/user',
  name: 'User',
  component: LAYOUT,
  redirect: '/user/index',
  meta: {
    orderNo: 5,

    roles: [RoleEnum.USER_VIEW],
    icon: 'ph:user-circle-fill',
    title: '用户',
    hideChildrenInMenu: true,
  },
  children: [
    {
      id: '5-1',
      path: 'index',
      name: 'Index',
      component: () => import('/@/modules/users/index.vue'),
      meta: {
        // affix: true,
        roles: [RoleEnum.USER_VIEW],
        hideMenu: true,
        hideBreadcrumb: true,
        title: '用户',
      },
    },
  ],
};
export default dashboard;
