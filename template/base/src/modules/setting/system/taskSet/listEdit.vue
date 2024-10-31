<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <div class="footer_text_box">
      <div>表达式样例</div>
      <div> * 每天指定时间：12:30,1:30 </div>
      <div> * 间隔固定时间：10s 或 10m 或 10d</div>
      <div> * CRON 表达式：0/10 * * * * ?</div>
    </div>
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
      const typeValue = ref('');
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 150,
        schemas: [
          {
            field: 'taskName',
            label: '任务名称',
            component: 'ApiSelect',
            required: true,
            colProps: { span: 18 },
            dynamicDisabled: () => {
              return true;
            },
            componentProps: {
              api: getOrganLabelListFun,
              getPopupContainer: () => document.body,

              resultField: '',
              labelField: 'taskName',
              valueField: 'taskName',
              immediate: false,
            },
          },
          {
            field: 'taskInstance',
            label: '实例名称',
            component: 'Input',
            required: true,
            colProps: {
              span: 18,
            },
          },

          {
            field: 'scheduleType',
            component: 'RadioGroup',
            label: '表达式类型',
            colProps: {
              span: 18,
            },
            required: true,
            componentProps: ({}) => {
              return {
                onChange: (e: ChangeEvent) => {
                  typeValue.value = e.target.value;
                },
                options: [
                  {
                    label: '每天',
                    value: 'DAILY|',
                  },
                  {
                    label: '间隔',
                    value: 'FIXED_DELAY|',
                  },
                  {
                    label: 'CRON',
                    value: 'CRON|',
                  },
                ],
              };
            },
          },
          {
            field: 'schedulePattern',
            label: '定时表达式',
            component: 'Input',
            colProps: {
              span: 18,
            },
            componentProps: ({}) => {
              let placeholderValue;
              if (typeValue.value == 'DAILY|') {
                placeholderValue = '样例：12:30,15:30';
              } else if (typeValue.value == 'FIXED_DELAY|') {
                placeholderValue = '样例：10s 或 10m 或 10d';
              } else if (typeValue.value == 'CRON|') {
                placeholderValue = '样例：0/10 * * * * ?';
              }
              return {
                placeholder: placeholderValue,
              };
            },
            required: true,
          },
        ],
        showActionButtonGroup: false,
      });
      function getOrganLabelListFun(params) {
        return Api.getTaskListPage(params);
      }
      const { createMessage } = useMessage();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增实例' : '编辑实例'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          let obj = values;
          obj.schedulePattern = typeValue.value + values.schedulePattern;
          delete obj.scheduleType;
          Api.putInstancePage({ data: { ...values, id: rowId.value } }).then(() => {
            createMessage.success('操作成功');
          });
          closeModal();
          emit('success');
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
<style lang="less">
  .footer_text_box {
    margin: 0 50%;
    width: 100%;
    transform: translateX(-37.5%);
  }
</style>
