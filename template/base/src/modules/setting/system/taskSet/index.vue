<template>
  <div>
    <Tabs id="light" v-model:activeKey="tabsValue" :destroyInactiveTabPane="true">
      <TabPane key="1" tab="任务列表"> <list @viewTaskHandel="viewTaskHandel" /> </TabPane>
      <TabPane key="2" tab="任务实例">
        <instance :recordValue="recordValue" @returnTabs="returnTabs" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import instance from './instance.vue';
  import list from './taskList.vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  export default defineComponent({
    name: 'TabsDemo',
    components: {
      Tabs,
      TabPane: Tabs.TabPane,
      instance,
      list,
    },
    setup() {
      const { getDarkMode } = useRootSetting();
      const { getShowMultipleTab } = useMultipleTabSetting();
      const isShowMultiTab = ref(getShowMultipleTab.value);
      const tabsValue = ref('1');
      const recordValue = ref({});
      const viewTaskHandel = (record) => {
        recordValue.value = record;
        tabsValue.value = '2';
      };
      watch(tabsValue, (val) => {
        if (val == '1') {
          recordValue.value = {};
        }
      });
      const returnTabs = () => {
        tabsValue.value = '1';
      };
      return { getDarkMode, isShowMultiTab, viewTaskHandel, tabsValue, recordValue, returnTabs };
    },
  });
</script>
<style lang="less" scoped>
  #light {
    ::v-deep.ant-tabs > .ant-tabs-nav,
    .ant-tabs > div > .ant-tabs-nav {
      background-color: v-bind('getDarkMode== "light"? "#fff": "#151515"');
      padding: 0px 10px;
      // margin: 0 -20px;
      margin: v-bind('isShowMultiTab?"0 0 16px 0":"0"');
    }
  }

  ::v-deep.ant-tabs-top > .ant-tabs-nav,
  .ant-tabs-bottom > .ant-tabs-nav,
  .ant-tabs-top > div > .ant-tabs-nav,
  .ant-tabs-bottom > div > .ant-tabs-nav {
    margin: 0 0px 0px 0;
  }
</style>
