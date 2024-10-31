<template>
  <Card>
    <div class="config">
      <h3>{{ isUpdate ? '编辑角色' : '新建角色' }}</h3>
      <Form :model="formState" :wrapper-col="wrapperCol" @finish="onSubmit" layout="vertical">
        <FormItem
          label="角色名称"
          name="name"
          :rules="[{ required: true, validator: validatorName }]"
        >
          <a-input
            :disabled="!hasPermission(['role:setting']) || formState.authority === 'administrator'"
            v-model:value.trim="formState.name"
            placeholder="请填写角色名称"
          />
        </FormItem>
        <FormItem name="description" label="角色描述">
          <a-input
            :disabled="!hasPermission(['role:setting']) || formState.authority === 'administrator'"
            v-model:value="formState.description"
            placeholder="请填写角色描述"
          />
        </FormItem>

        <FormItem>
          <template #label>
            <div class="label_box">
              <span> 功能操作权限 </span>
              <span id="dropdown_form">
                <Dropdown
                  :disabled="
                    !hasPermission(['role:setting']) || formState.authority === 'administrator'
                  "
                  :trigger="['click']"
                >
                  <a class="ant-dropdown-link" @click.prevent>
                    从已有角色创建
                    <DownOutlined />
                  </a>
                  <template #overlay>
                    <Menu @click="menuItemClick">
                      <MenuItem v-for="item in roleSelectList" :key="item.id">
                        {{ item.name }}
                      </MenuItem>
                    </Menu>
                  </template>
                </Dropdown>
              </span>
            </div>
          </template>
          <table v-if="tableData">
            <tbody>
              <tr class="tr" v-for="(item, index) in tableData" :key="index">
                <td class="table_title">
                  <strong>{{ item.label }}</strong>
                </td>
                <td style="padding: 10px 10px">
                  <CheckboxGroup
                    :disabled="
                      !hasPermission(['role:setting']) || formState.authority === 'administrator'
                    "
                    v-model:value="item.relatedCheckValue"
                  >
                    <Checkbox v-for="i in item.children" :key="i.id" :value="i.id">
                      {{ i.label }}

                      <Tooltip placement="top" v-if="i.description">
                        <template #title>
                          <span>{{ i.description }}</span>
                        </template>
                        <Icon icon="ion:help-circle-outline" />
                      </Tooltip>
                    </Checkbox>
                  </CheckboxGroup>
                </td>
              </tr>
            </tbody>
          </table>
        </FormItem>
        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <a-button
            html-type="submit"
            type="primary"
            :disabled="!hasPermission(['role:setting']) || formState.authority === 'administrator'"
            >确认</a-button
          >
          <a-button style="margin-left: 10px" @click="handleAction('goBack')">返回</a-button>
        </FormItem>
      </Form>
    </div>
  </Card>
</template>

