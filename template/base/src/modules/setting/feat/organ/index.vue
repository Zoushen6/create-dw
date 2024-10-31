<template>
  <div class="organ_class">
    <Card class="tree" @click="handelTree(0)">
      <!-- <a-button>全部展开</a-button>
      <a-button>全部收缩</a-button> -->
      <BasicTree
        v-show="is_an"
        style="padding: 10px"
        :treeData="treeData"
        :showLine="{
          showIcon: false,
        }"
        showIcon
        @select="TreeChange"
        search
        toolbar
        ref="treeRef"
        :fieldNames="{ children: 'children', title: 'abbrName', key: 'id' }"
      >
        <template #switcherIcon="{ switcherCls }">
          <!-- <Icon :class="switcherCls" icon="material-symbols:arrow-drop-down"></Icon> -->
          <CaretDownOutlined :class="switcherCls" />
        </template>
        <template #icon> <Icon icon="material-symbols:arrow-right" /> </template>
      </BasicTree>
      <span v-show="is_an" class="icon_is_an" @click.stop="handelTree(1)">
        <Icon color="#fff" icon="ci:chevron-big-left" />
      </span>
      <span v-show="!is_an">组织</span>
    </Card>
    <div class="table">
      <organTableVue :treeId="treeId" @reload="reload()" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree/index';
  import Icon from '/@/components/Icon';
  import organTableVue from './organTable.vue';
  import { Card } from 'ant-design-vue';
  import { CaretDownOutlined } from '@ant-design/icons-vue';
  // import { useMessage } from '/@/hooks/web/useMessage';
  // import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import Api from '../api';

  export default defineComponent({
    components: { BasicTree, organTableVue, Icon, Card, CaretDownOutlined },
    setup() {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      // const { getShowMultipleTab } = useMultipleTabSetting();
      // const { createMessage } = useMessage();
      const { getThemeColor } = useRootSetting();
      const treeData: any = ref([]);
      const is_an = ref(true);
      const treeId = ref('');
      const getTreeData = () => {
        Api.getOrganTree().then((res) => {
          treeData.value = res;
          treeId.value = treeData.value[0].id;
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
      };
      const reload = () => {
        getTreeData();
      };
      const handelTree = (key) => {
        if (key == 1) {
          is_an.value = false;
        } else {
          is_an.value = true;
        }
      };
      return {
        handelTree,
        treeData,
        treeRef,
        handleLevel,
        TreeChange,
        treeId,
        reload,
        // getShowMultipleTab,
        getThemeColor,
        is_an,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep .ant-spin-nested-loading {
    height: calc(100vh - 115px);
    overflow-y: scroll;
    overflow-x: hidden;
    // padding: 0px !important;
  }

  ::v-deep .ant-tree-switcher-leaf-line::after {
    border-bottom: 0;
  }

  ::v-deep .ant-card-body {
    padding: 10px !important;
  }

  .organ_class {
    width: 100%;
    // padding: v-bind('getShowMultipleTab?"0 15px 15px 15px":"15px"');
    display: flex;

    .tree {
      width: v-bind('is_an?"20%":"3%"');
      transition-property: width;
      transition-duration: 0.3s;
      display: inline-block;
      height: calc(100vh - 60px);

      position: relative;

      .icon_is_an {
        width: 15px;
        height: 50px;
        background-color: v-bind('getThemeColor');
        border-radius: 0 10px 10px 0;
        line-height: 50px;
        position: absolute;
        float: right;
        top: 50%;
        transform: translateY(-50%);
        transform: translateX(20%);
        right: 0;
        display: none;
      }
    }

    .tree:hover {
      .icon_is_an {
        display: block;
      }
    }

    .table {
      width: v-bind('is_an?"80%":"97%"');
      transition-property: width;
      transition-duration: 0.3s;

      height: calc(100vh - 60px);

      display: inline-block;
      overflow: hidden;
    }
  }
</style>
