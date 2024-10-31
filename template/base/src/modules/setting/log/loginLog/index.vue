<template>
  <BasicTable @register="registerTable" :searchInfo="searchInfo">
    <template #toolbar>
      <a-button @click="exportPageData" :disabled="!hasPermission(['log:export'])">导出</a-button>
    </template>
  </BasicTable>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import Api from '../api';
  import { filterIndex, exportDataFunction } from '/@/utils/public';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const page = ref({
    page: 1,
    size: 10,
  });
  const taskColumns = [
    filterIndex(page.value),

    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 200,
    },
    {
      title: '登录 IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 200,
    },
    {
      title: '登录地点',
      dataIndex: 'location',
      key: 'location',
      width: 180,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 180,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
      width: 180,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
      width: 180,
    },
    {
      title: '登录状态',
      dataIndex: 'loginStatus',
      key: 'loginStatus',
      width: 180,
    },
    {
      title: '操作信息',
      dataIndex: 'message',
      key: 'message',
      width: 180,
    },
  ];
  const FormSchema: any = [
    // {
    //   field: 'address',
    //   component: 'Input',
    //   label: '登录地址',
    //   colProps: {
    //     span: 8,
    //   },
    // },
    {
      field: 'username',
      component: 'Input',
      label: '用户名',
      colProps: {
        span: 6,
      },
    },
    // {
    //   field: 'status',
    //   label: '状态',
    //   component: 'Select',
    //   colProps: { xl: 8 },
    //   componentProps: {
    //     options: [
    //       {
    //         label: '成功',
    //         value: '1',
    //         key: '1',
    //       },
    //       {
    //         label: '失败',
    //         value: '2',
    //         key: '2',
    //       },
    //     ],
    //   },
    // },
    {
      field: '[startLoginTime, endLoginTime]',
      component: 'RangePicker',
      label: '登录时间',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        placeholder: ['开始日期', '结束日期'],
        getPopupContainer: () => document.body,
      },
      colProps: {
        span: 6,
      },
    },
  ];
  function getRoleList(params) {
    return Api.getLoginPage({ params });
  }

  const searchInfo = reactive({});
  const [registerTable, { getForm }] = useTable({
    title: '登录日志',
    api: getRoleList,
    columns: taskColumns,
    rowKey: (record) => record.id,
    useSearchForm: true,
    showTableSetting: false,
    formConfig: {
      labelWidth: 100,
      schemas: FormSchema,
      autoSubmitOnEnter: true,
    },
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return t;
    },
    handleSearchInfoFn(info) {
      return info;
    },
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
  });

  const exportPageData = () => {
    getForm().getFieldsValue();
    Api.login_logs_export({ params: getForm().getFieldsValue() }).then((res) => {
      exportDataFunction(res, '登录日志导出列表.xlsx');
    });
  };
</script>

<style lang="less" scoped>
  ::v-deep.vben-basic-table-form-container {
    padding: 0 !important;
  }
</style>
