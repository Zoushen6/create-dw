<template>
  <Card class="generation_class">
    <Row type="flex">
      <Col :span="4">
        <div>数据库表</div>
        <div class="generation_left_class">
          <Tabs style="margin-top: 20px" v-model:activeKey="activeValue" tab-position="left">
            <TabPane v-for="item in leftList" :key="item" :tab="item" />
          </Tabs>
        </div>
      </Col>
      <Col :span="12">
        <Card :title="formTitle" :bordered="false">
          <BasicForm @register="register" @submit="handleSubmit">
            <template #levelTree="{ model, field }">
              <TreeSelect
                v-model:value="model[field]"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择父级目录"
                allow-clear
                tree-default-expand-all
                :tree-data="treeData"
                :field-names="{
                  children: 'children',
                  label: 'title',
                  value: 'key',
                }"
              />
            </template>
            <template #permissionTree="{ model, field }">
              <Cascader
                v-model:value="model[field]"
                style="width: 100%"
                placeholder="请选择权限"
                allow-clear
                :multiple="false"
                :options="permissionsData"
                change-on-select
              />
            </template>
          </BasicForm>
        </Card>
      </Col>
    </Row>
  </Card>
</template>

<script lang="ts" setup>
  import { Card, Row, Col, Tabs, TreeSelect, Cascader } from 'ant-design-vue';
  import { ref, onMounted, computed } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { getTreeList } from '../menu/hooks/useTree';
  import Api from '../../api';
  const TabPane = Tabs.TabPane;
  const userStore = useUserStore();
  const permissionsData = ref([]);
  const treeData = ref([]);
  const schemas: FormSchema[] = [
    {
      field: 'openMode',
      label: '操作',
      component: 'CheckboxGroup',
      colProps: {
        span: 18,
      },
      // defaultValue: 'INLINE',
      componentProps: {
        options: [
          {
            label: '增加',
            value: 'ADD',
            key: 'ADD',
          },
          {
            label: '删除',
            value: 'DELETE',
            key: 'DELETE',
          },
          {
            label: '修改',
            value: 'EDIT',
            key: 'EDIT',
          },
        ],
      },
    },
    {
      field: 'parentId',
      label: '父级目录',
      component: 'Select',
      required: false,
      colProps: {
        span: 18,
      },
      slot: 'levelTree',
    },
    {
      field: 'menuName',
      label: '菜单名称',
      component: 'Input',
      required: true,
      colProps: {
        span: 18,
      },
    },
    {
      field: 'route',
      label: '路由',
      component: 'Input',
      required: true,
      colProps: {
        span: 18,
      },
    },
    {
      field: 'permission',
      label: '权限',
      component: 'Select',
      required: false,
      colProps: {
        span: 18,
      },
      slot: 'permissionTree',
    },
    {
      field: 'icon',
      label: '图标',
      component: 'IconPicker',
      required: false,
      colProps: {
        span: 18,
      },
    },

    {
      field: 'sort',
      label: '顺序',
      component: 'InputNumber',
      colProps: {
        span: 18,
      },
    },
  ];
  const { createMessage } = useMessage();
  const leftList = ref([]);
  const activeValue = ref();
  const [register, { resetFields }] = useForm({
    labelWidth: 120,
    schemas,
    submitButtonOptions: {
      text: '确定',
    },
    resetButtonOptions: {
      text: '取消',
    },
    actionColOptions: {
      span: 12,
    },
  });
  Api.getCreateLabel().then((res) => {
    leftList.value = res;
    activeValue.value = res[0];
  });
  const formTitle = computed(() => {
    return leftList.value.filter((i) => i == activeValue.value)[0];
  });

  const handleSubmit = (values: any) => {
    let obj = JSON.parse(JSON.stringify(values));
    if (values.permission?.length && values.permission?.length != 0) {
      obj.permission = obj.permission[obj.permission.length - 1];
    } else {
      obj.permission = null;
    }
    if (!activeValue.value) {
      return;
    } else {
      obj.tableName = activeValue.value;
    }
    if (!values.openMode) {
      obj.needInsert = false;
      obj.needUpdate = false;
      obj.needDelete = false;
    } else {
      obj.needInsert = values.openMode.indexOf('ADD') !== -1;
      obj.needUpdate = values.openMode.indexOf('EDIT') !== -1;
      obj.needDelete = values.openMode.indexOf('DELETE') !== -1;
    }
    delete obj.openMode;
    Api.setCreateDev({ data: obj }).then(() => {
      createMessage.success('操作成功！');
      resetFields();
      activeValue.value = leftList.value[0];
    });
  };
  onMounted(async () => {
    treeData.value = await getTreeList();
    permissionsData.value = userStore.getRoleTree;
  });
</script>
<style lang="less" scoped>
  .generation_class {
    height: calc(100vh - 80px);

    .generation_left_class {
      display: inline-block;
      height: calc(100vh - 150px);
      overflow-y: scroll;
    }
  }

  ::v-deep .ant-tabs-nav {
    width: 180px;
  }
</style>
