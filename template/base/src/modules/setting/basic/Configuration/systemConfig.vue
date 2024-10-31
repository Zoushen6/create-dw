<template>
  <div>
    <Form
      :model="formState"
      name="basic"
      :label-col="{ span: 9 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <FormItem
        label="系统LOGO :"
        name="systemLogoUrl"
        :rules="[{ required: true, message: '请上传LOGO!' }]"
      >
        <Upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          :multiple="false"
          class="avatar-uploader"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="handleChange"
          :customRequest="() => {}"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading" />
            <plus-outlined v-else />
            <div class="ant-upload-text">上传</div>
          </div>
        </Upload>
      </FormItem>

      <FormItem
        label="名称"
        name="systemName"
        :rules="[{ required: true, message: '请输入系统名称!' }]"
      >
        <a-input v-model:value="formState.systemName" />
      </FormItem>

      <FormItem :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">提交</a-button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { Form, FormItem, Upload } from 'ant-design-vue';
  import API from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const fileList = ref([]);
  const imageUrl = ref('');
  const formState = ref({
    // username: '',
    // password: '',
    // remember: true,
  });
  onMounted(() => {
    getSystemData();
  });

  const getSystemData = () => {
    API.getBasic().then((res) => {
      console.log('11111', res);
      imageUrl.value = res.systemLogoUrl;
      formState.value = res;
    });
  };
  const beforeUpload = (values) => {
    console.log('fileList', fileList.value, values);
    const isLt2M = values.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      createMessage.error('文件大小不能超过5MB!');
      return;
    }
    console.log(2222222);
    API.uploadLogo({ data: { file: values } }).then((res) => {
      console.log(res);
      imageUrl.value = res.url;
      formState.value.systemLogoUrl = res.url;
    });
  };
  const onFinish = (values) => {
    console.log('Success:', values, formState.value);
    API.setBasic({ data: formState.value }).then(() => {
      createMessage.success('操作成功');
      location.reload();
      document.title = formState.value.systemName;
      localStorage.setItem('project_title', formState.value.systemName);

      document.querySelector('.c_logo').href = formState.value.systemLogoUrl;
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
</script>

<style></style>
../../system/api
