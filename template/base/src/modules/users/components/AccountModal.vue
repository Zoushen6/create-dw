<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #organTree="{ model, field }">
        <TreeSelect
          v-model:value="model[field]"
          show-search
          treeCheckable
          :show-checked-strategy="SHOW_PARENT"
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
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { TreeSelect } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from '../data';
  // import { useUserStore, useUserStoreWithOut } from '/@/store/modules/user';
  import md5 from 'blueimp-md5';
  import Api from '../api';
  import publicApi from '/@/modules/api/index';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm, TreeSelect },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const version = ref('');
      const username = ref('');
      const SHOW_PARENT = TreeSelect.SHOW_PARENT;
      // const userStore: any = useUserStore();
      // const userStoreWithOut = useUserStoreWithOut();
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 70,
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        labelAlign: 'right',
        actionColOptions: {
          span: 12,
        },
      });
      const treeData = ref([]);
      const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      publicApi.getOrganTree().then((res) => {
        treeData.value = res;
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        setFieldsValue({ enabled: true });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          version.value = data.record.version;
          username.value = data.record.username;
          setFieldsValue({
            ...data.record,
            roleIds: data.record.roles ? data.record.roles.map((i) => i.id) : '',
            organIds: data.record.organs ? data.record.organs.map((i) => i.id) : '',
            triggerBelong: data.record.triggerBelong !== '' ? data.record.triggerBelong : [],
          });
        } else {
          setFieldsValue({
            roleId: data.roleId,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新建用户' : '编辑用户'));

      async function handleSubmit() {
        try {
          const values = await validate();
          if (!values.enabled) {
            values.enabled = false;
          }

          setModalProps({ confirmLoading: true });

          let obj = values;

          if (values.password) {
            obj.password = md5(values.password);
          } else {
            delete obj.password;
          }
          // if (values.organIds.length !== 0) {
          //   values.organIds = values.organIds.map((i) => i.value);
          // }
          for (const key in obj) {
            if (!obj[key]) {
              delete obj[key];
            }
          }
          if (unref(isUpdate)) {
            Api.editUsers({
              pathVars: { id: rowId.value },
              data: { ...obj, version: version.value },
            }).then(() => {
              closeModal();
              emit('success', {
                isUpdate: unref(isUpdate),
                values: { ...values, id: rowId.value },
              });
              // 判断是否编辑的当前用户，如果是，则更新权限路由刷新页面
              // if (
              //   userStore.getUserInfo?.username === username.value &&
              //   obj.roleId.includes(userStore.getUserInfo.role.id)
              // ) {
              //   reloadCurrentPage();
              // }
            });
          } else {
            Api.addAccountList({ data: obj }).then(() => {
              closeModal();
              emit('success', {
                isUpdate: unref(isUpdate),
                values: { ...values },
              });
              resetFields();
            });
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      // 编辑角色要是当前用户角色刷新页面
      // const reloadCurrentPage = () => {
      //   userStoreWithOut.afterLoginAction(true);
      //   // 刷新浏览器
      //   location.reload();
      // };
      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        filterOption,
        treeData,
        SHOW_PARENT,
      };
    },
  });
</script>
