import { FormSchema } from '/@/components/Table';
const isType = (type) => type === 'PATH';
export const ModalSchema: FormSchema[] = [
  {
    field: 'parentId',
    label: '父级目录',
    component: 'Select',
    required: false,
    colProps: {
      span: 18,
    },
    slot: 'levelTree',
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 18,
    },
  },
  {
    field: 'route',
    label: '路由',
    component: 'Input',
    required: true,
    colProps: {
      span: 18,
    },
  },
  {
    field: 'category',
    label: '类型',
    component: 'RadioButtonGroup',
    required: true,
    colProps: {
      span: 18,
    },
    defaultValue: 'PATH',
    componentProps: ({}) => {
      return {
        options: [
          {
            label: '路径',
            value: 'PATH',
            key: 0,
          },
          {
            label: '页面',
            value: 'PAGE',
            key: 1,
          },
        ],
        onChange: () => {
          // formModel.path = '';
          // console.log(formModel);
        },
      };
    },
  },
  {
    field: 'path',
    label: '路径',
    component: 'Input',
    required: true,
    colProps: {
      span: 18,
    },
    ifShow: ({ values }) => {
      return isType(values.category);
    },
  },
  {
    field: 'permission',
    label: '权限',
    component: 'Select',
    required: false,
    colProps: {
      span: 18,
    },
    slot: 'permissionTree',
  },
  {
    field: 'path',
    label: '页面',
    component: 'Select',
    required: true,
    colProps: {
      span: 18,
    },
    slot: 'pageSelect',
    ifShow: ({ values }) => {
      return !isType(values.category);
    },
  },
  {
    field: 'openMode',
    label: '打开模式',
    component: 'Select',
    required: true,
    colProps: {
      span: 18,
    },
    // defaultValue: 'INLINE',
    componentProps: {
      options: [
        {
          label: '内嵌',
          value: 'INLINE',
          key: '1',
        },
        {
          label: '新开',
          value: 'NEW',
          key: '2',
        },
      ],
    },
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    required: false,
    colProps: {
      span: 18,
    },
  },

  {
    field: 'sort',
    label: '顺序',
    component: 'InputNumber',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'enabled',
    label: '启用',
    component: 'Switch',
    colProps: {
      span: 18,
    },
    defaultValue: true,
    componentProps: {},
  },
];
