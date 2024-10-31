import type { Menu as MenuType } from '/@/router/types';
import type { MenuState } from './types';

import { computed, Ref, toRaw } from 'vue';

import { unref } from 'vue';
import { uniq } from 'lodash-es';
import { getAllParentPath, getAllPath } from '/@/router/helper/menuHelper';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';
import { useDebounceFn } from '@vueuse/core';

export function useOpenKeys(
  menuState: MenuState,
  menus: Ref<MenuType[]>,
  accordion: Ref<boolean>,
  mixSider: Ref<boolean>,
  collapse: Ref<boolean>,
) {
  const { getExpandedAll } = useMenuSetting();
  const debounceSetOpenKeys = useDebounceFn(setOpenKeys, 50);
  const menuList = toRaw(menus.value);
  async function setOpenKeys(path: string) {
    const native = !mixSider.value;

    useTimeoutFn(
      () => {
        if (menuList?.length === 0) {
          menuState.activeSubMenuNames = [];
          menuState.openNames = [];
          return;
        }
        const keys = getAllParentPath(menuList, path);

        if (!unref(accordion)) {
          menuState.openNames = uniq([...menuState.openNames, ...keys]);
        } else {
          menuState.openNames = keys;
        }
        menuState.activeSubMenuNames = menuState.openNames;
      },
      30,
      native,
    );
  }

  const getOpenKeys = computed(() => {
    return unref(collapse)
      ? []
      : unref(getExpandedAll)
      ? getAllPath(menuList)
      : menuState.openNames;
  });

  return { setOpenKeys: debounceSetOpenKeys, getOpenKeys };
}
