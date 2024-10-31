import { RoleEnum } from '/@/enums/roleEnum';
import { getParentLayout, LAYOUT } from '/@/router/constant';
import type { AppRouteModule } from '/@/router/types';
// import { t } from '/@/hooks/web/useI18n';
// const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

// import { getToken } from '/@/utils/auth';
const settingDemo: AppRouteModule = {
  id: '4',
  path: '/setting',
  name: 'SettingDemo',
  component: LAYOUT,
  // redirect: '/setting/basic/info',
  redirect: '/setting/feat/role',
  meta: {
    orderNo: 6,
    icon: 'ri:settings-3-fill',
    // roles: [RoleEnum.ROLE_VIEW, RoleEnum.ORGAN_VIEW, RoleEnum.LOG_VIEWS, RoleEnum.DEVOPS_SETTING],
    // roles: [RoleEnum.ADMIN],
    title: '设置',
  },
  children: [
    {
      id: '4-0',
      path: 'basic',
      name: 'Basic',
      component: getParentLayout('Basic'),
      meta: {
        icon: 'material-symbols:settings-slow-motion-rounded',
        title: '基础设置',
        roles: [RoleEnum.DEVOPS_SETTING],
      },
      redirect: '/setting/feat/role',
      children: [
        {
          id: '4-0-1',
          path: 'configuration',
          name: 'Configuration',
          component: () => import('/@/modules/setting/basic/Configuration/index.vue'),
          meta: {
            title: '系统配置',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
        {
          id: '4-0-2',
          path: 'calendar',
          name: 'Calendar',
          component: () => import('/@/modules/setting/basic/calendar/index.vue'),
          meta: {
            title: '日历管理',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
      ],
    },
    {
      id: '4-1',
      path: 'feat',
      name: 'Feat',
      component: getParentLayout('Feat'),
      meta: {
        icon: 'material-symbols:construction',
        title: '组织架构',
        roles: [RoleEnum.ROLE_VIEW, RoleEnum.ORGAN_VIEW],
      },
      redirect: '/setting/feat/role',
      children: [
        {
          id: '4-1-1',
          path: 'basicInfo',
          name: 'BasicInfo',
          component: () => import('/@/modules/setting/feat/basicInfo/index.vue'),
          meta: {
            roles: [RoleEnum.ROLE_VIEW],
            hideMenu: true,
            title: '基本设置',
          },
        },
        {
          id: '4-1-2',
          path: 'role',
          name: 'roleDemo',
          component: () => import('/@/modules/setting/feat/role/index.vue'),
          meta: {
            title: '角色权限',
            roles: [RoleEnum.ROLE_VIEW],
          },
        },

        {
          id: '4-1-3',
          path: 'add-role',
          name: 'AddRole',
          component: () => import('/@/modules/setting/feat/addRole/index.vue'),
          meta: {
            hideMenu: true,
            roles: [RoleEnum.ROLE_VIEW],
            // roles: [RoleEnum.ADMIN],
            ignoreKeepAlive: true,
            hideTab: true,
            title: '新增角色',
          },
        },

        {
          id: '4-1-4',
          path: 'organ',
          name: 'OrganView',
          component: () => import('/@/modules/setting/feat/organ/index.vue'),
          meta: {
            title: '组织管理',
            roles: [RoleEnum.ORGAN_VIEW],
          },
        },
      ],
    },
    {
      id: '4-2',
      path: 'secure',
      name: 'Secure',
      // component: () => import('/@/modules/setting/security/index.vue'),
      component: getParentLayout('Secure'),
      redirect: '/setting/secure/config',
      meta: {
        icon: 'ic:outline-security',
        title: '安全告警',
        roles: [RoleEnum.SECURITY_VIEW],
      },
      children: [
        {
          id: '4-2-1',
          path: 'config',
          name: 'Config',
          component: () => import('/@/modules/setting/security/set/index.vue'),
          meta: {
            roles: [RoleEnum.SECURITY_VIEW],
            title: '安全设置',
          },
        },
        {
          id: '4-2-2',
          path: 'aMap',
          name: 'AMap',
          meta: {
            title: '地图尝试',
            roles: [RoleEnum.SECURITY_VIEW],
            hideTab: true,
            hideMenu: true,
          },
          component: () => import('/@/modules/setting/security/map/Gaode.vue'),
        },
      ],
    },
    {
      id: '4-3',
      path: 'log',
      name: 'Log',
      // component: () => import('/@/modules/setting/log/index.vue'),
      component: getParentLayout('Log'),
      redirect: '/setting/log/operate',

      meta: {
        icon: 'carbon:cloud-logging',
        roles: [RoleEnum.LOG_VIEWS],
        title: '日志记录',
      },
      children: [
        {
          id: '4-3-1',
          path: 'login',
          name: 'LoginLog',
          component: () => import('/@/modules/setting/log/loginLog/index.vue'),
          meta: {
            roles: [RoleEnum.LOG_VIEWS],
            title: '登录日志',
          },
        },
        {
          id: '4-3-2',
          path: 'operate',
          name: 'Operate',
          component: () => import('/@/modules/setting/log/operation/index.vue'),
          meta: {
            roles: [RoleEnum.LOG_VIEWS],
            title: '操作日志',
          },
        },
      ],
    },

    {
      id: '4-4',
      path: 'system',
      name: 'SystemSet',
      meta: {
        icon: 'carbon:cloud-service-management',
        title: '运维管理',
        roles: [RoleEnum.DEVOPS_SETTING],
      },
      children: [
        {
          id: '4-4-1',
          path: 'user',
          name: 'OnlineUser',
          component: () => import('/@/modules/setting/system/online/index.vue'),
          meta: {
            roles: [RoleEnum.DEVOPS_SETTING],
            title: '在线用户',
          },
        },
        {
          id: '4-4-2',
          path: 'set',
          name: 'Set',
          component: () => import('/@/modules/setting/system/setSetting/index.vue'),
          meta: {
            title: '配置管理',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
        {
          id: '4-4-3',
          path: 'file',
          name: 'FileSet',
          component: () => import('/@/modules/setting/system/fileSet/index.vue'),
          meta: {
            title: '文件管理',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
        {
          id: '4-4-4',
          path: 'task',
          name: 'TaskSet',
          component: () => import('/@/modules/setting/system/taskSet/index.vue'),
          meta: {
            title: '定时任务',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
        {
          id: '4-4-5',
          path: 'msgManagement',
          name: 'MsgManagement',
          component: () => import('/@/modules/setting/system/MessageManagement/index.vue'),
          meta: {
            title: '消息管理',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
        {
          id: '4-4-6',
          path: 'logRecord',
          name: 'LogRecord',
          component: () => import('/@/modules/setting/system/logRecord/index.vue'),
          meta: {
            title: '日志记录',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },

        {
          id: '4-4-7',
          path: 'permissions',
          name: 'Permissions',
          component: () => import('/@/modules/setting/system/permissions/index.vue'),
          meta: {
            title: '权限管理',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
        {
          id: '4-4-8',
          path: 'lessee',
          name: 'Lessee',
          component: () => import('/@/modules/setting/system/lessee/index.vue'),
          meta: {
            title: '租户管理',
            roles: [RoleEnum.DEVOPS_SETTING],
          },
        },
        {
          id: '4-4-9',
          path: 'del_user',
          name: 'DeleteUser',
          component: () => import('/@/modules/setting/system/delUesrList/index.vue'),
          meta: {
            roles: [RoleEnum.DEVOPS_SETTING],
            title: '已删除用户',
          },
        },
      ],
    },
  ],
};

export default settingDemo;
