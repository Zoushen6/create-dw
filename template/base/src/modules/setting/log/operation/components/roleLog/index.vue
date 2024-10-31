<template>
  <BasicTable style="width: 100%" @register="registerTable" :searchInfo="searchInfo">
    <template #operator="{ record }">
      {{ record.operator ? record.operator.name : '' }}
    </template>
    <template #toolbar>
      <a-button @click="exportPageData" :disabled="!hasPermission(['log:export'])">导出</a-button>
    </template>
  </BasicTable>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import Api from '../../../api';
  import { filterIndex, exportDataFunction } from '/@/utils/public';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const page = ref({
    page: 1,
    size: 10,
  });
  const props = defineProps({
    typeVal: {
      type: String,
      default: () => '',
    },
  });
  const taskColumns = [
    filterIndex(page.value),
    {
      title: '姓名',
      dataIndex: 'operator',
      key: 'operator',
      width: 200,
      slots: { customRender: 'operator' },
    },

    {
      title: '用户名',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
      customRender: ({ record }) => record.operator?.username,
    },
    {
      title: '操作地点',
      dataIndex: 'location',
      key: 'location',
      width: 200,
    },

    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 200,
    },
    {
      title: '日志内容',
      dataIndex: 'content',
      key: 'content',
      width: 180,
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 180,
    },
  ];
  const FormSchema: any = [
    {
      field: '[startTime, endTime]',
      component: 'RangePicker',
      label: '操作时间',
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
    return Api.getLogPage({ params: { ...params, category: props.typeVal } });
  }
  const searchInfo = reactive({});
  const [registerTable, { getForm }] = useTable({
    title: props.typeVal + '管理日志',
    api: getRoleList,
    columns: taskColumns,
    rowKey: (record) => record.id,
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return t;
    },
    useSearchForm: true,
    showTableSetting: false,
    formConfig: {
      labelWidth: 120,
      schemas: FormSchema,
      autoSubmitOnEnter: true,
    },
    handleSearchInfoFn(info) {
      return info;
    },
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
  });
  const exportPageData = () => {
    getForm().getFieldsValue();
    Api.operate_logs_export({ params: { ...getForm().getFieldsValue(), category: '角色' } }).then(
      (res) => {
        exportDataFunction(res, '角色管理日志导出列表.xlsx');
      },
    );
  };
  // watch(
  //   () => props.typeVal,
  //   (val) => {
  //     setProps({
  //       title: val + '管理日志',
  //     });
  //     reload();
  //   },
  //   {},
  // );
</script>
