<template>
  <Row>
    <Col :span="5">
      <MenuTree @tree-change="treeChange" />
    </Col>
    <Col :span="19">
      <div>
        <BasicTable @register="registerTable">
          <template #action="{ record }">
            <TableAction
              :actions="[
                {
                  label: '编辑',
                  icon: 'clarity:note-edit-line',
                  onClick: editName.bind(null, record),
                  disabled: !record.updatedAt,
                },
                {
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
                  label: '删除',
                  tooltip: '删除接口',
                  disabled: !record.updatedAt,
                  popConfirm: {
                    title: '是否确认删除该接口',
                    placement: 'left',
                    confirm: handleDelete.bind(null, record),
                  },
                },
              ]"
              >设置</TableAction
            >
          </template>
          <template #toolbar>
            <a-button
              @click="
                openModal(true, {
                  isUpdate: false,
                })
              "
              type="primary"
              >新建</a-button
            >
          </template>
          <template #icon_slot="{ record }">
            <Icon :icon="record.icon" />
          </template>
        </BasicTable>
      </div>
    </Col>
  </Row>
  <NameEdit @register="registerModal" @success="handleSuccess" />
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import NameEdit from './nameEdit.vue';
  import MenuTree from './menuTree.vue';
  import { BasicTable, useTable, TableAction, BasicColumn } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { filterIndex } from '/@/utils/public';
  import Api from '../../api';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import type { Menu } from '/@/router/types';
  import { getMenus } from '/@/router/menus/index';
  import { transformMenuToTable } from './hooks/useTree';
  const [registerModal, { openModal }] = useModal();
  const taskColumns: BasicColumn[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '路由',
      dataIndex: 'route',
      key: 'route',
      width: 200,
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 300,
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      width: 300,
    },
    {
      title: '打开模式',
      dataIndex: 'openMode',
      key: 'openMode',
      width: 200,
      customRender: ({ text }) => {
        return text == 'NEW' ? '新开' : '内嵌';
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
      slots: { customRender: 'icon_slot' },
      key: 'icon',
      width: 200,
    },
    {
      title: '顺序',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 200,
      customRender: ({ text }) => {
        return text ? '启用' : '禁用';
      },
    },
  ];
  const { createMessage } = useMessage();
  const page = ref({
    page: 1,
    size: 10,
  });

  const dataSourceRef = ref<Recordable[]>([]);
  const defaultdataSourceRef = ref<Recordable[]>([]);

  //获取接口返回的table 数据 + 已存的menu 生成的table 数据
  const getTableDataSource = async () => {
    const menuList: Menu[] = await getMenus();
    defaultdataSourceRef.value = transformMenuToTable(menuList);

    Api.getMenuPage(page).then((res) => {
      const result = res.content;
      result.forEach((item) => {
        defaultdataSourceRef.value = defaultdataSourceRef.value.filter((v) => v.name !== item.name);
      });
      dataSourceRef.value = [...result, ...defaultdataSourceRef.value];
    });
  };
  //生成table
  const [registerTable, { updateTableDataRecord, setTableData }] = useTable({
    title: '菜单列表',
    // api: getOrgan,
    dataSource: dataSourceRef,
    columns: [filterIndex(page.value), ...taskColumns],
    useSearchForm: false,
    showTableSetting: false,
    formConfig: {
      labelWidth: 120,
      autoSubmitOnEnter: true,
    },
    handleSearchInfoFn(info) {
      return info;
    },
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;
      return t;
    },
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  // 编辑权限
  const editName = (record) => {
    openModal(true, {
      record: {
        ...record,
      },
      isUpdate: true,
    });
  };
  // 编辑成功回调
  const handleSuccess = ({ isUpdate, values }) => {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    } else {
      setTimeout(() => {
        // reload();
        getTableDataSource();
      }, 1000);
    }
  };
  const handleDelete = (record) => {
    Api.deleteMenuPage({ pathVars: { id: record.id } }).then(() => {
      createMessage.success('删除菜单成功！');
      // reload();
      getTableDataSource();
    });
  };

  //树结构点击重置table 数据
  const treeChange = (node: any) => {
    const currentRow = dataSourceRef.value.filter((item) => {
      return item.id === node;
    });
    currentRow?.length ? setTableData(currentRow) : setTableData(dataSourceRef.value);
  };
  onMounted(async () => {
    await getTableDataSource();
  });
</script>
