<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            label: '创建实例',
            icon: 'carbon:add-alt',
            disabled: !hasPermission(['devops:setting']),
            onClick: createTask.bind(null, record),
          },
          {
            label: '查看实例',
            icon: 'carbon:data-view-alt',
            onClick: viewTask.bind(null, record),
          },
        ]"
      />
    </template>
    <template #toolbar>
      <Tooltip :title="Pause_or_not ? '暂停所有任务' : '恢复所有任务'">
        <a-button :type="Pause_or_not ? '' : 'primary'" @click="handleTask">{{
          Pause_or_not ? '暂停' : '恢复'
        }}</a-button>
      </Tooltip>
      <a-button type="primary" @click="reload()">刷新</a-button>
    </template>
  </BasicTable>
  <NameEdit @register="registerModal" @success="handleSuccess" />
  <oneTime @register="registerModalOne" @success="reload()" />
</template>
<script setup lang="ts">
  import { ref, defineEmits } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import NameEdit from './listEdit.vue';
  import oneTime from './listOneTime.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  // import { useRouter } from 'vue-router';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { filterIndex } from '/@/utils/public';
  import Api from '../../api';
  import { useMessage } from '/@/hooks/web/useMessage';

  const page = ref({
    page: 1,
    size: 10,
  });
  const Pause_or_not = ref(true);
  const [registerModal, { openModal }] = useModal();
  const [registerModalOne, { openModal: openModalOne }] = useModal();
  const emit = defineEmits(['viewTaskHandel']);
  const { createMessage } = useMessage();
  const taskColumns = [
    filterIndex(page.value),
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 200,
      customRender: ({ text }) => {
        if (text === 'ONE_TIME_TASK') {
          return '一次性任务';
        } else if (text == 'RECURRING_TASK') {
          return '周期性任务';
        } else if (text === 'PERSISTENT_RECURRING_TASK') {
          return '持久化周期性任务';
        }
      },
    },
    {
      title: '实例任务数量',
      dataIndex: 'instanceNum',
      key: 'instanceNum',
      width: 150,
    },
  ];
  const FormSchema: any = [
    {
      field: 'name',
      label: '任务名称',
      component: 'Input',
      colProps: { xl: 6 },
    },
    {
      field: 'level',
      label: '任务状态',
      component: 'Select',
      colProps: { xl: 6 },
      componentProps: {
        options: [
          {
            label: '运行',
            value: '1',
            key: '1',
          },
          {
            label: '停止',
            value: '2',
            key: '2',
          },
        ],
      },
    },
  ];
  const { hasPermission } = usePermission();
  function getPage(params) {
    return Api.getTaskListPage({ params });
  }
  // const router = useRouter();

  const [registerTable, { reload }] = useTable({
    title: '任务列表',
    api: getPage,
    columns: taskColumns,
    useSearchForm: false,
    showTableSetting: false,
    formConfig: {
      labelWidth: 120,
      schemas: FormSchema,
      autoSubmitOnEnter: true,
    },
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return t;
    },
    handleSearchInfoFn(info) {
      return info;
    },
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  // 创建实例
  const createTask = (record) => {
    if (record.taskType === 'ONE_TIME_TASK') {
      openModalOne(true, {
        record: {
          ...record,
        },
        isUpdate: true,
      });
    } else {
      openModal(true, {
        record: {
          ...record,
        },
        isUpdate: true,
      });
    }
  };
  // 查看实例
  const viewTask = (record) => {
    emit('viewTaskHandel', record);
    // router.push({
    //   name: 'Instance',
    //   query: record,
    // });
  };
  // 新建成功刷新页面
  const handleSuccess = () => {
    reload();
  };
  // 暂停恢复任务
  const handleTask = () => {
    Pause_or_not.value = !Pause_or_not.value;
    if (Pause_or_not.value) {
      Api.recover_all_task().then(() => createMessage.success('成功恢复所有任务'));
    }
    if (!Pause_or_not.value) {
      Api.stop_all_task().then(() => createMessage.success('暂停所有任务'));
    }
    reload();
  };
</script>
