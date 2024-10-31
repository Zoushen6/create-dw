<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
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
      <template #pageSelect="{ model, field }">
        <TreeSelect
          v-model:value="model[field]"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择页面"
          allow-clear
          tree-default-expand-all
          :tree-data="onlineList"
          :field-names="{
            children: 'children',
            label: 'name',
            value: 'key',
          }"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { TreeSelect, Cascader } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import Api from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ModalSchema } from './data';
  import { getTreeList, getOnlineList, transformPath2Amis } from './hooks/useTree';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm, TreeSelect, Cascader },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const version = ref('');
      const treeData = ref([]);
      const permissionsData = ref([]);
      const userStore = useUserStore();
      const onlineList = ref([]);
      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: ModalSchema,
        showActionButtonGroup: false,
      });
      const { createMessage } = useMessage();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (data.disabled) {
          updateSchema([
            {
              field: 'path',
              label: '路径',
              component: 'Input',
              required: true,
              componentProps: {
                disabled: true,
              },
              colProps: {
                span: 18,
              },
            },
          ]);
          setFieldsValue({
            ...data.record,
          });
        }
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          version.value = data.record.version;
          const val = transformPath2Amis(data.record);
          val.permission = filterPermission(data.record.permission);
          setFieldsValue({
            ...val,
          });
        }
      });
      // 权限字段回显过滤
      const filterPermission = (value) => {
        let obj: Array<string> = [];
        let treeData: Array<any> = JSON.parse(JSON.stringify(userStore.getRoleTree));
        treeData.forEach((item) => {
          item.children.forEach((i) => {
            if (i.value == value) {
              obj.push(item.value);
              obj.push(i.value);
            }
          });
        });

        return obj;
      };

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
      // 表单提交
      async function handleSubmit() {
        try {
          const values = await validate();

          const val = transformPath2Amis(values);
          let obj = JSON.parse(JSON.stringify(val));
          if (val.permission?.length && val.permission.length != 0) {
            obj.permission = val.permission[val.permission?.length - 1];
          } else {
            delete obj.permission;
          }
          setModalProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            Api.putMenuPage({
              data: { ...obj, version: version.value },
              pathVars: { id: rowId.value },
            }).then(() => {
              createMessage.success('编辑成功');
              emit('success', { isUpdate: unref(isUpdate), values: { ...obj, id: rowId.value } });
            });
          } else {
            Api.addMenuPage({ data: { ...obj } }).then(() => {
              createMessage.success('新建成功');
              emit('success', { isUpdate: unref(isUpdate), values: { ...obj, id: rowId.value } });
            });
          }
          // }
          closeModal();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      onMounted(async () => {
        treeData.value = await getTreeList();
        permissionsData.value = userStore.getRoleTree;
        onlineList.value = await getOnlineList();
      });
      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
        permissionsData,
        onlineList,
      };
    },
  });
</script>
