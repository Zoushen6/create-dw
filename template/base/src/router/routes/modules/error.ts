import type { AppRouteModule } from '/@/router/types';
import { ExceptionEnum } from '/@/enums/exceptionEnum';
import { LAYOUT } from '/@/router/constant';
const ExceptionPage = () => import('/@/views/sys/exception/Exception.vue');

const dashboard: AppRouteModule = {
  id: '404',
  path: '/error',
  name: 'Error',
  component: LAYOUT,
  redirect: '/error/404',
  meta: {
    // orderNo: 10,
    hideMenu: true,
    icon: 'ph:user-circle-fill',
    title: 'error',
    hideChildrenInMenu: true,
    ignoreAuth: true,
    hideBreadcrumb: true,
    hideTab: true,
    ignoreRoute: true,
  },
  children: [
    {
      path: '404',
      name: 'ErrorPageNotFound',
      component: ExceptionPage,
      props: {
        status: ExceptionEnum.PAGE_NOT_FOUND,
      },
      meta: {
        title: '404',
      },
    },
  ],
};
export default dashboard;
