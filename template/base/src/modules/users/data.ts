import { FormSchema } from '/@/components/Table';
import { useUserStore } from '/@/store/modules/user';
import Api from '/@/modules/api/index';
import { usePermission } from '/@/hooks/web/usePermission';
// function getOrganLabelListFun(params) {
//   return Api.getOrganLabel(params);
// }
function getRulesListFun(params) {
  return Api.getRulesList({ params });
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键字',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '用户名、姓名、邮箱、手机号',
    },
  },
  {
    label: '角色',
    colProps: {
      span: 6,
    },
    field: 'roleId',
    component: 'ApiSelect',
    // required: true,
    componentProps: {
      api: getRulesListFun,
      getPopupContainer: () => document.body,

      resultField: 'content',
      labelField: 'name',
      valueField: 'id',
      immediate: false,
      placeholder: '请选择角色',
    },
  },
  {
    field: 'enabled',
    label: '是否启用',
    component: 'Select',
    colProps: { xl: 6 },
    componentProps: {
      options: [
        {
          label: '启用',
          value: 'true',
          key: '1',
        },
        {
          label: '禁用',
          value: 'false',
          key: '2',
        },
      ],
    },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: {
      span: 12,
    },
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
  },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    colProps: {
      span: 12,
    },
    // rules: [
    //   {
    //     required: true,
    //     message: '请输入姓名',
    //   },
    // ],
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    colProps: {
      span: 12,
    },
    rules: [
      // {
      //   required: true,
      //   message: '请输入用户邮箱',
      // },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' },
    ],
  },
  {
    label: '手机',
    field: 'mobile',
    component: 'Input',
    // required: true,
    colProps: {
      span: 12,
    },
    rules: [
      {
        required: false,
        message: '请输入用户手机号',
      },
      // { type: '', message: '手机号格式不正确请重新输入', trigger: 'change' },
      {
        validator: async (_, value) => {
          if (!value) {
            return Promise.resolve();
          } else {
            const role = /^((1[3,4,5,6,8,7,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
            const regular = new RegExp(role);

            if (regular.test(value)) {
              return Promise.resolve();
            } else {
              return Promise.reject('手机号格式不正确');
            }
          }
        },
      },
    ],
  },

  {
    label: '密码',
    field: 'password',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '请输入密码',
      // onScoreChange: (val) => {
      //   intensity = val;
      // },
    },
    colProps: {
      span: 12,
    },
    rules: [
      {
        // required: true,
        validator: async (_, value) => {
          const userStore = useUserStore();
          const arr = userStore.regularStr;
          if (!value) {
            // 必填转换return内容
            return Promise.resolve();
          } else {
            let a: any = [];
            // 获取校验不成功的项
            a = arr.filter((i) => {
              return !i.str.test(value);
            });
            // 如果没有就抛出成功
            if (a.length == 0) {
              return Promise.resolve();
            }
            // 如果有就抛出首项
            // ❗❗❗校验慢一步
            for (let i = 0; i < a.length; i++) {
              return Promise.reject(a[i].warning);
            }
          }
        },
      },
    ],
  },
  {
    field: 'position',
    label: '职位',
    component: 'Input',
    colProps: {
      span: 12,
    },
    required: false,
  },

  {
    label: '角色',
    colProps: {
      span: 12,
    },
    field: 'roleIds',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: getRulesListFun,
      getPopupContainer: () => document.body,
      mode: 'multiple',
      resultField: 'content',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
      placeholder: '请选择角色',
    },
  },
  {
    label: '组织',
    colProps: {
      span: 12,
    },
    // helpMessage: ['用户可查看触点数据'],
    field: 'organIds',
    // rules: [
    //   {
    //     required: true,
    //     message: '请选择机构',
    //   },
    // ],
    component: 'Select',
    slot: 'organTree',
    // componentProps: {
    //   api: getOrganLabelListFun,
    //   getPopupContainer: () => document.body,

    //   resultField: 'content',
    //   labelField: 'name',
    //   valueField: 'id',
    //   immediate: false,
    //   placeholder: '用户所属机构',
    // },
    // required: false,
  },
  {
    field: 'enabled',
    component: 'Switch',
    label: '启用',
    colProps: {
      span: 12,
    },
    componentProps: {
      defaultValue: true,
    },
    required: false,
  },
];

export const BulkUserForm: FormSchema[] = [
  {
    label: '角色',
    colProps: {
      span: 8,
    },
    field: 'roleIds',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: getRulesListFun,
      getPopupContainer: () => document.body,
      resultField: 'content',
      labelField: 'name',
      valueField: 'id',
      mode: 'multiple',
      immediate: true,
      placeholder: '请选择角色',
    },
    dynamicDisabled: () => {
      const { hasPermission } = usePermission();

      return !hasPermission(['user:change_role']);
    },
  },
  {
    label: '组织',
    colProps: {
      span: 8,
    },
    // helpMessage: ['用户可查看触点数据'],
    field: 'organIds',
    // rules: [
    //   {
    //     required: true,
    //     message: '请选择机构',
    //   },
    // ],
    slot: 'organTree',
    component: 'Select',
    // componentProps: {
    //   api: getOrganLabelListFun,
    //   getPopupContainer: () => document.body,

    //   resultField: 'content',
    //   labelField: 'name',
    //   valueField: 'id',
    //   immediate: true,
    //   placeholder: '用户所属机构',
    // },
    // required: false,
  },
];
