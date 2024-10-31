// import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { h } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import type { UserInfo } from '/#/store';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { RoleEnum } from '/@/enums/roleEnum';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
// import { doLogout } from '/@/api/sys/user';
import Api from '/@/modules/api';
import { router } from '/@/router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { store } from '/@/store';
import { usePermissionStore } from '/@/store/modules/permission';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { isArray } from '/@/utils/is';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  isShowWatermark?: boolean;
  lastUpdateTime: number;
  regularStr: Array<any>;
  roleTree: Array<any>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    isShowWatermark: false,
    // 密码正则
    regularStr: [],
    roleList: [],
    roleTree: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getRoleTree(): any {
      return this.roleTree ? this.roleTree : window.localStorage.getItem('role_tree_data');
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setWatermark(isShow) {
      this.isShowWatermark = isShow ? isShow : false;
    },
    setRegularStr(str) {
      this.regularStr = str;
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    setRoleTree(arr = []) {
      this.roleTree = arr;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, ...loginParams } = params;
        const data = await Api.login({ data: { ...loginParams } });
        const { token } = data;

        // save token
        this.setToken(token);
        localStorage.setItem('DW_TOKEN', token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo: any = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await Api.getUserInfo();
      const treeData = await Api.getRoleTree();
      const arr: any = [];
      treeData.forEach((item) => {
        arr.push({
          label: item.name,
          relatedCheckValue: [],
          value: item.key,
          description: item.description,
          id: item.id,
          children: item.children.map((i) => {
            return {
              label: i.name,
              value: i.key,
              id: i.id,
              description: i.description,
            };
          }),
        });
      });
      this.setRoleTree(arr);
      window.localStorage.setItem('role_tree_data', arr);
      // const { roles = [] } = userInfo;
      const roles = userInfo.permissions.map((i) => i.authority);
      if (isArray(roles)) {
        const roleList = roles.map((item) => item) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await Api.layoutApi();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
