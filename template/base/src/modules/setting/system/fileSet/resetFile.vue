<template>
  <BasicModal @register="register" v-bind="$attrs" title="替换文件" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #file="{ model, field }">
        <a-upload-dragger
          :fileList="fileList"
          v-model:value="model[field]"
          :multiple="false"
          :before-upload="beforeUpload"
          @remove="handleRemove"
        >
          <p class="ant-upload-drag-icon">
            <cloud-upload-outlined :style="{ 'font-size': '80px', 'margin-top': '40px' }" />
          </p>
          <p style="margin-bottom: 50px; font-size: 14px">说明：点击图标开始上传！</p>
        </a-upload-dragger>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Upload } from 'ant-design-vue';
  // import axios from 'axios';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Api from '../../api';
  const AUploadDragger = Upload.Dragger; // 上传组件引入
  const { createMessage } = useMessage(); // 消息组件
  const fileList: any = ref([]);
  const recordData: any = ref({});
  const emit = defineEmits(['success', 'register']);
  // 弹框内部操作
  const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
    fileList.value = [];
    console.log(data);
    recordData.value = data.record;

    resetFields();
    setModalProps({ confirmLoading: false });
  });
  // const getSelectList = () => {
  //   return Api.getStorageList();
  // };
  // 手动上传做拦截
  const beforeUpload = (file) => {
    fileList.value = [file];
    if (fileList.value.length === 2) {
      fileList.value = fileList.value.slice(-1);
      createMessage.warning('只允许导入一个文件');
    }
    return false;
  };
  // 移除
  const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };
  const [registerForm, { resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'file',
        label: '文件',
        component: 'Input',
        componentProps: {
          placeholder: '请选择替换文件',
        },
        rules: [
          {
            required: true,
            validator: async () => {
              if (fileList.value.length == 0) {
                return Promise.reject('请选择替换文件');
              } else {
                return Promise.resolve();
              }
            },
          },
        ],
        slot: 'file',
        colProps: {
          span: 22,
        },
      },
    ],
    showActionButtonGroup: false,
  });

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      values.file = fileList.value[0];
      values.url = recordData.value.url;
      Api.coverFile({ data: { ...values } }).then(() => {
        createMessage.success('替换成功');
        closeModal();
        emit('success');
      });
    } catch ({ errorFields }) {
      errorFields.forEach((i) => {
        createMessage.error(i.errors[0]);
      });
      return;
    } finally {
      resetFields();
      setModalProps({ confirmLoading: false });
    }
  };
</script>
