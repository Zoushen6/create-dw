<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Api from '../../api';
  // import Api from '/@/modules/api/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const version = ref('');
      const rowId = ref('');
      const keyType = ref('');
      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'symbol',
            label: '配置项',
            component: 'Input',
            required: true,
            dynamicDisabled: ({}) => {
              return isUpdate.value;
            },
            colProps: {
              span: 12,
            },
          },
          {
            field: 'type',
            component: 'Select',
            label: '值的类型',
            colProps: {
              span: 12,
            },
            required: true,
            componentProps: {
              onChange: (e) => {
                keyType.value = e;
              },

              options: [
                {
                  label: 'string',
                  value: 'string',
                  key: '1',
                },
                {
                  label: 'integer',
                  value: 'integer',
                  key: '2',
                },
                {
                  label: 'bool',
                  value: 'bool',
                  key: '3',
                },
                {
                  label: 'datetime',
                  value: 'datetime',
                  key: '4',
                },
                {
                  label: 'date',
                  value: 'date',
                  key: '5',
                },
                {
                  label: 'time',
                  value: 'time',
                  key: '6',
                },
              ],
            },
            dynamicDisabled: ({}) => {
              // console.log(e);

              // 额外加是否内置
              return isUpdate.value;
            },
          },
          {
            field: 'value',
            label: '配置值',
            required: true,
            component: 'Input',
            colProps: {
              span: 12,
            },
          },
          {
            field: 'category1',
            label: '类别1',
            required: true,
            component: 'Input',
            colProps: {
              span: 12,
            },
            dynamicDisabled: ({}) => {
              return isUpdate.value;
            },
          },

          {
            field: 'pattern',
            label: '正则表达式',
            component: 'Input',
            ifShow: ({ values }) => {
              return values.type == 'string';
            },
            colProps: {
              span: 12,
            },
          },
          {
            field: 'minValue',
            label: '最小值',
            component: 'Input',
            ifShow: ({ values }) => {
              return values.type !== 'string' && values.type !== 'bool';
            },
            colProps: {
              span: 12,
            },
          },
          {
            field: 'maxValue',
            label: '最大值',
            component: 'Input',
            ifShow: ({ values }) => {
              return values.type !== 'string' && values.type !== 'bool';
            },
            colProps: {
              span: 12,
            },
          },
          {
            field: 'description',
            label: '描述',
            component: 'InputTextArea',
            colProps: {
              span: 24,
            },
          },
          // {
          //   field: 'builtIn',
          //   label: '是否内置',
          //   component: 'Switch',
          //   colProps: {
          //     span: 12,
          //   },
          // },
        ],
        showActionButtonGroup: false,
      });
      watch(
        () => keyType.value,
        (val) => {
          switch (val) {
            case 'string':
              updateSchema([
                {
                  field: 'value',
                  label: '配置值',
                  required: true,
                  component: 'Input',
                  colProps: {
                    span: 12,
                  },
                },
              ]);
              break;
            case 'integer':
              updateSchema([
                {
                  field: 'value',
                  label: '配置值',
                  required: true,
                  component: 'InputNumber',
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'minValue',
                  label: '最小值',
                  component: 'InputNumber',
                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'maxValue',
                  label: '最大值',
                  component: 'InputNumber',
                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
              ]);
              break;
            case 'bool':
              updateSchema([
                {
                  field: 'value',
                  label: '配置值',
                  required: true,
                  component: 'Select',
                  componentProps: {
                    options: [
                      {
                        label: 'true',
                        value: 'true',
                      },
                      {
                        label: 'false',
                        value: 'false',
                      },
                    ],
                  },
                  colProps: {
                    span: 12,
                  },
                },
              ]);
              break;
            case 'datetime':
              updateSchema([
                {
                  field: 'value',
                  label: '配置值',
                  required: true,
                  component: 'DatePicker',
                  componentProps: { showTime: true },
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'minValue',
                  label: '最小值',
                  componentProps: { showTime: true },
                  component: 'DatePicker',
                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'maxValue',
                  label: '最大值',
                  component: 'DatePicker',
                  componentProps: { showTime: true },
                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
              ]);
              break;
            case 'date':
              updateSchema([
                {
                  field: 'value',
                  label: '配置值',
                  required: true,
                  component: 'DatePicker',
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'minValue',
                  label: '最小值',
                  component: 'DatePicker',

                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'maxValue',
                  label: '最大值',
                  component: 'DatePicker',

                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
              ]);
              break;
            case 'time':
              updateSchema([
                {
                  field: 'value',
                  label: '配置值',
                  required: true,
                  component: 'TimePicker',
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'minValue',
                  label: '最小值',
                  component: 'TimePicker',

                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
                {
                  field: 'maxValue',
                  label: '最大值',
                  component: 'TimePicker',

                  ifShow: ({ values }) => {
                    return values.type !== 'string' && values.type !== 'bool';
                  },
                  colProps: {
                    span: 12,
                  },
                },
              ]);
              break;

            default:
              break;
          }
        },
      );
      const { createMessage } = useMessage();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        setFieldsValue({ type: 'string' });
        if (unref(isUpdate)) {
          keyType.value = data.record.type;
          rowId.value = data.record.id;
          version.value = data.record.version;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增配置' : '编辑配置'));
      // 表单提交
      async function handleSubmit() {
        try {
          const values = await validate();
          console.log(values);
          if (!values.required) {
            values.required = false;
          }
          if (!values.enabled) {
            values.enabled = false;
          }

          setModalProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            Api.putSetSetting({
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
            Api.addSetSetting({ data: { ...values } }).then(() => {
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
