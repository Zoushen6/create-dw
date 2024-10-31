<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              tooltip: '编辑页面',
              icon: 'clarity:note-edit-line',
              onClick: editName.bind(null, record),
            },
            {
              label: '设计',
              tooltip: '设计页面',
              icon: 'clarity:note-edit-line',
              onClick: linkSettingOnlinePage.bind(null, record),
            },
            {
              label: '配置菜单',
              tooltip: '配置菜单',
              icon: 'clarity:note-edit-line',
              onClick: createMenu.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              tooltip: '删除页面',
              popConfirm: {
                title: '是否确认删除该页面',
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
    <CreateMenuModel @register="registerCreateMenuModal" @success="createMenuHandleSuccess" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import NameEdit from './nameEdit.vue';
  import CreateMenuModel from '../menu/nameEdit.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { filterIndex } from '/@/utils/public';
  import Api from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { useUserStore } from '/@/store/modules/user';
  const [registerModal, { openModal }] = useModal();
  const [registerCreateMenuModal, { openModal: openCreateMenuModel }] = useModal();
  const taskColumns = [
    {
      title: '唯一标识',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 200,
    },

    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },

    {
      title: '更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 200,
      customRender: ({ record }) => {
        return record.createdBy?.name;
      },
    },

    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
    },
    // {
    //   title: '创建者',
    //   dataIndex: 'createdBy',
    //   key: 'createdBy',
    //   width: 200,
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createdAt',
    //   key: 'createdAt',
    //   width: 200,
    // },
  ];
  const FormSchema: any = [
    {
      field: 'name',
      label: '页面名称',
      component: 'Input',
      colProps: { xl: 6 },
    },
    {
      field: 'level',
      label: '页面路径',
      component: 'Select',
      colProps: { xl: 6 },
      componentProps: {
        options: [
          {
            label: '运行',
            value: '1',
            key: '1',
          },
          {
            label: '停止',
            value: '2',
            key: '2',
          },
        ],
      },
    },
  ];
  const { createMessage } = useMessage();
  function getOrgan(params) {
    return Api.getOnlinePage({ params });
  }
  const page = ref({
    page: 1,
    size: 10,
  });
  // const store = useUserStore();
  const [registerTable, { updateTableDataRecord, reload }] = useTable({
    title: '在线页面列表',
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
      return t;
    },
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 320,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  // 编辑
  const editName = (record) => {
    console.log(record);

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
    } else {
      setTimeout(() => {
        reload();
      }, 0);
    }
  };
  // 跳转页面设计
  const linkSettingOnlinePage = (record) => {
    // window.location.href = '/amis/?id=' + record.id;
    window.open('/amis/?id=' + record.id, 'amis');
  };
  const handleDelete = (record) => {
    Api.deleteOnlinePage({ pathVars: { id: record.id } }).then(() => {
      createMessage.success('删除页面成功！');
      reload();
    });
  };
  // 配置页面
  const createMenu = (record) => {
    // console.log(record);
    openCreateMenuModel(true, {
      record: {
        path: `/amis.html?key=${record.key}`,
      },
      disabled: true,
      isUpdate: false,
    });
  };
  const createMenuHandleSuccess = () => {
    // alert('新建成功');
  };
</script>
