<template>
  <div class="calendar_tem">
    <Row>
      <Col :span="24">
        <Card>
          <BasicForm @register="register" @submit="handleSubmit" />
        </Card>
      </Col>
      <Col :span="24">
        <Card>
          <CalendarCard ref="calendarCard" @calendarSelect="calendarSelect" />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { Row, Col, Card } from 'ant-design-vue';
  import CalendarCard from './components/calendarCard/index.vue';
  import { ref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Api from '../../api';
  const formData: any = ref({});
  const calendarCard: any = ref(null);
  const calendarSelect = (value) => {
    formData.value = value;
    updateSchema({
      field: 'schedule',
      label: value.date + ' 事项',
    });
    if (value.schedule) {
      setFieldsValue({
        schedule: value.schedule,
      });
    } else {
      resetFields();
    }
  };
  const schemas: FormSchema[] = [
    {
      field: 'schedule',
      component: 'Select',
      label: '事项',
      colProps: {
        span: 10,
      },
      componentProps: {
        options: [
          {
            label: '班',
            value: 'WORK',
          },
          {
            label: '休',
            value: 'REST',
          },
        ],
      },
    },
  ];
  // const useCalenderStore = useCalender();
  const { createMessage } = useMessage();

  const [register, { validateFields, updateSchema, setFieldsValue, resetFields }] = useForm({
    labelWidth: 120,
    schemas,
    compact: true,
    submitButtonOptions: {
      text: '提交',
    },
    resetButtonOptions: {
      text: '取消',
    },
    actionColOptions: {
      span: 4,
    },
  });

  const handleSubmit = async () => {
    try {
      const res = await validateFields();
      res.date = formData.value.date;
      console.log(res);

      if (!res.date) {
        return createMessage.error('请先选择日期！');
      }
      Api.setCalender({ params: { ...res } }).then(() => {
        createMessage.success('编辑成功！');
        calendarCard.value?.reloadCalender(res);
      });
    } catch (error) {
      console.log('not passing', error);
    }
  };
</script>
