<template>
  <div>
    <Card>
      <div class="securitySettings">
        <h3>安全设置</h3>
        <div class="security">
          <div class="cell">
            <Switch
              :disabled="!hasPermission(['security:setting'])"
              v-model:checked="formData.value.loginCaptchaEnabled"
            />
            <span>登录密码连续错误</span>
            <Select
              ref="select"
              style="margin-left: 5px"
              :disabled="!hasPermission(['security:setting'])"
              :options="options1"
              v-model:value="formData.value.loginCaptchaErrorLimit"
            />
            <span>次后启用验证码验证登录</span>
          </div>
          <div class="cell">
            <Switch
              :disabled="!hasPermission(['security:setting'])"
              v-model:checked="formData.value.passwordErrorLockEnabled"
            />

            <span>登录密码连续错误</span>
            <Select
              ref="select"
              :options="options1"
              style="margin-left: 5px"
              :disabled="!hasPermission(['security:setting'])"
              v-model:value="formData.value.passwordErrorLimit"
            />
            <span>次后锁定该成员访问系统</span>
          </div>
          <div class="cell">
            <Switch
              :disabled="!hasPermission(['security:setting'])"
              v-model:checked="formData.value.passwordExpireLockEnabled"
            />
            <Select
              ref="select"
              :disabled="!hasPermission(['security:setting'])"
              v-model:value="formData.value.passwordExpireMonths"
              :options="options2"
            />
            <span>个月修改一次密码，否则锁定该成员访问系统</span>
          </div>
          <div class="cell">
            <Switch
              :disabled="!hasPermission(['security:setting'])"
              v-model:checked="formData.value.tokenActivityTimeoutEnabled"
            />
            <Select
              ref="select"
              :options="options3"
              :disabled="!hasPermission(['security:setting'])"
              v-model:value="formData.value.tokenActivityTimeout"
            />
            <span>分钟不活动则Web登录会话失效</span>
          </div>
        </div>
        <div class="watermark">
          <!-- <p>密码复杂度校验可配</p> -->
          <div>
            <Switch
              :disabled="!hasPermission(['security:setting'])"
              v-model:checked="formData.value.passwordFormatEnabled"
            />
            密码格式校验
            <!-- {{ formData.value.value ? '已开启' : '开启' }} -->
          </div>
          <!-- <div class="watermark_desc"
            >开启后新建用户和修改密码的校验强度可以配置，保障用户密码安全</div
          > -->
        </div>
        <div class="cell_checkbox">
          <!-- <Checkbox
            :disabled="!formData.value.passwordFormatEnabled"
            v-model:checked="formData.value.value1"
          /> -->
          <span>密码长度 最低 </span>
          <Select
            ref="select"
            v-model:value="formData.value.passwordFormatLengthMin"
            :disabled="
              !formData.value.passwordFormatEnabled || !hasPermission(['security:setting'])
            "
            :options="options2"
          />位
          <span> 最高 </span>
          <Select
            ref="select"
            v-model:value="formData.value.passwordFormatLengthMax"
            :disabled="
              !formData.value.passwordFormatEnabled || !hasPermission(['security:setting'])
            "
            :options="options2"
          />位
        </div>
        <div class="cell_checkbox">
          <Checkbox
            v-model:checked="formData.value.passwordFormatHasLetter"
            :disabled="
              !formData.value.passwordFormatEnabled || !hasPermission(['security:setting'])
            "
          />
          <span>必须包含字母 </span>
        </div>
        <div class="cell_checkbox">
          <Checkbox
            v-model:checked="formData.value.passwordFormatBothCase"
            :disabled="
              !formData.value.passwordFormatEnabled || !hasPermission(['security:setting'])
            "
          />
          <span>必须同时包含大小写字母 </span>
        </div>

        <div class="cell_checkbox">
          <Checkbox
            v-model:checked="formData.value.passwordFormatHasNum"
            :disabled="
              !formData.value.passwordFormatEnabled || !hasPermission(['security:setting'])
            "
          />
          <span>必须包含数字 </span>
        </div>
        <div class="cell_checkbox">
          <Checkbox
            v-model:checked="formData.value.passwordFormatSymbol"
            :disabled="
              !formData.value.passwordFormatEnabled || !hasPermission(['security:setting'])
            "
          />
          <span>必须包含特殊字符 ({{ formData.value.passwordFormatSymbols }})</span>
        </div>
        <div class="warning_mode watermark">
          <p>预警通知</p>
          <div class="email"
            ><span style="display: inline-block; margin-top: 3px">预警邮箱设置：</span>
            <a-input
              style="width: 400px"
              enter-button="添加"
              v-model:value="emailVal"
              placeholder="请输入邮箱"
            />
            <a-button type="primary" @click="addEmail">添加</a-button>
          </div>
          <div class="tag_list">
            <Tag v-for="(item, index) in taglist" :key="index" closable @close="delTag">{{
              item
            }}</Tag>
          </div>
        </div>
        <div class="watermark">
          <p>水印设置</p>
          <div>
            <Switch
              :disabled="!hasPermission(['security:setting'])"
              v-model:checked="formData.value.watermarkEnabled"
            />
            {{ formData.value.watermarkEnabled ? '已开启' : '开启' }}
          </div>
          <div class="watermark_desc"
            >开启后，将在所有页面显示当前使用者的姓名+手机号后4位或邮箱前缀，防止截屏泄密，保证企业信息安全</div
          >
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
  import { reactive, ref, watch, onUnmounted } from 'vue';
  import { Switch, Card, Select, Checkbox, Tag } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Api from '../api';
  import publicApi from '/@/modules/api/index';
  import { regularFun } from '/@/utils/public';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default {
    components: { Switch, Card, Select, Checkbox, Tag },
    setup() {
      const taglist: any = ref([]);
      const emailVal = ref(null);
      const value1 = ref('5');
      const checked = ref(true);
      const { hasPermission } = usePermission();
      const formData = reactive({
        value: {
          watermarkEnabled: false,
          tokenActivityTimeoutEnabled: false,
          tokenActivityTimeout: 0,
          passwordErrorLockEnabled: false,
          passwordExpireMonths: 0,
          passwordExpireLockEnabled: false,
          loginCaptchaEnabled: false,
          passwordErrorLimit: 0,
          loginCaptchaErrorLimit: 0,
          // ====================================================================================================
          passwordFormatEnabled: false, // 是否开启密码强度校验
          passwordFormatBothCase: true, // 必须包含大小写字符
          passwordFormatHasLetter: false, // 必须包含小写字母
          passwordFormatHasNum: true, // 必须包含数字
          passwordFormatSymbol: false, // 必须包含特殊字符
          passwordFormatSymbols: null, // 特殊字符表
          passwordFormatLengthMin: 6, // 密码的最小长度
          passwordFormatLengthMax: 24, // 密码的最大长度
          // ====================================================================================================
        },
      });
      const userStore = useUserStore();
      const { createMessage } = useMessage();
      // 水印开关
      publicApi.getSecurity().then((res) => {
        formData.value = {
          ...res,
        };
        userStore.setWatermark(res.watermarkEnabled);
      });
      // 修改函数
      let num = 1;
      function editSecurityInfo(data) {
        if (num !== 1) {
          Api.editSecurity({ data }).then(() => {
            createMessage.success('操作成功');
          });
        }
        num += num;
      }
      watch(
        () => formData.value,
        (val) => {
          regularFun(val);
          userStore.setWatermark(formData.value.watermarkEnabled);
          editSecurityInfo({ ...formData.value });
        },
        {
          deep: true,
        },
      );
      onUnmounted(() => {
        num = 1;
      });

      // 点击添加邮箱按钮
      const addEmail = () => {
        console.log(emailVal.value);
        taglist.value.push(emailVal.value);
      };

      // 删除邮箱
      const delTag = () => {};
      return {
        checked,
        emailVal,
        value1,
        delTag,
        hasPermission,
        formData,
        addEmail,
        taglist,
        options1: [...Array(9)].map((_, i) => {
          return { label: i + 2, value: i + 2 };
        }),
        options2: [...Array(22)].map((_, i) => {
          return { label: i + 3, value: i + 3 };
        }),
        options3: [...Array(22)].map((_, i) => {
          return { label: (i + 3) * 10, value: (i + 3) * 10 };
        }),
      };
    },
  };
</script>

<style lang="less" scoped>
  .securitySettings {
    width: 100%;
    padding: 24px 36px;
    color: #2e405e;
  }

  h3 {
    font-size: 24px;
    font-weight: bold;
  }

  .cell {
    margin-bottom: 15px;

    .ant-switch {
      margin-right: 20px;
    }

    .ant-select {
      width: 70px !important;
      margin-right: 5px;
    }
  }

  .cell_checkbox {
    margin-left: 4.9%;
    margin-bottom: 10px;

    span {
      margin-left: 5px;
    }
  }

  .watermark {
    p {
      font-size: 16px;
      font-weight: bold;
    }

    .watermark_desc {
      margin-left: 50px;
      color: #909aaa;
      font-size: 13px;
    }
  }

  .warning_mode {
    margin-bottom: 10px;
  }

  .tag_list {
    margin-top: 10px;
  }
</style>
