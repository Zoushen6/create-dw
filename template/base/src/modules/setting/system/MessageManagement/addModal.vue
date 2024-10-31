<template>
  <BasicModal v-bind="$attrs" title="新建消息" @ok="handleOk" @register="register">
    <BasicForm :labelWidth="100" @register="registerForm" :showActionButtonGroup="false" />
  </BasicModal>
</template>
<script setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import API from '../../api';
  import { useModal } from '/@/components/Modal';
  import { debounce } from 'lodash-es';
  let keyword = ref('');
  const { createMessage } = useMessage();

  const [register, { closeModal }] = useModal();
  const [registerForm, { validate, updateSchema }] = useForm({
    schemas: [
      {
        field: 'subject',
        component: 'Input',
        label: '主题',
        required: true,
        colProps: {
          span: 22,
        },
        defaultValue: '',
        componentProps: {
          placeholder: '请输入主题',
        },
      },
      {
        field: 'content',
        component: 'Input',
        label: '内容',
        required: false,
        colProps: {
          span: 22,
        },
        defaultValue: '',
        componentProps: {
          type: 'textarea',
          placeholder: '请输入消息内容',
        },
      },
      {
        field: 'category1',
        component: 'Input',
        label: '分类1',
        required: false,
        colProps: {
          span: 22,
        },
        defaultValue: '',
        componentProps: {
          placeholder: '请输入主题',
        },
      },
      {
        field: 'expectedPushTime',
        component: 'DatePicker',
        label: '预计推送时间',
        required: true,
        colProps: {
          span: 22,
        },
        defaultValue: '',
        componentProps: {
          showTime: true,
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          placeholder: '请选择预计推送时间',
        },
      },
      {
        field: 'pushChannel',
        component: 'Select',
        label: '推送渠道',
        required: true,

        colProps: {
          span: 22,
        },
        componentProps: {
          mode: 'multiple',
          placeholder: '请选择推送渠道',
          options: [
            {
              label: '站内信',
              value: 'PM',
              key: 1,
            },
            {
              label: '邮件',
              value: 'EMAIL',
              key: 2,
            },
          ],
        },
      },
      {
        field: 'receiverId',
        component: 'ApiSelect',
        label: '接收者',
        colProps: {
          span: 22,
        },
        defaultValue: '',
        componentProps: {
          api: API.getUserList,
          getPopupContainer: () => document.body,
          onSearch: debounce((e) => {
            updateSchema({
              field: 'receiverId',
              componentProps: {
                params: { params: { keyword: e } },
              },
            });
          }, 500),
          params: { params: { keyword: keyword.value } },
          showSearch: true,
          resultField: 'content',
          labelField: 'name',
          valueField: 'id',
          immediate: true,
          placeholder: '请选择预计推送时间',
        },
      },
      {
        field: 'receiverPhone',
        component: 'Input',
        label: '接收者手机',
        colProps: {
          span: 22,
        },
        defaultValue: '',
        componentProps: {
          placeholder: '请输入接收者联系方式',
        },
      },
      {
        field: 'receiverEmail',
        component: 'Input',
        label: '接收者邮箱',
        colProps: {
          span: 22,
        },
        defaultValue: '',
        componentProps: {
          placeholder: '请输入接收者邮箱',
        },
      },
    ],
  });

  // const schemas: FormSchema[] = [
  //   {
  //     field: 'subject',
  //     component: 'Input',
  //     label: '主题',
  //     required: true,
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       placeholder: '请输入主题',
  //     },
  //   },
  //   {
  //     field: 'content',
  //     component: 'Input',
  //     label: '内容',
  //     required: false,
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       type: 'textarea',
  //       placeholder: '请输入消息内容',
  //     },
  //   },
  //   {
  //     field: 'category1',
  //     component: 'Input',
  //     label: '分类1',
  //     required: false,
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       placeholder: '请输入主题',
  //     },
  //   },
  //   {
  //     field: 'expectedPushTime',
  //     component: 'DatePicker',
  //     label: '预计推送时间',
  //     required: true,
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       showTime: true,
  //       valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //       placeholder: '请选择预计推送时间',
  //     },
  //   },
  //   {
  //     field: 'pushChannel',
  //     component: 'Select',
  //     label: '推送渠道',
  //     required: true,
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       placeholder: '请选择推送渠道',
  //       options: [
  //         {
  //           label: '站内信',
  //           value: 'PM',
  //           key: 1,
  //         },
  //         {
  //           label: '邮件',
  //           value: 'EMAIL',
  //           key: 2,
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     field: 'receiverId',
  //     component: 'ApiSelect',
  //     label: '接收者',
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       api: API.getUserList,
  //       getPopupContainer: () => document.body,
  //       params: {},
  //       showSearch: true,
  //       resultField: 'content',
  //       labelField: 'name',
  //       valueField: 'id',
  //       immediate: true,
  //       placeholder: '请选择预计推送时间',
  //     },
  //   },
  //   {
  //     field: 'receiverPhone',
  //     component: 'Input',
  //     label: '接收者手机',
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       placeholder: '请输入接收者联系方式',
  //     },
  //   },
  //   {
  //     field: 'receiverEmail',
  //     component: 'Input',
  //     label: '接收者邮箱',
  //     colProps: {
  //       span: 22,
  //     },
  //     defaultValue: '',
  //     componentProps: {
  //       placeholder: '请输入接收者邮箱',
  //     },
  //   },
  // ];
  const handleOk = async () => {
    const values = await validate();
    console.log(11111, values);
    API.mewMessage({ data: { ...values } }).then(() => {
      createMessage.success('操作成功');
      closeModal();
    });
  };
</script>

<style lang="less" scoped>
  ::v-deep .ant-picker {
    width: 100%;
  }
</style>
