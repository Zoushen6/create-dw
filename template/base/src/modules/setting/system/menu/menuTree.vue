<template>
  <div class="menu_tree">
    <Card class="menuCard">
      <BasicTree
        :showLine="{
          showIcon: false,
        }"
        showIcon
        toolbar
        search
        :treeData="treeData"
        @select="TreeChange"
      >
        <template #switcherIcon="{ switcherCls }">
          <CaretDownOutlined :class="switcherCls" />
        </template>
      </BasicTree>
    </Card>
  </div>
</template>
<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { CaretDownOutlined } from '@ant-design/icons-vue';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { BasicTree } from '/@/components/Tree/index';
  import { getTreeList } from './hooks/useTree';
  import { ref, onMounted } from 'vue';
  const { getShowMultipleTab } = useMultipleTabSetting();
  const treeData: any = ref([]);
  // tree组件点击
  const emit = defineEmits(['treeChange']);
  const TreeChange = (e) => {
    emit('treeChange', e[0]);
  };
  onMounted(async () => {
    treeData.value = await getTreeList();
  });
</script>
<style scoped lang="less">
  .menu_tree {
    width: 100%;
    display: inline-block;
    padding-right: 16px;

    .menuCard {
      height: v-bind('getShowMultipleTab? "calc(100vh - 110px)": "calc(100vh - 80px)"');
    }
  }

  ::v-deep .ant-tree-switcher-leaf-line::after {
    border-bottom: 0;
  }
</style>
