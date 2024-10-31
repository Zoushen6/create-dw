<template>
  <div>
    <Form
      :model="formState"
      name="basic"
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <FormItem
        label="发送服务器地址"
        name="emailHost"
        :rules="[{ required: true, message: '请配置发送服务器地址' }]"
      >
        <a-input v-model:value="formState.emailHost" />
      </FormItem>

      <FormItem
        label="发件邮箱"
        name="emailFrom"
        :rules="[{ required: true, message: '请配置发件邮箱' }]"
      >
        <a-input v-model:value="formState.emailFrom" />
      </FormItem>

      <FormItem
        label="邮箱秘钥"
        name="emailSecret"
        :rules="[{ required: true, message: '请配置邮箱秘钥' }]"
      >
        <a-input-password v-model:value="formState.emailSecret" />
      </FormItem>

      <FormItem
        label="端口"
        name="emailPort"
        :rules="[{ required: true, message: '请配置邮箱秘钥' }]"
      >
        <a-input v-model:value="formState.emailPort" />
      </FormItem>

      <FormItem :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">提交</a-button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { Form, FormItem } from 'ant-design-vue';
  import API from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const formState = ref({
    username: '',
    password: '',
    remember: '',
  });
  onMounted(() => {
    getEmailSetting();
  });
  // 查询邮件配置
  const getEmailSetting = () => {
    API.queryEmailConfig().then((res) => {
      formState.value = res;
      console.log('邮件配置', formState.value);
    });
  };
  const onFinish = (values) => {
    console.log('Success:', values);
    API.editEmailConfig({ data: values }).then(() => {
      createMessage.success('操作成功');
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
</script>

<style></style>
../../system/api
