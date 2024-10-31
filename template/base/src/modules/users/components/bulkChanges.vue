<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BulkUserForm } from '../data';
  // import Api from '/@/modules/api/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const rowIds = ref([]);
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 70,
        schemas: BulkUserForm,
        showActionButtonGroup: false,
        labelAlign: 'right',
        actionColOptions: {
          span: 12,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });

        rowIds.value = data.ids;
      });

      const getTitle = '批量修改用户';

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });

          let obj = values;
          obj.ids = rowIds.value;
          // 发送请求
          console.log(obj);

          // Api.editUsers({ pathVars: { id: rowId.value }, data: { ...obj } }).then(() => {
          createMessage.success('修改用户信息成功');
          closeModal();
          emit('success');
          // });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        // filterOption,
        // options,
        // institutionsOptions,
      };
    },
  });
</script>
