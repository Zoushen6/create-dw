<template>
  <div>
    <BasicTable @register="registerTable" @selection-change="selectionChange">
      <template #toolbar>
        <a-button @click="handleDelete">删除</a-button>
        <a-button type="primary" @click="handleAction('add')">添加消息</a-button>
      </template>
      <template #templateUpdatedBy="{ record }">
        <span v-if="record.updatedBy">
          {{ record.updatedBy.name }}
        </span>
      </template>
      <template #templateReceiveState="{ record }">
        <span>
          {{ record.receiveState ? '已读取' : '未读取' }}
        </span>
      </template>
      <template #templatePushChannel="{ record }">
        <span v-for="item in record.pushChannel" :key="item">
          {{ item === 'PM' ? '站内信' : item === 'EMAIL' ? '邮件' : '' }} &emsp;
        </span>
      </template>
    </BasicTable>
    <!-- <commonModal :visible="visible" @handleSubmit="closeModal" /> -->
    <AddModal @register="register" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Modal } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import {  Form, FormItem } from 'ant-design-vue';
  // import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { filterIndex } from '/@/utils/public';
  // import { useRouter } from 'vue-router';
  import Api from '../../api';
  // import commonModal from './commonModal.vue';
  import AddModal from './addModal.vue';
  import { useModal } from '/@/components/Modal';

  const [register, { openModal }] = useModal();
  // const visible = ref(false);
  const page = ref({
    page: 1,
    size: 10,
  });
  const taskColumns = [
    filterIndex(page.value),
    {
      title: '',
      dataIndex: 'id',
      width: 0,
    },
    {
      title: '主题',
      dataIndex: 'subject',
      width: 200,
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '分类1',
      dataIndex: 'category1',
      width: 200,
    },
    {
      title: '预计推送时间',
      dataIndex: 'expectedPushTime',
      width: 200,
    },
    {
      title: '推送渠道',
      dataIndex: 'pushChannel',
      width: 220,
      slots: {
        customRender: 'templatePushChannel',
      },
    },
    {
      title: '推送状态',
      dataIndex: 'pushState',
      width: 120,
      customRender: ({ text }) => (!!text ? '已推送' : '未推送'),
      // slots: {
      //   customRender: 'templatePushState',
      // },
    },
    {
      title: '读取状态',
      dataIndex: 'receiveState',
      width: 120,
      slots: {
        customRender: 'templateReceiveState',
      },
    },
    {
      title: '接收者手机',
      dataIndex: 'receiverPhone',
      width: 150,
    },
    {
      title: '接收者邮箱',
      dataIndex: 'receiverEmail',
      width: 150,
    },
    {
      title: '更新者',
      dataIndex: ['updatedBy', 'name'],
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 180,
    },
    {
      title: '创建者',
      dataIndex: ['createdBy', 'name'],
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
    },
  ];
  const FormSchema = [
    {
      field: 'key',
      component: 'Input',
      label: '关键词',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入主题、内容',
      },
    },
    {
      field: '[expectedPushStartTime, expectedPushEndTime]',
      component: 'RangePicker',
      label: '预计推送时间',
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
    {
      field: 'pushState',
      component: 'Select',
      label: '推送状态',
      componentProps: {
        options: [
          {
            label: '已推送',
            value: true,
          },
          {
            label: '未推送',
            value: false,
          },
        ],
      },
      colProps: {
        span: 6,
      },
    },
    {
      field: 'receiveState',
      component: 'Select',
      label: '读取状态',
      componentProps: {
        options: [
          {
            label: '已读',
            value: true,
          },
          {
            label: '未读',
            value: false,
          },
        ],
      },
      colProps: {
        span: 6,
      },
    },
    {
      field: 'pushChannel',
      component: 'Select',
      label: '推送渠道',
      componentProps: {
        mode: 'multiple',
        options: [
          {
            label: '站内信',
            value: 'PM',
          },
          {
            label: '邮件',
            value: 'EMAIL',
          },
        ],
      },
      colProps: {
        span: 6,
      },
    },
    {
      field: 'receiverPhone',
      component: 'Input',
      label: '接受者联系方式',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入接受者联系方式',
      },
    },
    {
      field: 'receiverEmail',
      component: 'Input',
      label: '接受者邮箱',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入接受者邮箱',
      },
    },
  ];
  function getList(params) {
    return Api.getMessageList({ params });
  }

  const [registerTable, { getSelectRowKeys, reload }] = useTable({
    title: '消息列表',
    api: getList,
    // dataSource: data,
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
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
    },

    // actionColumn: {
    //   width: 100,
    //   title: '编辑',
    //   dataIndex: 'action',
    //   slots: { customRender: 'action' },
    // },
  });

  const { createMessage } = useMessage();

  // const { push } = useRouter();

  // 操作
  const handleAction = () => {
    // if (type === 'add') {
    //   visible.value = true;
    // }
    openModal(true);
  };

  // 提交后关闭弹窗.
  // const closeModal = (value) => {
  //   visible.value = false;
  //   reload();
  // };

  // 删除
  const handleDelete = () => {
    if (getSelectRowKeys().length <= 0) {
      return createMessage.warning('请选择要操作的数据');
    }
    Modal.confirm({
      title: '确认删除所选消息？',
      onOk: () => {
        Api.deleteMessage({ data: { ids: getSelectRowKeys() } }).then((res) => {
          console.log(res);
          createMessage.success('操作成功');
          reload();
        });
      },
    });
  };
</script>

<style></style>
