<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              icon: 'clarity:note-edit-line',
              disabled: !hasPermission(['organ:update']),
              onClick: editName.bind(null, record),
            },
            {
              label: '删除',
              icon: 'ic:outline-delete-outline',
              color: 'error',
              disabled: record.builtIn || !hasPermission(['organ:del']),
              popConfirm: {
                title: '是否确认删除该租户',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
          >设置</TableAction
        >
      </template>
      <template #toolbar>
        <a-button type="primary" @click="addOrgan" :disabled="!hasPermission(['organ:add'])"
          >新建</a-button
        >
      </template>
    </BasicTable>
    <NameEdit @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script setup lang="ts">
  import { ref, defineProps, watch, defineEmits } from 'vue';
  import NameEdit from './modules/editModel.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { filterIndex } from '/@/utils/public';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Api from '../../api';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();
  const searchId = ref('');
  const props = defineProps({
    treeId: String,
  });
  const emits = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const taskColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 120,
      customRender: ({ text }) => (text ? text.username : ''),
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
      customRender: ({ text }) => (text ? text.username : ''),
      width: 120,
    },
    {
      title: '租户唯一标识',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
    },
    {
      title: '数据库模式',
      dataIndex: 'tenantSchema',
      key: 'tenantSchema',
      width: 120,
    },

    {
      title: '启用',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      customRender: ({ text }) => (text ? '是' : '否'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 240,
    },
  ];
  const FormSchema: any = [
    {
      field: 'name',
      label: '组织名称',
      component: 'Input',
      colProps: { xl: 8 },
    },
  ];
  function getOrgan(params) {
    return Api.getLessee({ params });
  }
  const page = ref({
    page: 1,
    size: 10,
  });
  const [registerTable, { updateTableDataRecord, reload }] = useTable({
    title: '租户列表',
    api: getOrgan,
    columns: [filterIndex(page.value), ...taskColumns],
    useSearchForm: false,
    showTableSetting: false,
    formConfig: {
      labelWidth: 120,
      schemas: FormSchema,
      autoSubmitOnEnter: true,
    },
    handleSearchInfoFn(info) {
      return info;
    },
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return { ...t, parentId: searchId.value };
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
  watch(
    () => props.treeId,
    (val) => {
      if (val) {
        if (!val) {
          return;
        }
        searchId.value = val;
        reload();
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );
  // 删除机构
  const handleDelete = (record) => {
    console.log(record);

    Api.deleteLessee({ pathVars: { id: record.id } }).then(() => {
      emits('reload');
      reload();
      createMessage.success('删除租户成功');
    });
  };

  // 新建机构
  const addOrgan = () => {
    openModal(true, {
      isUpdate: false,
      treeValue: searchId.value,
    });
  };
  // 编辑机构
  const editName = (record) => {
    openModal(true, {
      record: {
        ...record,
      },
      treeValue: searchId.value,
      isUpdate: true,
    });
  };
  // 编辑成功回调
  const handleSuccess = ({ isUpdate, values }) => {
    emits('reload');
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    }
    reload();
  };
</script>
<style lang="less" scoped>
  ::v-deep.vben-basic-table {
    padding: 0 0 0 0 !important;
  }
</style>
