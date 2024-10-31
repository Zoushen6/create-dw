<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" :disabled="!hasPermission(['role:setting'])" @click="handleCreate">
          新建
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              disabled: record.authority === 'administrator' || !hasPermission(['role:setting']),
              label: '编辑',
              tooltip: record.authority === 'administrator' ? '超级管理员不可编辑' : '编辑角色',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              tooltip:
                record.authority === 'administrator'
                  ? '超级管理员不可删除'
                  : record.builtIn
                  ? '内置角色不可删除'
                  : record.defaulted
                  ? '默认角色不得删除'
                  : '删除角色',
              disabled: record.builtIn || !hasPermission(['role:setting']) || record.defaulted,
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
            {
              icon: record.defaulted ? 'wpf:security-checked' : 'wpf:refresh-shield',
              label: record.defaulted ? '默认角色' : '设为默认',
              tooltip:
                record.authority === 'administrator'
                  ? '超级管理员不得设为默认角色'
                  : record.defaulted
                  ? '默认角色'
                  : '设为默认角色',
              disabled:
                !hasPermission(['role:setting']) ||
                record.defaulted ||
                record.authority === 'administrator',
              popConfirm: {
                title: '是否设为默认角色',
                placement: 'left',
                confirm: handleDefault.bind(null, record),
              },
            },
          ]"
        />
      </template>
      <template #nameSlots="{ record, text }">
        <a href="javascript:;" @click="handelLook(record)"> {{ text }}</a>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import Api from '../api';

  import { columns, searchFormSchema } from './role.data';
  import { useRouter } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { filterIndex } from '/@/utils/public';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction },
    setup() {
      const go = useGo();
      const page = ref({
        page: 1,
        size: 10,
      });
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();
      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        api: getRoleListByPage,
        columns: [filterIndex(page.value), ...columns],
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: false,

        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
        beforeFetch: (t) => {
          page.value.page = t.page;
          page.value.size = t.size;
          return t;
        },
        actionColumn: {
          width: 250,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });
      const router = useRouter();
      function getRoleListByPage(params) {
        return Api.getRulesList({ params });
      }

      function handleCreate() {
        go('/setting/feat/add-role');
      }
      const handelLook = (record) => {
        router.push({
          name: 'AddRole',
          query: { data: JSON.stringify(record) },
        });
      };
      function handleEdit(record: Recordable) {
        console.log(record);

        router.push({
          name: 'AddRole',
          query: { data: JSON.stringify(record) },
        });
      }

      function handleDelete(record: Recordable) {
        Api.deleteRule({ pathVars: { id: record.id } }).then(() => {
          createMessage.success('角色删除成功');
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }
      const handleDefault = (record) => {
        console.log(record.id);
        Api.editDefault({ pathVars: { id: record.id } }).then(() => {
          createMessage.success('操作成功');
          reload();
        });
      };

      return {
        registerTable,
        handelLook,
        handleDefault,
        hasPermission,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
