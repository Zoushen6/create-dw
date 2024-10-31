<template>
  <BasicModal @register="register" v-bind="$attrs" width="440px" @ok="handleUpload">
    <!-- @visible-change="handleVisibleChange" -->
    <a-upload-dragger
      style="margin-bottom: 20px"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :fileList="fileList"
      :multiple="false"
      :before-upload="beforeUpload"
      @remove="handleRemove"
    >
      <p class="ant-upload-drag-icon">
        <cloud-upload-outlined :style="{ 'font-size': '80px', 'margin-top': '40px' }" />
      </p>
      <a style="margin-bottom: 20px; font-size: 14px" @click.stop="downLoadTemplate">下载样表</a>
      <p style="margin-bottom: 50px; font-size: 14px">说明：点击图标开始上传，仅支持excel格式！</p>
    </a-upload-dragger>
    <template #footer>
      <a-button @click="handleClose">取消</a-button>
      <a-button
        type="primary"
        @click="handleUpload"
        :loading="uploading"
        :disabled="fileList.length === 0"
        >确认</a-button
      >
    </template>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Upload } from 'ant-design-vue';
  import axios from 'axios';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getAppEnvConfig } from '/@/utils/env';
  import { getToken } from '/@/utils/auth';
  const AUploadDragger = Upload.Dragger; // 上传组件引入
  const { createMessage } = useMessage(); // 消息组件
  const fileList = ref([]);
  const uploading = ref(false);
  const paramsData = ref(null);
  const emit = defineEmits(['success', 'register']);
  // 弹框内部操作
  const [register, { closeModal, setModalProps }] = useModalInner((data) => {
    console.log(data);
    paramsData.value = data;
    setModalProps({
      title: '导入' + data.title,
    });
  });
  // 手动上传做拦截
  const beforeUpload = (file) => {
    fileList.value = [...fileList.value, file];
    if (fileList.value.length >= 2) {
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
  // 确认导入
  const handleUpload = () => {
    const formData = new FormData();
    fileList.value.forEach((file) => {
      formData.append('file', file);
    });
    uploading.value = true;
    const { VITE_GLOB_API_URL } = getAppEnvConfig();
    axios
      .post(`${VITE_GLOB_API_URL}${paramsData.value.uploadUrl}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        fileList.value = [];
        uploading.value = false;
        createMessage.success('导入成功');
        closeModal();
        emit('success');
      })
      .catch((err) => {
        uploading.value = false;
        createMessage.error(err.response.data ? err.response.data.message : '导入失败请稍后重试');
      });
  };
  // 关闭
  const handleClose = () => {
    fileList.value = [];
    closeModal();
  };
  const downLoadTemplate = () => {
    const { temUrl, templateName, houzhui } = paramsData.value;
    const a = document.createElement('a');
    a.href = temUrl;
    a.download = templateName + '.' + houzhui;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
</script>
