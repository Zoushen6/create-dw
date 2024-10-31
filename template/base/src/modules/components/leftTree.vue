<template>
  <div class="organ_class" @click="handleClose">
    <Card class="card_box">
      <div v-show="!isAn">组织</div>
      <div v-show="isAn">
        <div class="footer_tree">
          <BasicTree
            :treeData="treeData"
            :showLine="{
              showIcon: false,
            }"
            @select="TreeChange"
            search
            toolbar
            showIcon
            ref="treeRef"
            :fieldNames="{ children: 'children', title: 'abbrName', key: 'id' }"
          >
            <template #switcherIcon="{ switcherCls }">
              <CaretDownOutlined :class="switcherCls" />
            </template>
          </BasicTree>
        </div>
      </div>
    </Card>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { CaretDownOutlined } from '@ant-design/icons-vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree/index';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { Card } from 'ant-design-vue';
  import Api from '/@/modules/api/index';

  export default defineComponent({
    components: { BasicTree, Card, CaretDownOutlined },
    props: {
      isAn: {
        type: Boolean,
      },
    },

    setup(_, { emit }) {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData: any = ref([]);

      const treeId = ref('');
      const { getThemeColor } = useRootSetting();

      const getTreeData = () => {
        Api.getOrganTree().then((res) => {
          treeData.value = res;
          emit('treeHandel', {});
          getTree().setSelectedKeys([treeId.value]);
        });
      };

      getTreeData();
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('暂无组织列表！');
        }
        return tree;
      }

      function handleLevel(level: number) {
        getTree().filterByLevel(level);
      }
      // tree组件点击
      const TreeChange = (e) => {
        treeId.value = e[0];
        emit('treeHandel', { organId: e[0] });
      };
      const reload = () => {
        getTreeData();
      };
      const handleClose = () => {
        emit('closeTree');
      };
      return {
        handleClose,
        getThemeColor,
        treeData,
        treeRef,
        handleLevel,
        TreeChange,
        treeId,
        reload,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep .ant-tree-switcher-leaf-line::after {
    border-bottom: 0;
  }

  .organ_class {
    width: 100%;
    display: inline-block;

    .card_box {
      display: flex;
      justify-content: center;
      height: calc(100vh - 84px);
      width: 100%;
      position: relative;
    }

    .footer_tree {
      overflow: hidden;

      ::v-deep .ant-spin-nested-loading {
        height: calc(100vh - 260px);
        overflow-y: scroll;
        overflow-x: hidden;
        // padding: 0px !important;
      }

      ::v-deep .scrollbar__bar.is-vertical {
        display: none;
      }
    }
  }
</style>
