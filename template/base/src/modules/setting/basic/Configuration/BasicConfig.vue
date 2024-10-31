<template>
  <Form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <FormItem>
      <Upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
          <loading-outlined v-if="loading" />
          <plus-outlined v-else />
          <div class="ant-upload-text">Upload</div>
        </div>
      </Upload>
    </FormItem>
  </Form>
</template>

<script setup>
  // import { ref, onMounted, computed } from 'vue';
  import { Form, FormItem, Upload } from 'ant-design-vue';
  const formState = reactive({
    username: '',
    password: '',
    remember: true,
  });
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
</script>

<style></style>
