import { defineComponent, unref, computed } from 'vue';

import { BasicModal } from '/@/components/Modal/index';
import { Divider } from 'ant-design-vue';
import { TypePicker, ThemeColorPicker, SettingFooter, SwitchItem } from './components';

import { AppDarkModeToggle } from '/@/components/Application';
import { MenuTypeEnum } from '/@/enums/menuEnum';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
import { useI18n } from '/@/hooks/web/useI18n';

import { baseHandler } from './handler';

import { HandlerEnum, menuTypeList } from './enum';

import {
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from '/@/settings/designSetting';

const { t } = useI18n();

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const { getShowDarkModeToggle, getThemeColor, getShowBreadCrumb } = useRootSetting();

    const { getIsHorizontal, getMenuType, getMenuBgColor, getShowMenu, getExpandedAll, getSplit } =
      useMenuSetting();

    const { getHeaderBgColor, getShowHeader } = useHeaderSetting();

    const { getShowMultipleTab } = useMultipleTabSetting();

    function renderSidebar() {
      return (
        <>
          <TypePicker
            menuTypeList={menuTypeList}
            handler={(item: (typeof menuTypeList)[0]) => {
              baseHandler(HandlerEnum.CHANGE_LAYOUT, {
                mode: item.mode,
                type: item.type,
                split: unref(getIsHorizontal) ? false : undefined,
              });
            }}
            def={unref(getMenuType)}
          />
        </>
      );
    }
    const getShowMenuRef = computed(() => {
      return unref(getShowMenu) && !unref(getIsHorizontal);
    });
    function renderHeaderTheme() {
      return (
        <ThemeColorPicker
          colorList={HEADER_PRESET_BG_COLOR_LIST}
          def={unref(getHeaderBgColor)}
          event={HandlerEnum.HEADER_THEME}
        />
      );
    }

    function renderSiderTheme() {
      return (
        <ThemeColorPicker
          colorList={SIDE_BAR_BG_COLOR_LIST}
          def={unref(getMenuBgColor)}
          event={HandlerEnum.MENU_THEME}
        />
      );
    }

    function renderMainTheme() {
      return (
        <ThemeColorPicker
          colorList={APP_PRESET_COLOR_LIST}
          def={unref(getThemeColor)}
          event={HandlerEnum.CHANGE_THEME_COLOR}
        />
      );
    }

    function renderContent() {
      return (
        <>
          <SwitchItem
            title={t('layout.setting.breadcrumb')}
            event={HandlerEnum.SHOW_BREADCRUMB}
            def={unref(getShowBreadCrumb)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            title={t('layout.setting.tabs')}
            event={HandlerEnum.TABS_SHOW}
            def={unref(getShowMultipleTab)}
          />

          <SwitchItem
            title={t('layout.setting.expandAllMenu')}
            event={HandlerEnum.MENU_EXPANDED_ALL}
            def={unref(getExpandedAll)}
            disabled={unref(getIsHorizontal)}
          />
          <SwitchItem
            title={t('layout.setting.splitMenu')}
            event={HandlerEnum.MENU_SPLIT}
            def={unref(getSplit)}
            disabled={!unref(getShowMenuRef) || unref(getMenuType) !== MenuTypeEnum.MIX}
          />
        </>
      );
    }

    return () => (
      <BasicModal
        {...attrs}
        title="个人主题配置"
        cancelText="关闭"
        showOkBtn={false}
        width={350}
        class="setting-drawer"
      >
        {unref(getShowDarkModeToggle) && <Divider>{() => t('layout.setting.darkMode')}</Divider>}
        {unref(getShowDarkModeToggle) && <AppDarkModeToggle class="mx-auto" />}
        <Divider>{() => t('layout.setting.navMode')}</Divider>
        {renderSidebar()}
        <Divider>{() => t('layout.setting.sysTheme')}</Divider>
        {renderMainTheme()}
        <Divider>{() => t('layout.setting.headerTheme')}</Divider>
        {renderHeaderTheme()}
        <Divider>{() => t('layout.setting.sidebarTheme')}</Divider>
        {renderSiderTheme()}

        <Divider>{() => t('layout.setting.interfaceDisplay')}</Divider>
        {renderContent()}
        <Divider />
        <SettingFooter />
      </BasicModal>
    );
  },
});
