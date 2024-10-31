<template>
  <BasicModal @register="register" v-bind="$attrs" title="密码设置" width="480px">
    <div>
      <BasicForm @register="registerForm" />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </template>
  </BasicModal>
</template>
<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import md5 from 'blueimp-md5';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  // import { patPassword } from '/@/api/sys/password';
  import Api from '../api';
  let intensity: any = null;
  const formSchema: FormSchema[] = [
    {
      field: 'passwordOld',
      label: '当前密码',
      component: 'InputPassword',
      required: true,
    },
    {
      field: 'passwordNew',
      label: '新密码',
      component: 'StrengthMeter',
      componentProps: {
        placeholder: '新密码',
        onScoreChange: (val) => {
          intensity = val;
        },
      },
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('密码不得为空');
            } else {
              if (intensity <= 1) {
                return Promise.reject('密码强度不足');
              } else {
                return Promise.resolve();
              }
            }
          },
        },
      ],
    },
    {
      field: 'confirmPassword',
      label: '确认密码',
      component: 'InputPassword',

      dynamicRules: ({ values }) => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject('密码不能为空');
              }
              if (value !== values.passwordNew) {
                return Promise.reject('两次输入的密码不一致!');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },
  ];
  const [registerForm, { validate, resetFields }] = useForm({
    size: 'default',
    labelWidth: 120,
    showActionButtonGroup: false,
    schemas: formSchema,
  });
  const [register, { closeModal }] = useModalInner();
  async function handleSubmit() {
    try {
      const values = await validate();
      const { passwordOld, passwordNew } = values;
      // TODO custom api
      console.log(passwordOld, passwordNew);
      // const { router } = useRouter();
      Api.patUserPassword({
        data: { oldPassword: md5(passwordOld), newPassword: md5(passwordNew) },
      }).then(() => {
        closeModal();
        resetFields();
        message.success('密码修改成功');
      });
      // router.push(pageEnum.BASE_LOGIN);
    } catch (error) {}
  }
</script>
