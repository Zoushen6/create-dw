<template>
  <div class="user_page">
    <div class="tree">
      <leftTreeVue :isAn="is_an" @treeHandel="treeHandel" @closeTree="is_an = true" />
      <div class="is_an" v-show="is_an" @click="handelSiderIcon">
        <Icon color="#fff" icon="ci:chevron-big-left" />
      </div>
    </div>
    <!-- <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" /> -->
    <div class="right_table">
      <BasicTable @register="registerTable" :searchInfo="searchInfo">
        <template #toolbar>
          <bulkFormVue
            v-show="isShowForm"
            style="width: 70%"
            @formHandel="formHandel"
            @successEmit="successEmit"
            :ids="getSelectRowKeys()"
            :selectRows="getSelectRows()"
          />
          <a-button
            type="primary"
            style="margin: 12px 10px"
            :disabled="!hasPermission(['user:add'])"
            @click="handleCreate"
            >新建</a-button
          >
          <a-button @click="handelUpDownLoad('up')" :disabled="!hasPermission(['user:export'])"
            >导出</a-button
          >
          <a-button @click="handelUpDownLoad('down')" :disabled="!hasPermission(['user:update'])"
            >导入</a-button
          >
          <a-button @click="batchFun('edit')" :disabled="!hasPermission(['user:update'])"
            >批量编辑</a-button
          >
          <a-button @click="batchFun('delete')" :disabled="!hasPermission(['user:del'])"
            >批量删除</a-button
          >
          <!-- <Dropdown placement="bottomLeft" trigger="click" @visibleChange="visibleChange">
            <a-button :disabled="!hasPermission(['user:update', 'user:del'])">批量操作</a-button>
            <template #overlay>
              <Menu>
                <MenuItem> </MenuItem>
                <MenuItem> </MenuItem>
              </Menu>
            </template>
          </Dropdown> -->

          <!-- <a-button type="primary" @click="exportModal">批量导入</a-button>
          <a-button type="primary" @click="sampleList" ghost>样表下载</a-button> -->
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '编辑',
                disabled: !hasPermission(['user:update']) || record.deleted,
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: record.deleted ? '已移除' : '移除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                disabled:
                  !hasPermission(['user:del']) ||
                  record.deleted ||
                  record?.role?.authority === 'administrator',
                tooltip: '移除用户',
                popConfirm: {
                  title: '是否移除该用户',
                  confirm: delUser.bind(null, record),
                  placement: 'left',
                },
              },
            ]"
          />
        </template>
        <template #role="{ record }">
          {{ record.role ? record.role.name : '' }}
          <!-- {{ record }} -->
        </template>
        <template #form-organTree="{ model, field }">
          <TreeSelect
            v-model:value="model[field]"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择组织"
            allow-clear
            tree-default-expand-all
            :tree-data="treeData"
            :field-names="{
              children: 'children',
              label: 'abbrName',
              value: 'id',
            }"
          />
        </template>
      </BasicTable>
    </div>
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <ImportModel @register="registerModal2" @success="reload()" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { filterIndex, exportDataFunction } from '/@/utils/public';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import AccountModal from './components/AccountModal.vue';
  import bulkFormVue from './components/bulkForm.vue';
  import leftTreeVue from '/@/modules/components/leftTree.vue';
  import { searchFormSchema } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TreeSelect } from 'ant-design-vue';
  import Api from './api';
  import Icon from '/@/components/Icon';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { usePermission } from '/@/hooks/web/usePermission';
  import publicApi from '/@/modules/api/index';
  import ImportModel from '/@/modules/components/uploadModel/index.vue';
  const page = ref({
    page: 1,
    size: 10,
  });
  const columns = [
    filterIndex(page.value),
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      slots: { customRender: 'role' },
    },
    {
      title: '组织',
      dataIndex: 'organ',
      width: 200,
      customRender: ({ record }) => {
        return record.organs ? record.organs.map((i) => i.abbrName).join(',') : '';
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ text }) => {
        return text ? '启用' : '禁用';
      },
    },
  ];
  const treeData = ref([]);
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();
  const [registerModal2, { openModal: openModal2 }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const { createMessage, createConfirm } = useMessage();
  const isShowForm = ref(false);
  const { getThemeColor } = useRootSetting();
  const leftSearchData: any = ref({});
  const is_an = ref(true);
  const [
    registerTable,
    {
      reload,
      updateTableDataRecord,
      getSelectRowKeys,
      getSelectRows,
      clearSelectedRowKeys,
      setProps,
    },
  ] = useTable({
    title: '用户列表',
    api: getAccountListFun,
    rowKey: ({ id }) => id,
    columns: columns.map((i) => {
      return i;
    }),
    showIndexColumn: false,
    immediate: false,
    formConfig: {
      labelWidth: 70,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    // rowSelection: undefined,

    rowSelection: {
      type: 'checkbox',
      getCheckboxProps(record) {
        return {
          disabled: record?.role?.authority === 'administrator',
        };
      },
    },
    showTableSetting: false,
    bordered: true,
    beforeFetch: (t) => {
      page.value.page = t.page;
      page.value.size = t.size;

      return { ...t, ...leftSearchData.value };
    },
    handleSearchInfoFn(info) {
      return info;
    },
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function getAccountListFun(params) {
    return Api.getAccountList({ params });
  }
  publicApi.getOrganTree().then((res) => {
    treeData.value = res;
  });
  // 新建用户
  function handleCreate() {
    publicApi.getRulesList().then((res) => {
      res.content.forEach((e) => {
        if (e.defaulted) {
          openModal(true, {
            isUpdate: false,
            roleId: e.id,
          });
        }
      });
    });
  }
  // 编辑用户
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }
  // 关闭批量操作
  const formHandel = () => {
    isShowForm.value = false;
    setProps({
      rowSelection: {
        type: 'checkbox',
        getCheckboxProps(record) {
          return {
            disabled: record?.role?.authority === 'administrator',
          };
        },
      },
    });
    clearSelectedRowKeys();
  };
  // 添加成功回调
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
      createMessage.success('编辑用户成功');
    } else {
      createMessage.success('新建用户成功');
    }
    setTimeout(() => {
      reload();
    }, 0);
  }
  const handelUpDownLoad = (type) => {
    if (type == 'up') {
      createConfirm({
        title: '确定导出用户数据吗？',
        iconType: 'warning',
        onOk() {
          Api.export_users().then((res) => {
            exportDataFunction(res, '用户列表导出数据.xlsx');
          });
        },
      });
    } else if (type == 'down') {
      openModal2(true, {
        title: '用户列表',
        templateName: '导入用户样表',
        houzhui: 'xlsx',
        uploadUrl: '/users/import',
        temUrl: '/template/user.xlsx',
      });
    }
  };

  // 批量修改用户
  const batchFun = (type) => {
    if (type === 'edit') {
      setProps({
        rowSelection: {
          type: 'checkbox',
          // getCheckboxProps(record) {
          //   return {
          //     disabled: record?.role?.authority === 'administrator',
          //   };
          // },
        },
      });
      isShowForm.value = true;
    } else if (type === 'delete') {
      let arr = getSelectRowKeys();
      if (arr?.length == 0) {
        return createMessage.warning('请选择要操作的数据');
      }
      createConfirm({
        title: '确定删除所选用户吗？',
        iconType: 'warning',
        onOk() {
          arr.forEach((i) => {
            delUser({ id: i }, true);
          });
          createMessage.success('操作成功');
          setProps({
            rowSelection: undefined,
          });
        },
      });
    }
  };
  // 批量修改成功
  const successEmit = () => {
    setProps({
      rowSelection: {
        type: 'checkbox',
        getCheckboxProps(record) {
          return {
            disabled: record?.role?.authority === 'administrator',
          };
        },
      },
    });
    reload();
  };
  // 开启多选框
  // const visibleChange = (e) => {
  //   if (e) {
  //     setProps({
  //       rowSelection: {
  //         type: 'checkbox',
  //         getCheckboxProps(record) {
  //           return {
  //             disabled: record?.role?.authority === 'administrator',
  //           };
  //         },
  //       },
  //     });
  //   }
  // };
  // 移除用户
  const delUser = (record, all = false) => {
    Api.deleteUser({ pathVars: { id: record.id } }).then(() => {
      reload();
      all ? '' : createMessage.success('用户成功移除');
    });
  };
  // 左侧tree组件事件
  const treeHandel = (e) => {
    leftSearchData.value = e;
  };
  watch(
    () => leftSearchData.value,
    () => {
      reload();
    },
    {
      deep: true,
    },
  );

  const handelSiderIcon = () => {
    if (is_an.value) {
      is_an.value = false;
    }
  };
</script>
<style lang="less" scoped>
  ::v-deep .vben-basic-table-form-container {
    padding-top: 0px;
  }

  .tree {
    width: v-bind('is_an? "20%":"3%"');
    display: inline-block;
    transition-property: width;
    transition-duration: 0.3s;
    position: relative;
    // margin-right: 16px;
  }

  .tree:hover {
    .is_an {
      display: block;
    }
  }

  .right_table {
    width: v-bind('is_an? "80%":"97%"');
    transition-property: width;
    transition-duration: 0.3s;
  }

  .is_an {
    width: 15px;
    height: 50px;
    background-color: v-bind('getThemeColor');
    border-radius: 0 10px 10px 0;
    line-height: 50px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    position: absolute;
    float: right;
    top: 50%;
    transform: translateY(-50%);
    transform: translateX(20%);
    right: 0;
    display: none;
  }

  .user_page {
    display: flex;
  }
</style>
