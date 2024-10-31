<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <a-row :gutter="24">
      <a-col :span="14">
        <BasicForm @register="register" @submit="handleSubmit" />
      </a-col>
      <a-col :span="10">
        <div class="change-avatar">
          <div class="mb-2">头像</div>
          <CropperAvatar
            :uploadApi="uploadApi"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </a-col>
    </a-row>
    <!--    <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>-->
  </CollapseContainer>
</template>
<script lang="ts">
  import { Row, Col } from 'ant-design-vue';
  import { computed, defineComponent, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';

  import { useMessage } from '/@/hooks/web/useMessage';

  import headerImg from '/@/assets/images/header.jpg';
  // import { accountInfoApi } from '/@/api/demo/account';
  import { baseSetschemas } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import publicApi from '/@/modules/api';
  import Api from './api';

  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      ARow: Row,
      ACol: Col,
      CropperAvatar,
    },
    setup() {
      const { createMessage } = useMessage();
      const userStore = useUserStore();

      const [register, { setFieldsValue, updateSchema }] = useForm({
        labelWidth: 120,
        schemas: baseSetschemas,
        // showActionButtonGroup: false,
        actionColOptions: {
          span: 12,
        },
        resetButtonOptions: {
          text: '返回',
        },
        submitButtonOptions: {
          text: '确定',
        },
      });
      // 获取用户信息
      onMounted(async () => {
        const data: any = await userStore.getUserInfo;
        let obj: any = {
          name: data.name,
          username: data.username,
          organ: data?.organs?.map((i) => i.abbrName)?.join(','),
          mobile: data.mobile,
          email: data.email,
          position: data.position,
          roleName: data?.role?.name,
        };

        setFieldsValue(obj);
        Api.getUserIsUpdateInfo().then((res) => {
          console.log(res);
          updateSchema({
            field: 'email',
            component: 'Input',
            label: '邮箱',
            colProps: { span: 18 },
            componentProps: { disabled: !res.emailEditPermitted },
          });
          updateSchema({
            field: 'name',
            component: 'Input',
            label: '姓名',
            colProps: { span: 18 },
            componentProps: { disabled: !res.nameEditPermitted },
          });
          updateSchema({
            field: 'mobile',
            component: 'Input',
            label: '手机号',
            colProps: { span: 18 },
            componentProps: { disabled: !res.mobileEditPermitted },
          });
          updateSchema({
            field: 'position',
            component: 'Input',
            label: '职务',
            colProps: { span: 18 },
            componentProps: { disabled: !res.positionEditPermitted },
          });
        });
      });

      const avatar = computed(() => {
        const { avatar } = userStore.getUserInfo;
        return avatar || headerImg;
      });
      function updateAvatar(src: string) {
        const userinfo = userStore.getUserInfo;
        userinfo.avatar = src;
        userStore.setUserInfo(userinfo);
      }
      const uploadAvatar = async (data) => {
        const result = await publicApi.uploadTmp({ data });
        console.log(result);

        return Api.putUserAvatar({ data: { avatar: result.url } }).then((res) => {
          console.log(res);
          userStore.getUserInfoAction();
          return { source: data.field, data: res };
        });
      };
      return {
        avatar,
        register,
        uploadApi: uploadAvatar,
        updateAvatar,
        handleSubmit: (value) => {
          Api.patUserInfo({ data: value }).then(() => {
            createMessage.success('更新成功！');
            const data: any = userStore.getUserInfo;
            let obj: any = {
              name: value.name,
              username: data.username,
              organ: data?.organs?.map((i) => i.abbrName)?.join(','),
              mobile: value.mobile,
              email: value.email,
              position: value.position,
              roleName: data?.role?.name,
            };
            setFieldsValue(obj);
            userStore.setUserInfo(obj);
          });
        },
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
