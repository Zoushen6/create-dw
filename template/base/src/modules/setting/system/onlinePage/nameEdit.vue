<template>
  <BasicModal
    v-bind="$attrs"
    :width="550"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #jsonEditor="{ model, field }">
        <CodeEditor :key="Math.random()" v-model:value="model[field]" :mode="MODE.JSON" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Api from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm, CodeEditor },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const version = ref('');
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'symbol',
            label: '唯一标识',
            component: 'Input',
            // componentProps: { disabled: true },
            required: true,
            colProps: {
              span: 22,
            },
          },
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            required: true,
            colProps: {
              span: 22,
            },
          },
          {
            field: 'description',
            label: '描述',
            component: 'InputTextArea',
            colProps: {
              span: 22,
            },
          },
          {
            field: 'pageData',
            label: '数据',
            component: 'Input',
            slot: 'jsonEditor',
            // componentProps: { disabled: true },
            colProps: {
              span: 22,
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
          console.log(data.record);

          rowId.value = data.record.id;
          version.value = data.record.version;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
      // 表单提交
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            Api.putOnlinePage({
              data: { ...values, version: version.value },
              pathVars: { id: rowId.value },
            }).then(() => {
              createMessage.success('编辑成功');
            });
          } else {
            Api.addOnlinePage({ data: { ...values } }).then(() => {
              createMessage.success('新建成功');
            });
          }
          // }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        MODE,
      };
    },
  });
</script>
