import type { Menu } from '/@/router/types';
import { getMenus } from '/@/router/menus/index';
import Api from '/@/modules/api';
interface tableItem {
  name: string;
  path: string;
  icon?: string;
  openMode?: string;
  sort?: string;
  id?: string;
  parentId?: string;
  route?: string;
}

//将menu 转为左侧树结构
function transformMenuTotree(menus: Menu[]) {
  const treeList = menus
    .filter((item) => (item.hideBreadcrumb ? !item.hideBreadcrumb : !item.hideMenu))
    .map((node) => {
      return {
        title: node.name,
        key: node.id,
        meat: node.meta,
        children: node.children ? transformMenuTotree(node.children) : [],
      };
    });
  return treeList;
}

export async function getTreeList() {
  const menuList = await getMenus();

  return transformMenuTotree(menuList);
}
//将menu 转为右侧table 结构
export function transformMenuToTable(menus: any[]) {
  const tableData: tableItem[] = [];
  const getTableform = (menus: any[]) => {
    const menuList = menus.filter((item) =>
      item.hideBreadcrumb ? !item.hideBreadcrumb : !item.hideMenu,
    );
    for (const t of menuList) {
      const index = t.id.lastIndexOf('-');
      if (t?.children?.length) {
        getTableform(t.children);
      }
      tableData.push({
        id: t.id,
        name: t.name,
        openMode: 'INLINE',
        sort: t.orderNo,
        path: t.path,
        route: t.path,
        icon: t.icon,
        parentId: index == -1 ? null : t.id.slice(0, index),
      });
    }
  };
  getTableform(menus);
  return tableData;
}

//前端更新路由节点 --修改路由名称及图标
export function updateRouteNode(id, row, routeList: any) {
  routeList.find((item) => {
    if (item.id === id) {
      item.name = row.name;
      item.icon = row.icon;
    }
    if (item?.children) updateRouteNode(id, row, item.children);
  });

  return routeList;
}

export async function getOnlineList() {
  return await Api.getOnlineList();
}
//处理category为PAGE时 path 转为/amis.html?key=path格式
export function transformPath2Amis(val) {
  const v = Object.assign({}, val);
  const { path, category } = v;
  const pathType = category === 'PAGE'; //页面选中
  const toAmis = (p: string) => {
    //编辑
    if (pathType && p.includes('/amis.html?key=')) {
      return p.split('=')[1];
    }
    //新建
    return `/amis.html?key=${p}`;
  };
  const amisPath = pathType ? toAmis(path) : path;

  return { ...v, path: amisPath };
}
