<template>
  <BasicForm style="margin-bottom: 0px; width: 100%" @register="register" @submit="handleSubmit">
    <template #organTree="{ model, field }">
      <TreeSelect
        v-model:value="model[field]"
        :treeCheckable="true"
        :show-checked-strategy="SHOW_PARENT"
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
  </BasicForm>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BulkUserForm } from '../data';
  import { TreeSelect } from 'ant-design-vue';
  import { toRefs } from '@vueuse/shared';
  import { ref } from 'vue';
  import publicApi from '/@/modules/api/index';
  // import { useUserStore, useUserStoreWithOut } from '/@/store/modules/user';
  import Api from '../api';
  export default defineComponent({
    components: { BasicForm, TreeSelect },
    props: {
      ids: Array,
      selectRows: Array,
    },
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const SHOW_PARENT = TreeSelect.SHOW_PARENT;
      const { ids } = toRefs(props);
      // removeSchemaByField('field11');
      // const userStore: any = useUserStore();
      // const userStoreWithOut = useUserStoreWithOut();
      const treeData = ref([]);
      const [register, { setProps, resetFields }] = useForm({
        labelWidth: 50,
        schemas: BulkUserForm,
        actionColOptions: {
          span: 6,
        },

        resetButtonOptions: {
          text: '取消',
        },
        resetFunc: async () => {
          emit('formHandel');
        },
        submitButtonOptions: {
          text: '确定',
        },
      });
      setTimeout(() => {
        setProps({ showActionButtonGroup: true });
      }, 0);
      publicApi.getOrganTree().then((res) => {
        treeData.value = res;
      });
      // 表单提交
      const handleSubmit = (values) => {
        if (ids.value?.length == 0) {
          return createMessage.warning('请选择要编辑的数据');
        }
        console.log(values);

        // if (values.organId.length !== 0) {
        //   values.organId = values.organId.map((i) => i.value);
        // }

        Api.batchUsers({ data: { userIds: ids.value, ...values } }).then(() => {
          resetFields();
          // props.selectRows?.forEach((i: any) => {
          //   if (i.username == userStore.userInfo.username) {
          //     if (values.roleId !== i.role.id) {
          //       reloadCurrentPage();
          //     }
          //   }
          // });

          createMessage.success('批量操作成功');
          emit('successEmit');
        });
      };
      // 编辑角色要是当前用户角色刷新页面
      // const reloadCurrentPage = () => {
      //   userStoreWithOut.afterLoginAction(true);
      //   // 刷新浏览器
      //   location.reload();
      // };
      return {
        register,
        handleSubmit,
        treeData,
        SHOW_PARENT,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 5px;
  }

  ::v-deep .vben-basic-table-form-container .ant-form {
    padding: 0;
  }
</style>
