<template>
  <div class="basic_class">
    <CollapseContainer title="基本设置" :canExpan="false">
      <a-row :gutter="24">
        <a-col :span="8">
          <div class="change-avatar">
            <!-- <div>头像</div> -->
            <CropperAvatar
              :uploadApi="uploadApi"
              :value="avatar"
              btnText="更换系统图标"
              :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
              @change="updateAvatar"
              width="150"
            />
          </div>
        </a-col>
        <a-col :span="16">
          <BasicForm @register="register" />
        </a-col>
      </a-row>
      <Button type="primary" class="submit_button" @click="handleSubmit"> 更新基本信息 </Button>
    </CollapseContainer>
  </div>
</template>
<script lang="ts">
  import { Button, Row, Col } from 'ant-design-vue';
  import { computed, defineComponent, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';

  import { useMessage } from '/@/hooks/web/useMessage';

  import headerImg from '/@/assets/images/logo.png';
  // import { accountInfoApi } from '/@/api/demo/account';
  // import { baseSetschemas } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadApi } from '/@/api/sys/upload';

  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      Button,
      ARow: Row,
      ACol: Col,
      CropperAvatar,
    },
    setup() {
      const { createMessage } = useMessage();
      const userStore = useUserStore();

      const [register, { setFieldsValue, getFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: [
          {
            field: 'system_name',
            component: 'Input',
            label: '系统名称',
            colProps: { span: 18 },
          },
          {
            field: 'system_code',
            component: 'Input',
            label: '版本编号',
            colProps: { span: 18 },
          },
          {
            field: 'introduction',
            component: 'InputTextArea',
            label: '更新描述',
            colProps: { span: 18 },
          },
        ],
        showActionButtonGroup: false,
      });

      onMounted(async () => {
        const data = {
          system_name: 'Vben',
          system_code: '00000001',
          introduction: '微笑着，努力着，欣赏着',
        };
        setFieldsValue(data);
      });

      const avatar = computed(() => {
        // const { avatar } = userStore.getUserInfo;
        return headerImg;
      });

      function updateAvatar(src: string) {
        const userinfo = userStore.getUserInfo;
        userinfo.avatar = src;
        userStore.setUserInfo(userinfo);
      }

      return {
        avatar,
        register,
        uploadApi: uploadApi as any,
        updateAvatar,
        handleSubmit: () => {
          let data: any = getFieldsValue();
          console.log(data);
          // console.log(import.meta.env.VITE_GLOB_APP_TITLE);

          // import.meta.env.VITE_GLOB_APP_TITLE = data.system_name;
          localStorage.setItem('system_info', JSON.stringify(data));
          // console.log(JSON.parse(localStorage.getItem('system_info')).system_name);

          createMessage.success('更新成功！');
        },
      };
    },
  });
</script>

<style lang="less" scoped>
  .basic_class {
    padding: 15px;

    .change-avatar {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        display: block;
        margin-bottom: 15px;
        // border-radius: 50%;
      }
    }

    .submit_button {
      margin-left: 80%;
      margin-bottom: 10px;
    }
  }
</style>
