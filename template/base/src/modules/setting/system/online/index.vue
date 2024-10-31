<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '强退',
              icon: 'ic:outline-delete-outline',
              color: 'error',
              disabled: !hasPermission(['devops:setting']),
              popConfirm: {
                title: '是否确认强退该用户',
                placement: 'left',
                confirm: listHandle.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Api from '../../api';
  import { ref } from 'vue';
  import { filterIndex } from '/@/utils/public';
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
    // {
    //   title: '部门名称',
    //   dataIndex: 'name',
    //   key: 'name',
    //   width: 200,
    // },
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
      width: 200,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
      width: 200,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
      width: 200,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 200,
    },
  ];
  const FormSchema: any = [
    {
      field: 'name',
      label: '用户名称',
      component: 'Input',
      colProps: { xl: 6 },
    },
  ];
  function getOrgan(params) {
    return Api.getOnlineList({ params });
  }
  const { createMessage } = useMessage();
  const [registerTable, { reload }] = useTable({
    title: '在线用户列表',
    api: getOrgan,
    columns: taskColumns,
    useSearchForm: true,
    showTableSetting: false,
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return t;
    },
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
    rowKey: 'id',
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const listHandle = (record) => {
    Api.onlineUserKick({ data: { userId: record.id } }).then(() => {
      createMessage.success('操作成功');
      reload();
    });
  };
</script>

<style lang="less" scoped>
  ::v-deep.vben-basic-table-form-container {
    padding: 0 !important;
  }
</style>
