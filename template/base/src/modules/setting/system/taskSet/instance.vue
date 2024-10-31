<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <!-- { label: '编辑', icon: 'clarity:note-edit-line', onClick: editName.bind(null, record) }, -->
      <TableAction
        :actions="[
          {
            label: '取消执行',
            icon: 'clarity:cancel-line',
            disabled: !hasPermission(['devops:setting']),
            color: 'error',
            popConfirm: {
              title: '是否取消执行该任务实例',
              placement: 'left',
              confirm: handleDelete.bind(null, record),
            },
          },
        ]"
      />
    </template>
    <template #toolbar>
      <Switch v-model:checked="isTiming" />{{
        isTiming ? '自动刷新(' + timeout + '秒)' : '已停止刷新'
      }}
      <a-button style="margin: 0 10px" @click="returnFirst" type="primary">返回</a-button>

      <a-button type="primary" :disabled="!hasPermission(['devops:setting'])" @click="cancelFun"
        >取消执行</a-button
      >
    </template>
  </BasicTable>
</template>
<script setup lang="ts">
  import { ref, onUnmounted, watch, defineProps, nextTick, defineEmits } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Switch } from 'ant-design-vue';
  import Api from '../../api';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { filterIndex } from '/@/utils/public';
  // import { nextTick } from 'process';
  const { hasPermission } = usePermission();
  const page = ref({
    page: 1,
    size: 10,
  });
  const taskColumns = [
    filterIndex(page.value),
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
    },
    {
      title: '实例名称',
      dataIndex: 'taskInstance',
      key: 'taskInstance',
      width: 200,
    },
    {
      title: '定时表达式',
      dataIndex: 'taskData',
      key: 'taskData',
      width: 200,
      customRender: ({ text }) => {
        if (text == null || text == 'null') {
          return '-';
        } else {
          return text;
        }
      },
    },
    {
      title: '执行时间',
      dataIndex: 'executionTime',
      key: 'executionTime',
      width: 200,
    },
    {
      title: '运行状态',
      dataIndex: 'picked',
      key: 'picked',
      customRender: ({ text }) => {
        return text == true ? '运行中' : '待运行';
      },
      width: 200,
    },
    {
      title: '运行节点',
      dataIndex: 'pickedBy',
      key: 'pickedBy',
      width: 200,
    },
    {
      title: '上次状态',
      dataIndex: 'lastState',
      key: 'lastState',
      width: 200,
    },
    {
      title: '上一次成功',
      dataIndex: 'lastSuccess',
      key: 'lastSuccess',
      width: 200,
    },
    {
      title: '上一次失败',
      dataIndex: 'lastFailure',
      key: 'lastFailure',
      width: 200,
    },
    {
      title: '连续失败次数',
      dataIndex: 'consecutiveFailures',
      key: 'consecutiveFailures',
      width: 200,
    },
    {
      title: '心跳时间',
      dataIndex: 'lastHeartbeat',
      key: 'lastHeartbeat',
      width: 200,
    },
    {
      title: '版本数',
      dataIndex: 'version',
      key: 'version',
      width: 200,
    },
  ];
  const isTiming = ref(true);
  const timeout = ref(5);
  const emit = defineEmits(['returnTabs']);
  const props = defineProps({
    recordValue: Object,
  });

  const FormSchema: any = [
    {
      field: 'taskName',
      label: '任务名称',
      component: 'Input',
      colProps: { xl: 6 },
    },

    {
      field: 'picked',
      label: '运行状态',
      component: 'Select',
      colProps: { xl: 6 },
      componentProps: {
        options: [
          {
            label: '运行中',
            value: 'true',
            key: 'true',
          },
          {
            label: '待运行',
            value: 'false',
            key: 'false',
          },
        ],
      },
    },
    {
      field: '[startExecutionTime, endExecutionTime]',
      component: 'RangePicker',
      label: '执行时间',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        placeholder: ['开始时间', '结束时间'],
        getPopupContainer: () => document.body,
      },
      colProps: {
        span: 6,
      },
    },
  ];
  function getOrgan(params) {
    return Api.getInstancePage({ params });
  }
  const { createMessage } = useMessage();
  const [registerTable, { reload, getSelectRows, getForm }] = useTable({
    title: '实例列表',
    api: getOrgan,
    columns: taskColumns,
    useSearchForm: true,
    showTableSetting: false,
    formConfig: {
      labelWidth: 120,
      schemas: FormSchema,
      autoSubmitOnEnter: true,
    },
    handleSearchInfoFn(info) {
      return info;
    },
    tableSetting: { fullScreen: true },
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return t;
    },
    showIndexColumn: false,
    rowSelection: {
      type: 'checkbox',
    },
    rowKey: 'taskInstance',
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  watch(
    () => props.recordValue,
    (record) => {
      if (record) {
        nextTick(() => {
          getForm().setFieldsValue({ taskName: record.taskName });
          timeout.value = 5;
          reload();
        });
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );
  // 返回
  const returnFirst = () => {
    emit('returnTabs');
  };
  // 批量取消执行
  const cancelFun = () => {
    if (getSelectRows().length <= 0) {
      return createMessage.warning('请选择要操作的数据！');
    } else {
      cancelApi(getSelectRows());
    }
  };
  // 列表取消执行
  const handleDelete = (record) => {
    cancelApi([record]);
  };
  // 取消执行函数
  function cancelApi(arr) {
    Api.cancelTask({
      data: arr,
    }).then(() => {
      reload();
      createMessage.success('取消执行成功');
    });
  }
  // 定时刷新

  let timeFun = setInterval(() => {
    timeout.value--;
  }, 1000);
  //  定时器开关
  watch(
    () => timeout.value,
    (value) => {
      if (+value < 0) {
        timeout.value = 5;
        reload();
      }
    },
  );
  watch(isTiming, (val) => {
    if (!val) {
      clearInterval(timeFun);
    } else {
      timeFun = setInterval(() => {
        timeout.value--;
      }, 1000);
    }
  });
  // 页面销毁清除定时器
  onUnmounted(() => {
    if (timeFun) {
      clearInterval(timeFun);
    }
  });
</script>
<style lang="less" scoped>
  ::v-deep.vben-basic-table-form-container {
    padding: 0;
  }
</style>
