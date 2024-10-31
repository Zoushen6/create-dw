<template>
  <Card style="margin: 15px">
    <div class="config">
      <h3>{{ isUpdate ? '编辑角色' : '新建角色' }}</h3>
      <Form :model="formState" :wrapper-col="wrapperCol" @finish="onSubmit" layout="vertical">
        <FormItem label="从已有角色创建(选填)" name="region">
          <Select style="width: 280px" v-model:value="selectRoleInfo" placeholder="请选择角色">
            <SelectOption v-for="item in roleSelectList" :value="item.id" :key="item.id">{{
              item.name
            }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem
          label="角色名称"
          name="name"
          :rules="[{ required: true, validator: validatorName }]"
        >
          <a-input
            style="width: 280px"
            v-model:value.trim="formState.name"
            placeholder="请填写角色名称"
          />
        </FormItem>
        <FormItem name="description" label="角色描述">
          <a-input
            style="width: 280px"
            v-model:value="formState.description"
            placeholder="请填写角色描述"
          />
        </FormItem>

        <FormItem label="功能操作权限">
          <table>
            <tbody>
              <tr class="tr" v-for="(item, index) in tableData" :key="index">
                <td class="table_title">
                  <strong>{{ item.name }}</strong>
                </td>
                <td>
                  <div class="cell" v-for="(i, length) in item.children" :key="index + length">
                    <label for="">{{ i.name }}</label>
                    <CheckboxGroup v-model:value="i.relatedCheckValue" :options="i.children" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </FormItem>
        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <a-button html-type="submit" type="primary">确认</a-button>
          <a-button style="margin-left: 10px" @click="handleAction('goBack')">返回</a-button>
        </FormItem>
      </Form>
    </div>
  </Card>
</template>

<script lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Checkbox, Select, Form, Card } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Api from '../api';
  export default {
    components: {
      CheckboxGroup: Checkbox.Group,
      Select,
      SelectOption: Select.Option,
      Form,
      FormItem: Form.Item,
      Card,
    },
    setup() {
      const router = useRouter();
      const { createMessage } = useMessage();
      const formState: any = reactive({
        name: '', // 角色名称
        region: undefined, // 已有角色校验
        description: '', // 角色说明
        permissions: [], // 权限数组
      });
      const selectRoleInfo: any = ref();
      const roleSelectList: any = ref([]);
      const tableData: any = ref([
        // {
        //   name: '问卷',
        //   child: [
        //     {
        //       name: '问卷管理',
        //       related: [
        //         { label: '查看', value: 'questionnaire:view' },
        //         { label: '修改', value: 'questionnaire:export' },
        //       ],
        //       relatedCheckValue: [],
        //     },
        //   ],
        // },
        // {
        //   name: '用户',
        //   child: [
        //     {
        //       name: '用户管理',
        //       related: [
        //         { label: '查看', value: 'user:view' },
        //         { label: '新建', value: 'user:create' },
        //         { label: '修改', value: 'user:update' },
        //         // { label: '删除', value: 'user:delete' },
        //       ],
        //       relatedCheckValue: [],
        //     },
        //   ],
        // },
        // {
        //   name: '设置',
        //   child: [
        //     {
        //       name: '系统设置',
        //       related: [{ label: '管理', value: 'sys_setting:view' }],
        //       relatedCheckValue: [],
        //     },
        //   ],
        // },
      ]);
      // 请求已有角色
      Api.getRulesList().then((res) => {
        roleSelectList.value = res.content;
      });
      Api.getRoleTree().then((res) => {
        console.log(res);
        // let o = [
        //   {
        //     name: '任务管理',
        //     children: [
        //       {
        //         name: '查看',
        //         children: [],
        //         authority: 'task:view',
        //       },
        //       {
        //         name: '设置',
        //         children: [],
        //         authority: 'task:setting',
        //       },
        //     ],
        //     authority: 'task:view',
        //   },
        // ];
        let obj: any = [
          {
            name: '用户',
            children: [
              {
                name: '用户管理',
                children: [
                  { label: '查看', value: 'user:view' },
                  { label: '新建', value: 'user:create' },
                  { label: '修改', value: 'user:update' },
                  // { label: '删除', value: 'user:delete' },
                ],
                relatedCheckValue: [],
              },
            ],
          },
        ];
        // console.log(obj);
        tableData.value = obj;
      });

      let isUpdate = ref(true);
      // 已有角色创建
      watch(selectRoleInfo, (newVal) => {
        let a: any = roleSelectList.value.filter((i) => i.id === newVal)[0];
        tableData.value.forEach((item) => {
          item.children.forEach((i) => {
            let arr: any = [];
            i.children.forEach((il) => {
              if (a.permissions.includes(il.value)) {
                arr.push(il.value);
              }
            });
            i.relatedCheckValue = arr;
          });
        });
      });
      // 侦听选择的权限，去重后作为传参
      watch(
        () => tableData.value,
        (val) => {
          let arr = val.map((item) => {
            return [
              ...item.children.map((i) => {
                return [...i.relatedCheckValue];
              }),
            ];
          });
          formState.permissions = [...new Set(arr.flat(Infinity))];
        },
      );
      // 确认，提交
      const onSubmit = () => {
        // 过滤多余字段，然后扁平加去重
        let arr = tableData.value.map((item) => {
          return [
            ...item.children.map((i) => {
              return [...i.relatedCheckValue];
            }),
          ];
        });
        // 数组扁平加去重
        formState.permissions = [...new Set(arr.flat(Infinity))];

        // 判断是新增还是编辑
        if (isUpdate.value == true) {
          Api.editRule({ data: { ...formState, id: formState.id } }).then(() => {
            router.push({
              path: '/setting/feat/role',
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
      const obj = router.currentRoute.value.params;
      if (obj.name) {
        isUpdate.value = true;
        formState.name = obj.name;
        formState.id = obj.id;
        formState.description = obj.description;
        tableData.value.forEach((item) => {
          item.children.forEach((li) => {
            let arr: any = [];
            li.children.forEach((i) => {
              if (obj.permissions.includes(i.value)) {
                arr.push(i.value);
              }
            });
            li.relatedCheckValue = arr;
          });
        });
      } else {
        isUpdate.value = false;
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
      return {
        validatorName,
        isUpdate,
        formState,
        onSubmit,
        wrapperCol: {
          span: 24,
        },
        tableData,
        roleSelectList,
        handleAction,
        selectRoleInfo,
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
    width: 70px;
    text-align: center;
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

  // ::v-deep.ant-checkbox + span {
  //   padding: 0 1px;
  // }

  .cell:last-child {
    border: none;
  }
</style>
