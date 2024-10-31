<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Api from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const version = ref('');
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 150,
        schemas: [
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            // componentProps: { disabled: true },
            required: true,
            colProps: {
              span: 16,
            },
          },
          {
            field: 'authority',
            label: '权限值',
            required: true,
            component: 'Input',
            dynamicDisabled: ({}) => {
              return unref(isUpdate);
            },
            // componentProps: { disabled: true },
            colProps: {
              span: 16,
            },
          },
          {
            field: 'category1',
            label: '类别1',
            component: 'Input',
            // componentProps: { disabled: true },
            colProps: {
              span: 16,
            },
          },
          {
            field: 'category2',
            label: '类别2',
            component: 'Input',
            // componentProps: { disabled: true },
            colProps: {
              span: 16,
            },
          },
          {
            field: 'description',
            label: '描述',
            component: 'Input',
            // componentProps: { disabled: true },
            colProps: {
              span: 16,
            },
          },
          {
            field: 'showed',
            label: '是否显示',
            component: 'Switch',
            colProps: {
              span: 16,
            },
          },
        ],
        showActionButtonGroup: false,
      });
      const { createMessage } = useMessage();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          version.value = data.record.version;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增权限' : '编辑权限'));
      // 表单提交
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            Api.putPermissions({
              data: { ...values, version: version.value },
              pathVars: { id: rowId.value },
            }).then(() => {
              createMessage.success('编辑成功');
              closeModal();
              emit('success', {
                isUpdate: unref(isUpdate),
                values: { ...values, id: rowId.value },
              });
            });
          } else {
            Api.addPermissions({ data: { ...values } }).then(() => {
              createMessage.success('新建成功');
              closeModal();
              emit('success', {
                isUpdate: unref(isUpdate),
                values: { ...values, id: rowId.value },
              });
            });
          }
          // }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>
