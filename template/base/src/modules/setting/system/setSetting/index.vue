<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            { label: '编辑', icon: 'clarity:note-edit-line', onClick: editName.bind(null, record) },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              disabled: record.builtIn,
              tooltip: record.builtIn ? '内置配置禁止删除' : '删除配置',
              popConfirm: {
                title: '是否确认删除该配置',
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
  // import { useUserStore } from '/@/store/modules/user';
  const [registerModal, { openModal }] = useModal();
  const taskColumns = [
    {
      title: '配置项',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 200,
    },
    {
      title: '配置值',
      dataIndex: 'value',
      key: 'value',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '类别1',
      dataIndex: 'category1',
      key: 'category1',
      width: 200,
    },
    // {
    //   title: '是否必须',
    //   dataIndex: 'required',
    //   key: 'required',
    //   width: 200,
    //   customRender: ({ text }) => {
    //     return !!text ? '是' : '否';
    //   },
    // },
    {
      title: '值的类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
    },
    {
      title: '正则表达式',
      dataIndex: 'pattern',
      key: 'pattern',
      width: 230,
      customRender: ({ text }) => {
        return text ? text : '-';
      },
    },
    {
      title: '最小值',
      dataIndex: 'minValue',
      key: 'minValue',
      width: 200,
    },
    {
      title: '最大值',
      dataIndex: 'maxValue',
      key: 'maxValue',
      width: 200,
    },

    // {
    //   title: '是否只读',
    //   dataIndex: 'builtIn',
    //   key: 'builtIn',
    //   width: 200,
    //   customRender: ({ text }) => {
    //     return !!text ? '是' : '否';
    //   },
    // },
    // {
    //   title: '是否内置',
    //   dataIndex: 'builtIn',
    //   key: 'builtIn',
    //   width: 200,
    //   customRender: ({ text }) => {
    //     // if (text == null || text == undefined || text == '') {
    //     //   return '';
    //     // }
    //     return !!text ? '是' : '否';
    //   },
    // },
    {
      title: '更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 150,
      customRender: ({ record }) => {
        return record.updatedBy?.name;
      },
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
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
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
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
        placeholder: '请输入配置项、描述',
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
          return await Api.system_setting_category();
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
    return Api.getSetSettingPage({ params });
  }
  const page = ref({
    page: 1,
    size: 10,
  });
  // const store = useUserStore();
  const [registerTable, { updateTableDataRecord, reload }] = useTable({
    title: '配置列表',
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
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return t;
    },
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
  };
  const handleDelete = (record) => {
    Api.deleteSetSetting({ pathVars: { id: record.id } }).then(() => {
      createMessage.success('删除配置成功！');
      reload();
    });
  };
</script>
