<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #treeSelect="{ model, field }">
        <TreeSelect
          v-model:value="model[field]"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择组织"
          allow-clear
          :defaultValue="defaultValue"
          tree-default-expand-all
          :tree-data="treeData"
          :field-names="{
            children: 'children',
            label: 'abbrName',
            value: 'id',
          }"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Api from '../api';
  import { TreeSelect } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm, TreeSelect },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const version = ref('');
      const treeData = ref([]);
      const defaultValue = ref('');

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 150,
        schemas: [
          {
            field: 'parentId',
            component: 'Select',
            label: '父级组织',
            slot: 'treeSelect',
            colProps: {
              span: 16,
            },
          },
          {
            field: 'name',
            label: '组织名称',
            component: 'Input',
            // componentProps: { disabled: isUpdate },
            required: true,
            colProps: {
              span: 16,
            },
          },

          {
            field: 'abbrName',
            label: '组织简称',
            component: 'Input',
            colProps: {
              span: 16,
            },
            rules: [
              {
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  } else {
                    const role = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,14}$/;
                    const regular = new RegExp(role);
                    if (!regular.test(value)) {
                      return Promise.reject(
                        '组织简称不得包含下划线以外的特殊字符！且长度不得超过14个字符！',
                      );
                    } else {
                      return Promise.resolve();
                    }
                  }
                },
              },
            ],
          },
        ],
        showActionButtonGroup: false,
      });
      const { createMessage } = useMessage();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });

        isUpdate.value = !!data?.isUpdate;
        defaultValue.value = data.treeValue;
        setFieldsValue({
          parentId: data.treeValue,
        });
        Api.getOrganTree().then((res) => {
          treeData.value = res;
        });
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          version.value = data.record.version;

          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增组织' : '编辑组织'));
      // 表单提交
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (!unref(isUpdate)) {
            Api.addOrganList({ data: { ...values } }).then(() => {
              createMessage.success('新增成功');
              emit('success', {
                isUpdate: unref(isUpdate),
                values: { ...values, id: rowId.value },
              });
            });
          } else {
            Api.editOrganList({
              data: { ...values, version: version.value },
              pathVars: { id: rowId.value },
            }).then(() => {
              createMessage.success('编辑成功');
              emit('success', {
                isUpdate: unref(isUpdate),
                values: { ...values, id: rowId.value },
              });
            });
          }
          // }
          closeModal();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        defaultValue,
        treeData,
        isUpdate,
      };
    },
  });
</script>
