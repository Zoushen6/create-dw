<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #DatePicker_slot="{ model, field }">
        <DatePicker
          style="width: 100%"
          v-model:value="model[field]"
          model="time"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="disabledDate"
          :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
        />
        <!-- @panelChange="datePickerChange" -->
        <!-- :disabled-time="disabledDateTime" -->
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { DatePicker } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Api from '../../api';

  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs, { Dayjs } from 'dayjs';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm, DatePicker },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      // const range = (start: number, end: number) => {
      //   const result: any = [];

      //   for (let i = start; i < end; i++) {
      //     result.push(i);
      //   }

      //   return result;
      // };
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
            field: 'schedulePattern',
            component: 'DatePicker',
            label: '执行时间',
            rules: [
              {
                required: true,
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.reject('请选择执行时间');
                  } else {
                    console.log(dayjs(value).unix(), dayjs().unix());
                    if (dayjs(value).unix() < dayjs().unix()) {
                      return Promise.reject('执行时间必须大于当前时间');
                    }
                    return Promise.resolve();
                  }
                },
              },
            ],
            colProps: {
              span: 18,
            },
            slot: 'DatePicker_slot',
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
          // console.log(values);
          Api.putInstancePage({ data: { ...values, id: rowId.value } }).then(() => {
            emit('success');
            closeModal();
            createMessage.success('操作成功');
          });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      const disabledDate = (current: Dayjs) => {
        // console.log(dayjs(current).format('YYYY-MM-DD HH:mm:ss'));

        // 不能选择今天和今天之前的日子
        return current && current < dayjs();
      };
      // const disabledDateTime = () => {
      //   // console.log(dayjs().format('HH'));

      //   return {
      //     disabledHours: () => range(0, 24).splice(0, +dayjs().format('HH')),
      //     disabledMinutes: () => range(0, +dayjs().format('mm')),
      //     disabledSeconds: () => [0, +dayjs().format('ss')],
      //   };
      // };
      // const datePickerChange = (e) => {
      //   console.log(e);
      // };
      return {
        registerModal,
        disabledDate,
        // disabledDateTime,
        // datePickerChange,
        dayjs,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>
