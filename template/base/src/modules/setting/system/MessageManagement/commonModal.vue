<template>
  <div>
    <Modal
      v-model:visible="visibleModal"
      title="新建消息"
      @ok="handleOk"
      @cancel="closer"
      :destroyOnClose="true"
    >
      <Form
        style="margin-top: 20px"
        :model="formState"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <FormItem
          label="主题"
          name="subject"
          :rules="[{ required: true, message: '请输入消息主题' }]"
        >
          <a-input v-model:value="formState.subject" />
        </FormItem>
        <FormItem
          label="内容"
          name="content"
          :rules="[{ required: false, message: '请输入消息内容' }]"
        >
          <a-textarea v-model:value="formState.content" />
        </FormItem>
        <FormItem
          label="分类1"
          name="category1"
          :rules="[{ required: false, message: '请输入分类1' }]"
        >
          <a-input v-model:value="formState.category1" />
        </FormItem>
        <FormItem
          label="预计推送时间"
          name="expectedPushTime"
          :rules="[{ required: true, message: '请选择预计推送时间' }]"
        >
          <DatePicker
            show-time
            placeholder="请选择预计推送时间"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            v-model:value="formState.expectedPushTime"
          />
        </FormItem>
        <FormItem
          label="推送渠道"
          name="pushChannel"
          :rules="[{ required: true, message: '请选择推送渠道' }]"
        >
          <Select ref="select" mode="multiple" v-model:value="formState.pushChannel">
            <SelectOption value="PM">站内信</SelectOption>
            <SelectOption value="EMAIL">邮件</SelectOption>
          </Select>
        </FormItem>
        <FormItem
          label="接收者"
          name="receiverId"
          :rules="[{ required: false, message: '请选择接收者' }]"
        >
          <Select
            class="select-box"
            size="small"
            placeholder="请选择接收者"
            v-model:value="receiverId"
            :filterOption="false"
            @search="getUserList"
            @change="handleChange"
            showSearch
            allowClear
          >
            <SelectOption v-for="item in receiverList" :key="item.id" :value="item.id">
              {{ item.name }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem
          label="接收者手机"
          name="receiverPhone"
          :rules="[{ required: false, message: '请输入接收者联系方式' }]"
        >
          <a-input v-model:value="formState.receiverPhone" />
        </FormItem>
        <FormItem
          label="接收者邮箱"
          name="receiverEmail"
          :rules="[{ required: false, message: '请输入接收者邮箱' }]"
        >
          <a-input v-model:value="formState.receiverEmail" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
  import { ref, onMounted, defineProps, watchEffect } from 'vue';
  import { Modal, Form, FormItem, DatePicker, Select, SelectOption } from 'ant-design-vue';
  import Api from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const props = defineProps({ visible: Boolean });
  const visibleModal = ref(false);
  const formState = ref({});
  let emitFun = defineEmits(['handleSubmit']);
  const receiverId = ref(null);
  watchEffect(() => {
    // console.log('111111', props.id, props.text);
    if (props.visible) {
      visibleModal.value = props.visible;
    }
  });
  onMounted(() => {
    getUserList();
  });

  const receiverList = ref([]);
  const getUserList = (val) => {
    Api.getUserList({ params: { keyword: val } }).then((res) => {
      console.log(res);
      receiverList.value = res.content;
    });
  };

  // const onSubmit = () => {
  //   console.log(formState.value);
  // };

  // const handleSearch = (val) => {
  //   fetch(val, (d) => (receiverList.value = d));
  // };
  // const handleChange = (val) => {
  //   console.log(val);
  //   value.value = val;
  //   fetch(val, (d) => (receiverList.value = d));
  // };

  const onFinish = (values) => {
    console.log(2, values);
    emitFun('handleSubmit', values);
  };
  const handleOk = (errorInfo) => {
    // formState.value.validate((err, values) => {
    //   if (err) return;
    // });
    console.log(3, errorInfo);
    console.log(formState.value);
    Api.setNewMessage({ data: formState.value }).then(() => {
      createMessage.success('操作成功');
      visibleModal.value = false;
      emitFun('handleSubmit');
    });
  };
  const handleChange = () => {
    formState.value.receiverId = receiverId.value;
    console.log(receiverId.value);
  };
  const closer = () => {
    visibleModal.value = false;
    emitFun('handleSubmit');
  };
</script>

<style lang="less" scoped>
  .ant-picker {
    width: 100%;
  }

  ::v-deep .ant-select {
    width: 100%;
  }
</style>
