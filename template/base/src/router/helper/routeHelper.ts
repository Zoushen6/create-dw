import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';

import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '/@/utils/log';
import { useUserStore } from '/@/store/modules/user';
import { createRouter, createWebHashHistory } from 'vue-router';
import { isUrl } from '/@/utils/is';
export type LayoutMapKey = 'LAYOUT';
const IFRAME = () => import('/@/views/sys/iframe/FrameBlank.vue');
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// Dynamic introduction
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../views', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}

// Turn background objects into routing objects
// 将背景对象变成路由对象
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  routeList.forEach((route) => {
    const component = route.component as string;
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(component.toUpperCase());
      } else {
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    } else {
      warn('请正确配置路由：' + route?.name + '的component属性');
    }
    route.children && asyncImportRoute(route.children);
  });
  return routeList as unknown as T[];
}

/**
 * Convert multi-level routing to level 2 routing
 * 将多级路由转换为 2 级路由
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);

  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    // 判断级别是否 多级 路由
    if (!isMultipleRoute(routeModule)) {
      // 声明终止当前循环， 即跳过此次循环，进行下一轮
      continue;
    }
    // 路由等级提升
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
// 路由等级提升
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  // 使用vue-router拼接菜单
  // createRouter 创建一个可以被 Vue 应用程序使用的路由实例
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });
  // getRoutes： 获取所有 路由记录的完整列表。
  const routes = router.getRoutes();
  // 将所有子路由添加到二级路由
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  // omit lodash的函数 对传入的item对象的children进行删除
  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// Add all sub-routes to the secondary route
// 将所有子路由添加到二级路由
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule,
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
// 判断级别是否超过2级
function isMultipleRoute(routeModule: AppRouteModule) {
  // Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

//菜单管理新增编辑--创建新建路由自动生成下级菜单
export function createRouteNode(tableList: any, moduleRoutes: any) {
  // 菜单管理权限控制
  const userStore = useUserStore();
  const tableArr = tableList.filter((i) => {
    if (i.enabled === true) {
      if (!i.permission) {
        return true;
      }
      return userStore.getRoleList.includes(i.permission);
    }
  });

  for (let i = 0; i < tableArr.length; i++) {
    const child = tableArr[i];
    if (!child.parentId) {
      moduleRoutes.push(handleItemToRoute(child, moduleRoutes.length));
    }
    const findNode = (routeList) => {
      routeList.find((item) => {
        if (item.id === child.parentId) {
          item.children.push(handleItemToRoute(child, item.children.length + 1));
        }
        if (item?.children) findNode(item.children);
      });
    };
    findNode(moduleRoutes);
  }

  return moduleRoutes;
}

function handleItemToRoute(item, length) {
  const mainlayout = LayoutMap.get('LAYOUT');
  const iframe = LayoutMap.get('IFRAME');
  const { name, path, id, icon, sort, openMode, parentId, route } = item;
  if (openMode === 'NEW') {
    return {
      id: parentId ? `${parentId}-${length}` : `${length}`,
      name,
      title: name,
      path: `${route}`,
      component: mainlayout,
      redirect: `${route}/index`,
      meta: {
        icon,
        orderNo: sort,
        title: name,
      },
      children: [
        {
          id,
          path: isUrl(path) ? `${path}` : `${(window as any)._CONFIG['domianURL']}${path}`,
          name: `${name}Index`,
          component: iframe,
          meta: {
            title: `${name}`,
          },
        },
      ],
    };
  } else {
    return {
      id,
      name,
      title: name,
      path: `${route}`,
      component: mainlayout,
      redirect: `${route}/index`,
      meta: {
        icon,
        orderNo: sort,
        title: name,
        hideChildrenInMenu: true,
      },
      children: [
        {
          id,
          path: 'index',
          name: `${name}Index`,
          component: iframe,
          meta: {
            frameSrc: isUrl(path) ? `${path}` : `${(window as any)._CONFIG['domianURL']}${path}`,
            title: `${name}`,
            hideMenu: true,
          },
        },
      ],
    };
  }
}