<script lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Checkbox, Form, Card, Tooltip, Dropdown, Menu } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Api from '../api';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { useUserStore, useUserStoreWithOut } from '/@/store/modules/user';
  import Icon from '/@/components/Icon';
  import type { MenuProps } from 'ant-design-vue';
  export default {
    components: {
      Checkbox,
      CheckboxGroup: Checkbox.Group,
      Tooltip,
      Icon,
      Form,
      FormItem: Form.Item,
      Dropdown,
      Menu,
      MenuItem: Menu.Item,
      Card,
      DownOutlined,
    },
    setup() {
      const router = useRouter();
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();
      const formState: any = reactive({
        name: '', // 角色名称
        region: undefined, // 已有角色校验
        description: '', // 角色说明
        permissions: [], // 权限数组
      });
      const roleSelectList: any = ref([]);
      const userStore: any = useUserStore();
      const userStoreWithOut = useUserStoreWithOut();
      const tableData: any = ref([]);
      let isUpdate = ref(false);

      let roleTree = userStore.getRoleTree;

      tableData.value = roleTree;
      // 请求已有角色
      Api.getRulesList().then((res) => {
        roleSelectList.value = res.content;
      });
      // 已有角色创建
      const menuItemClick: MenuProps['onClick'] = ({ key }) => {
        let a: any = roleSelectList.value.filter((i) => i.id === key)[0];
        tableData.value.forEach((item) => {
          let arr: any = [];
          item.children.forEach((i) => {
            if (a.permissions.includes(i.value)) {
              arr.push(i.value);
            }
          });
          item.relatedCheckValue = arr;
        });
      };

      // 侦听选择的权限，去重后作为传参
      watch(
        () => tableData.value,
        (val) => {
          let arr = val.map((item) => {
            return [...item.relatedCheckValue];
          });
          formState.permissionIds = [...new Set(arr.flat(Infinity))];
        },
      );

      // 确认，提交
      const onSubmit = () => {
        // 过滤多余字段，然后扁平加去重
        let arr = tableData.value.map((item) => {
          return [...item.relatedCheckValue];
        });

        // 数组扁平加去重
        formState.permissionIds = [...new Set(arr.flat(Infinity))];
        // 判断是新增还是编辑
        if (isUpdate.value == true) {
          Api.editRule({ data: { ...formState }, pathVars: { id: formState.id } }).then(() => {
            router
              .push({
                path: '/setting/feat/role',
              })
              .then(() => {
                if (userStore.getUserInfo?.role.id === formState.id) {
                  reloadCurrentPage();
                }
              });
            createMessage.success('角色编辑成功');
          });
        } else {
          Api.addRule({ data: formState }).then(() => {
            router.push({
              path: '/setting/feat/role',
            });
            createMessage.success('角色新增成功');
          });
        }
      };

      // 回显
      const current: any = router.currentRoute.value?.query;

      if (current?.data) {
        const obj: any = JSON.parse(current?.data);
        console.log(obj);

        isUpdate.value = true;
        formState.name = obj.name;
        formState.id = obj.id;
        formState.description = obj.description;
        formState.authority = obj.authority;
        formState.version = obj.version;
        tableData.value.forEach((item) => {
          let arr: any = [];
          item.children.forEach((li) => {
            if (obj?.permissions?.map((i) => i.id).includes(li.id)) {
              arr.push(li.id);
            }
          });
          item.relatedCheckValue = arr;
        });
      } else {
        isUpdate.value = false;
        tableData.value = tableData.value.map((i) => {
          i.relatedCheckValue = [];
          return i;
        });
      }
      // 返回
      const handleAction = (type) => {
        if (type === 'goBack') {
          router.push('/setting/feat/role');
        }
      };
      // 角色名称校验
      const validatorName = async (_, value) => {
        if (!value) {
          return Promise.reject('角色名称不得为空');
        } else {
          const role = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,14}$/;
          const regular = new RegExp(role);
          if (!regular.test(value)) {
            return Promise.reject('角色名称不得包含下划线以外的特殊字符！且长度不得超过14个字符！');
          } else {
            return Promise.resolve();
          }
        }
      };
      // 编辑角色要是当前用户角色刷新页面
      const reloadCurrentPage = () => {
        userStoreWithOut.afterLoginAction(true);
        // 刷新浏览器
        location.reload();
      };
      return {
        validatorName,
        isUpdate,
        hasPermission,
        formState,
        onSubmit,
        wrapperCol: {
          span: 24,
        },
        tableData,
        menuItemClick,
        roleSelectList,
        handleAction,
      };
    },
  };
</script>

<style lang="less" scoped>
  .config {
    width: 100%;
    height: 100%;
    padding: 24px 36px;
    overflow-y: scroll;

    h3 {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .ant-form-item {
    margin-bottom: 10px;
  }

  .module_instructions {
    display: flex;
    flex-direction: column;
    border: 1px solid #dadee3;
    border-collapse: collapse;
    border-radius: 0.28571429rem;
    padding: 0.71428571em 1.14285714em;

    span {
      margin-bottom: 0.75em;
    }
  }

  table {
    border: 1px solid rgba(239, 239, 239);
    border-collapse: collapse;
    // border-color: #dadee3;
    width: 100%;

    tbody {
      display: table-row-group;
      vertical-align: middle;
      border-color: inherit;

      tr {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
      }
    }
  }

  .tr {
    border-bottom: 1px solid rgb(239, 239, 239);
    border-collapse: collapse;
  }

  .table_title {
    border-right: 1px solid rgba(239, 239, 239);
    border-collapse: collapse;
    width: 90px;
    text-align: right;
    padding: 5px 10px;
  }

  .table_cell {
    border-bottom: 1px solid rgba(239, 239, 239);
    border-collapse: collapse;
  }

  .cell {
    padding: 10px 0;
    border-bottom: 1px solid rgba(239, 239, 239);
    border-collapse: collapse;

    label {
      width: 90px;
      display: inline-block;
      // background-color: pink;
      font-weight: 600;
      margin: 0 5px;
    }
  }

  .label_box {
    position: relative;
    width: 100vw;
    display: flex;
    justify-content: space-between;
  }

  #dropdown_form {
    margin-left: 40px;
  }

  // ::v-deep.ant-checkbox + span {
  //   padding: 0 1px;
  // }

  .cell:last-child {
    border: none;
  }
</style>
