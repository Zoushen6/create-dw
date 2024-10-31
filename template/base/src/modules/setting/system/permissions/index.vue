<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              //   disabled: record.builtIn,
              tooltip: '编辑权限',
              icon: 'clarity:note-edit-line',
              onClick: editName.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              disabled: record.builtIn,
              tooltip: record.builtIn ? '内置权限不得删除' : '删除权限',
              popConfirm: {
                title: '是否确认删除该权限',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
          >设置</TableAction
        >
      </template>
      <template #toolbar>
        <a-button
          @click="
            openModal(true, {
              isUpdate: false,
            })
          "
          type="primary"
          >新建</a-button
        >
      </template>
    </BasicTable>
    <NameEdit @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import NameEdit from './nameEdit.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { filterIndex } from '/@/utils/public';
  import Api from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  const [registerModal, { openModal }] = useModal();
  const taskColumns = [
    {
      title: '类别1',
      dataIndex: 'category1',
      key: 'category1',
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '权限值',
      dataIndex: 'authority',
      key: 'authority',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '是否显示',
      dataIndex: 'showed',
      key: 'showed',
      width: 200,
      customRender: ({ text }) => {
        // if (text == null || text == undefined || text == '') {
        //   return '';
        // }
        return text ? '是' : '否';
      },
    },
  ];
  const FormSchema: any = [
    {
      field: 'key',
      component: 'Input',
      label: '关键词',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入内容、描述',
      },
    },
    {
      field: 'category1',
      label: '类别1',
      colProps: {
        span: 6,
      },
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await Api.permissions_category();
        },
        getPopupContainer: () => document.body,
        resultField: 'content',
        labelField: 'label',
        valueField: 'value',
        // mode: 'multiple',
        immediate: true,
        placeholder: '请选择类别',
      },
    },
  ];
  const { createMessage } = useMessage();
  function getOrgan(params) {
    return Api.getPermissionsPage({ params });
  }
  const page = ref({
    page: 1,
    size: 10,
  });
  const store = useUserStore();
  const [registerTable, { updateTableDataRecord, reload }] = useTable({
    title: '权限列表',
    api: getOrgan,
    columns: [filterIndex(page.value), ...taskColumns],
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
    rowKey: 'id',
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  // 编辑权限
  const editName = (record) => {
    openModal(true, {
      record: {
        ...record,
      },
      isUpdate: true,
    });
  };
  // 编辑成功回调
  const handleSuccess = ({ isUpdate, values }) => {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    }
    reload();
    updateLocalPermission();
  };
  const handleDelete = (record) => {
    Api.deletePermissions({ pathVars: { id: record.id } }).then(() => {
      createMessage.success('删除权限成功！');
      reload();
      updateLocalPermission();
    });
  };
  const updateLocalPermission = async () => {
    const treeData = await Api.getRoleTree();
    const arr: any = [];
    treeData.forEach((item) => {
      arr.push({
        name: item.name,
        relatedCheckValue: [],
        description: item.description,
        children: item.children.map((i) => {
          return {
            label: i.name,
            value: i.authority,
            description: i.description,
          };
        }),
      });
    });
    store.setRoleTree(arr);
  };
</script>
