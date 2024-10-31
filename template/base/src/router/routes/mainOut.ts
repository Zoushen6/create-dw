/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '/@/router/types';

// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  // {
  //   path: '/main-out',
  //   name: 'MainOut',
  //   component: () => import('/@/views/demo/main-out/index.vue'),
  //   meta: {
  //     title: 'MainOut',
  //     ignoreAuth: true,
  //   },
  // },
  // {
  //   path: '/gis-analysis',
  //   name: 'GisAnalysis',
  //   component: () => import('/@/modules/dataAnalysis/index.vue'),
  //   meta: {
  //     title: 'gis-analysis',
  //     ignoreAuth: true,
  //   },
  // },
  // {
  //   path: '/map-ignore',
  //   name: 'MapIgnore',
  //   component: () => import('/@/modules/mapIgnore/index.vue'),
  //   meta: {
  //     title: 'MapIgnore',
  //     affix: false,
  //   },
  // },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
