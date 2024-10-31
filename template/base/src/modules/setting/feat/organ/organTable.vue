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
                title: '是否确认删除该机构',
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
        <a-button @click="handelUpDown('up')" :disabled="!hasPermission(['organ:import'])"
          >导入</a-button
        >
        <a-button @click="handelUpDown('down')" :disabled="!hasPermission(['organ:export'])"
          >导出</a-button
        >
      </template>
    </BasicTable>
    <NameEdit @register="registerModal" @success="handleSuccess" />
    <uploadModel @register="registerUploadModal" @success="reload()" />
  </div>
</template>
<script setup lang="ts">
  import { ref, defineProps, watch, defineEmits } from 'vue';
  import NameEdit from './nameEdit.vue';
  // import uploadModel from './uploadOrgan.vue';
  import uploadModel from '/@/modules/components/uploadModel/index.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { filterIndex, exportDataFunction } from '/@/utils/public';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Api from '../api';
  // import Api from '/@/modules/api/index';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();
  const [registerUploadModal, { openModal: openUploadModel }] = useModal();
  const searchId = ref('');
  const props = defineProps({
    treeId: String,
  });
  const emits = defineEmits(['reload']);
  const { createMessage, createConfirm } = useMessage();
  const taskColumns = [
    {
      title: '组织简称',
      dataIndex: 'abbrName',
      key: 'abbrName',
      width: 200,
    },
    {
      title: '组织名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    // {
    //   title: '机构级别',
    //   dataIndex: 'level',
    //   key: 'level',
    //   width: 200,
    //   customRender: ({ text }) => {
    //     let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    //     return arr[text - 1] + '级机构';
    //   },
    // },
  ];
  const FormSchema: any = [
    // {
    //   field: 'level',
    //   label: '机构级别',
    //   component: 'Select',
    //   colProps: { xl: 6 },
    //   componentProps: {
    //     options: [
    //       {
    //         label: '一级机构',
    //         value: '1',
    //         key: '1',
    //       },
    //       {
    //         label: '二级机构',
    //         value: '2',
    //         key: '2',
    //       },
    //       {
    //         label: '三级机构',
    //         value: '3',
    //         key: '3',
    //       },
    //       {
    //         label: '四级机构',
    //         value: '4',
    //         key: '4',
    //       },
    //     ],
    //   },
    // },
    {
      field: 'name',
      label: '组织名称',
      component: 'Input',
      colProps: { xl: 8 },
    },
  ];
  function getOrgan(params) {
    return Api.getOrganList({ params });
  }
  const page = ref({
    page: 1,
    size: 10,
  });
  const [registerTable, { updateTableDataRecord, reload }] = useTable({
    title: '组织列表',
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

    Api.deleteOrganTree({ pathVars: { id: record.id } }).then(() => {
      emits('reload');
      reload();
      createMessage.success('删除组织成功');
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
    } else {
      reload();
    }
  };
  // 导入导出
  const handelUpDown = (type) => {
    if (type == 'up') {
      openUploadModel(true, {
        title: '机构列表',
        templateName: '导入机构样表',
        houzhui: 'xlsx',
        uploadUrl: '/organs/import',
        temUrl: '/template/organ.xlsx',
      });
    } else if (type == 'down') {
      createConfirm({
        title: ' 是否确定导出机构列表！',
        iconType: 'warning',
        onOk() {
          Api.export_organ().then((res) => exportDataFunction(res, '机构列表导出数据.xlsx'));
        },
      });
    }
  };
</script>
<style lang="less" scoped>
  ::v-deep.vben-basic-table {
    padding: 0 0 0 16px !important;
  }
</style>
