<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Api from '../../../api';
  // import { TreeSelect } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const version = ref('');
      const defaultValue = ref('');
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 150,
        schemas: [
          {
            field: 'name',
            label: '租户名称',
            component: 'Input',
            // componentProps: { disabled: isUpdate },
            required: true,
            colProps: {
              span: 16,
            },
          },

          {
            field: 'symbol',
            label: '租户唯一标识',
            component: 'Input',
            colProps: {
              span: 16,
            },
            required: true,
            rules: [
              {
                validator: async (_, value) => {
                  if (value) {
                    const role = /^[A-Za-z0-9_-]+$/;
                    const regular = new RegExp(role);

                    if (regular.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('唯一标示只能是数字、字母、中横线和下划线');
                    }
                  }
                },
              },
            ],
          },
          {
            field: 'tenantSchema',
            label: '数据库模式',
            component: 'Input',
            // componentProps: { disabled: isUpdate },
            required: true,
            rules: [
              {
                validator: async (_, value) => {
                  if (value) {
                    const role = /^[A-Za-z0-9_]+$/;
                    const first = /^[0-9]/;
                    const regular = new RegExp(role);
                    const regularFirst = new RegExp(first);
                    console.log(regularFirst.test(value.split('')[0]));
                    if (regularFirst.test(value.split('')[0])) {
                      return Promise.reject('数据库模式不能以数字开头');
                    }
                    if (regular.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('数据库模式只能是数字、字母、下划线');
                    }
                  }
                },
              },
            ],
            colProps: {
              span: 16,
            },
          },
          {
            field: 'description',
            label: '描述',
            component: 'InputTextArea',
            // componentProps: { disabled: isUpdate },
            // required: true,
            colProps: {
              span: 16,
            },
          },
          {
            field: 'enabled',
            label: '是否启用',
            component: 'Switch',
            // componentProps: { disabled: isUpdate },
            required: true,
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
        defaultValue.value = data.treeValue;
        setFieldsValue({
          parentId: data.treeValue,
        });
        // Api.getOrganTree().then((res) => {
        //   treeData.value = res;
        // });
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          version.value = data.record.version;

          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'));
      // 表单提交
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (!unref(isUpdate)) {
            Api.addLessee({ data: { ...values } }).then(() => {
              createMessage.success('新增成功');
              emit('success', {
                isUpdate: unref(isUpdate),
                values: { ...values, id: rowId.value },
              });
            });
          } else {
            Api.putLessee({
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
        // treeData,
        isUpdate,
      };
    },
  });
</script>
