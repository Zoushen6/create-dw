<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        autocomplete="username"
        class="fix-auto-fill"
      >
        <template #addonAfter>
          <Select
            style="max-width: 100px; min-width: 100px"
            v-model:value="lesseeValue"
            :options="lessesList"
            :fieldNames="{
              label: 'name',
              value: 'symbol',
            }"
          />
        </template>
      </Input>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        autocomplete="current-password"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="24">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <div style="width: 100%; display: flex; justify-content: space-between">
            <Checkbox v-model:checked="rememberMe" size="small">
              {{ t('sys.login.rememberMe') }}
            </Checkbox>
            <Button size="small" @click="setLoginState(LoginStateEnum.MOBILE)">
              {{ t('sys.login.mobileSignInFormTitle') }}
            </Button>
          </div>
        </FormItem>
      </ACol>
      <ACol :span="12" v-show="isShowSlider">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>

    <div style="width: 278px; height: 285px; position: absolute; top: 10%" v-if="isShowSlider">
      <Slider @getImg="getImg" @validImg="submitCaptcha" @close="closeCaptcha" />
    </div>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import Slider from './slider.vue';
  import { Checkbox, Form, Input, Row, Col, Button, Select } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import md5 from 'blueimp-md5';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import Api from '/@/modules/api/index';
  const lesseeValue: any = ref(null);
  // const SelectOption = Select.Option;
  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createMessage } = useMessage();
  const userStore = useUserStore();
  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const isShowSlider = ref(false);
  const formData = reactive({
    account: '',
    password: '',
  });
  const lessesList: any = ref([]);

  const localData = JSON.parse(localStorage.getItem('loginFormData') || '{}');
  if (localData?.rememberMe) {
    rememberMe.value = localData.rememberMe;
    formData.account = localData.account;
    formData.password = localData.password;
  }
  const { validForm } = useFormValid(formRef);

  Api.getLessesList({
    onCatch: () => {
      createMessage.error('请求租户失败，请联系管理员查看！');
    },
  }).then((res) => {
    lessesList.value = res;
    lesseeValue.value = res[0].symbol;
  });
  // 获取当前系统名称和logo
  Api.getBasic().then((res) => {
    // document.querySelector('.c_title')
    document.title = res.systemName;
    localStorage.setItem('project_title', res.systemName);

    document.querySelector('.c_logo').href = res.systemLogoUrl;
    document.querySelector('.c_title').innerText = res.systemName;
  });
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  const getImg = (callback) => {
    // 获取验证码
    validForm().then((res) => {
      Api.getCaptcha({ params: { username: res.account } }).then((res) => {
        callback({
          ...res.captcha,
          startSlidingTime: new Date(),
        });
      });
    });
  };
  const submitCaptcha = async (timeData, id, captchaData, arrPath, callback) => {
    // 用户填写信息movePercent
    const data = await validForm();

    if (!data) return;

    let obj = {
      username: data.account,
      password: md5(data.password),

      captchaId: id,
      captchaTrack: {
        ...timeData,
        bgImageHeight: captchaData.captcha.backgroundImageHeight,
        bgImageWidth: captchaData.captcha.backgroundImageWidth,
        sliderImageWidth: captchaData.captcha.sliderImageWidth,
        sliderImageHeight: captchaData.captcha.sliderImageHeight,
        trackList: arrPath,
      },
    };
    if (lesseeValue.value) {
      obj.username = obj.username + '@' + lesseeValue.value;
    }

    // 验证码请求参数
    try {
      const userInfo = await userStore.login(obj);
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
          duration: 3,
        });
        callback(true);
      }
    } catch (error) {
      loading.value = false;
      callback(false);
    }
    // 记住用户
    if (rememberMe.value) {
      data.rememberMe = true;
      localStorage.setItem('loginFormData', JSON.stringify(data));
    } else {
      data.rememberMe = false;
      data.account = undefined;
      data.password = undefined;
      localStorage.setItem('loginFormData', JSON.stringify(data));
    }
    loading.value = false;
  };
  const closeCaptcha = () => {
    isShowSlider.value = false;
  };
  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    loading.value = true;
    let showCaptcha;
    await Api.getCaptcha({ params: { username: data.account } })
      .then((res) => {
        showCaptcha = res.show;
      })
      .catch(() => {
        loading.value = false;
      });

    if (showCaptcha != undefined && showCaptcha != null && showCaptcha == true) {
      isShowSlider.value = true;
    } else if (showCaptcha != undefined && showCaptcha != null && showCaptcha == false) {
      if (lesseeValue.value) {
        data.account = data.account + '@' + lesseeValue.value;
      }
      try {
        const userInfo = await userStore.login({
          password: md5(data.password),
          username: data.account,
          // mode: 'none', //不要默认的错误提示
        });
        if (userInfo) {
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
            duration: 3,
          });
        }
      } finally {
        // 记住用户
        if (rememberMe.value) {
          data.rememberMe = true;
        } else {
          data.rememberMe = false;
          data.account = undefined;
          data.password = undefined;
        }
        localStorage.setItem('loginFormData', JSON.stringify(data));

        loading.value = false;
        console.log('finally');
      }
    }
  }
</script>

<style lang="less" scoped>
  ::v-deep .ant-select-dropdown {
    width: 200px !important;
    max-width: 100px;
  }
</style>
