<template>
  <div class="user_page">
    <div class="tree">
      <leftTreeVue :isAn="is_an" @treeHandel="treeHandel" @closeTree="is_an = true" />
      <div class="is_an" v-show="is_an" @click="handelSiderIcon">
        <Icon color="#fff" icon="ci:chevron-big-left" />
      </div>
    </div>
    <div class="right_table">
      <BasicTable @register="registerTable" :searchInfo="searchInfo" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { filterIndex } from '/@/utils/public';
  import { BasicTable, useTable } from '/@/components/Table';
  import leftTreeVue from '/@/modules/components/leftTree.vue';
  import Api from '/@/modules/users/api';
  import Icon from '/@/components/Icon';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import publicApi from '/@/modules/api/index';
  const page = ref({
    page: 1,
    size: 10,
  });
  const columns = [
    filterIndex(page.value),
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      // slots: { customRender: 'role' },
      customRender: ({ record }) => {
        return record.role ? record.role.name : '';
      },
    },
    {
      title: '组织',
      dataIndex: 'organ',
      width: 200,
      customRender: ({ record }) => {
        return record.organs ? record.organs.map((i) => i.abbrName).join(',') : '';
      },
    },
    // {
    //   title: '是否启用',
    //   dataIndex: 'enabled',
    //   width: 80,
    //   customRender: ({ text }) => {
    //     return text ? '启用' : '禁用';
    //   },
    // },
  ];
  const treeData = ref([]);
  const searchInfo = reactive<Recordable>({});
  const { getThemeColor } = useRootSetting();
  const leftSearchData: any = ref({});
  const is_an = ref(true);
  const [registerTable, { reload }] = useTable({
    title: '用户列表',
    api: getAccountListFun,
    rowKey: 'id',
    columns: columns.map((i) => {
      return i;
    }),
    showIndexColumn: false,
    immediate: false,
    formConfig: {
      labelWidth: 70,
      schemas: [
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
          componentProps: {
            api: (params) => {
              return publicApi.getRulesList({ params });
            },
            getPopupContainer: () => document.body,

            resultField: 'content',
            labelField: 'name',
            valueField: 'id',
            immediate: false,
            placeholder: '请选择角色',
          },
        },
      ],
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,

    showTableSetting: false,
    bordered: true,
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;

      return { ...t, ...leftSearchData.value };
    },
    handleSearchInfoFn(info) {
      return info;
    },
  });
  function getAccountListFun(params) {
    return Api.get_del_user({ params });
  }
  publicApi.getOrganTree().then((res) => {
    treeData.value = res;
  });
  // 左侧tree组件事件
  const treeHandel = (e) => {
    leftSearchData.value = e;
  };
  watch(
    () => leftSearchData.value,
    () => {
      reload();
    },
    {
      deep: true,
    },
  );

  const handelSiderIcon = () => {
    if (is_an.value) {
      is_an.value = false;
    }
  };
</script>
<style lang="less" scoped>
  ::v-deep .vben-basic-table-form-container {
    padding-top: 0px;
  }

  .tree {
    width: v-bind('is_an? "20%":"3%"');
    display: inline-block;
    transition-property: width;
    transition-duration: 0.3s;
    position: relative;
    // margin-right: 16px;
  }

  .tree:hover {
    .is_an {
      display: block;
    }
  }

  .right_table {
    width: v-bind('is_an? "80%":"97%"');
    transition-property: width;
    transition-duration: 0.3s;
  }

  .is_an {
    width: 15px;
    height: 50px;
    background-color: v-bind('getThemeColor');
    border-radius: 0 10px 10px 0;
    line-height: 50px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    position: absolute;
    float: right;
    top: 50%;
    transform: translateY(-50%);
    transform: translateX(20%);
    right: 0;
    display: none;
  }

  .user_page {
    display: flex;
  }
</style>
