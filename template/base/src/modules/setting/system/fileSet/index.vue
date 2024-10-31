<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '下载',
              icon: 'ic:round-vertical-align-bottom',
              popConfirm: {
                title: '是否下载该文件',
                placement: 'left',
                confirm: handleDownLoad.bind(null, record),
              },
            },
            {
              label: '详情',
              icon: 'material-symbols:info-outline',
              onClick: editName.bind(null, record),
            },
            {
              label: '替换',
              icon: 'radix-icons:update',
              onClick: resetFileFun.bind(null, record),
            },
          ]"
        />
        <!-- {
              label: '删除',
              icon: 'ic:outline-delete-outline',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
            { label: '预览', icon: 'material-symbols:visibility-outline' }, -->
      </template>
      <template #toolbar>
        <a-button type="primary" @click="openFileUploadModal(true, {})">上传文件</a-button>
      </template>
    </BasicTable>
    <NameEdit @register="registerModal" />
    <UploadModalVue @register="registerUploadModal" @success="reload()" />
    <resetFile @register="registerResetModal" @success="reload()" />
  </div>
</template>
<script setup lang="ts">
  import NameEdit from './nameEdit.vue';
  import UploadModalVue from './uploadModal.vue';
  import resetFile from './resetFile.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { filterIndex } from '/@/utils/public';
  import { ref } from 'vue';
  import { exportDataFunction } from '/@/utils/public';
  import Api from '../../api';
  const [registerModal, { openModal }] = useModal();
  const [registerUploadModal, { openModal: openFileUploadModal }] = useModal();
  const [registerResetModal, { openModal: openFileResetModal }] = useModal();
  const page = ref({
    page: 1,
    size: 10,
  });
  const taskColumns = [
    filterIndex(page.value),
    {
      title: '原始文件名',
      dataIndex: 'originalFilename',
      key: 'originalFilename',
      width: 200,
    },
    {
      title: '文件大小',
      dataIndex: 'sizeStr',
      key: 'sizeStr',
      width: 100,
    },

    {
      title: '存储平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
    },
    {
      title: '基础路径',
      dataIndex: 'basePath',
      key: 'basePath',
      width: 100,
    },
    {
      title: '存储路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
    },

    {
      title: '文件访问地址',
      dataIndex: 'url',
      key: 'url',
      width: 250,
    },

    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
  ];
  const FormSchema: any = [
    {
      field: 'filename',
      label: '文件名称',
      component: 'Input',
      colProps: { xl: 6 },
    },
    {
      field: 'level',
      label: '存储平台',
      component: 'Select',
      colProps: { xl: 6 },
      componentProps: {
        options: [
          {
            label: '阿里云',
            value: '1',
            key: '1',
          },
          {
            label: '腾讯云',
            value: '2',
            key: '2',
          },
          {
            label: 'minio',
            value: '3',
            key: '3',
          },
          {
            label: '本地',
            value: '4',
            key: '4',
          },
        ],
      },
    },
    {
      field: '[startLoginTime, endLoginTime]',
      component: 'RangePicker',
      label: '创建时间',
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
    // {
    //   field: 'name',
    //   label: '文件仓库',
    //   component: 'Input',
    //   colProps: { xl: 6 },
    // },
  ];
  function getOrgan(params) {
    return Api.getFilePage({ params });
  }

  const [registerTable, { reload }] = useTable({
    title: '文件列表',
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
      console.log('handleSearchInfoFn', info);
      return info;
    },
    tableSetting: { fullScreen: true, resizeTable: true },
    showIndexColumn: false,
    rowKey: 'id',

    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  // 上传文件
  const editName = (record) => {
    openModal(true, {
      record: {
        ...record,
      },
      isUpdate: true,
    });
  };
  // 替换文件
  const resetFileFun = (record) => {
    openFileResetModal(true, {
      record: {
        ...record,
      },
      isUpdate: true,
    });
  };
  // 删除文件
  // const handleDelete = (record) => {
  //   console.log(record);
  //   Api.deleteFilePage({ data: { ...record } }).then(() => {
  //     reload();
  //     createMessage.success('删除成功');
  //   });
  // };

  // 下载文件
  const handleDownLoad = (record) => {
    Api.downloadFile({ params: { url: record.url } }).then((res) => {
      exportDataFunction(res, record.originalFilename);
    });
  };
</script>
<style lang="less" scoped>
  ::v-deep.vben-basic-table-form-container {
    padding: 0 !important;
  }
</style>
