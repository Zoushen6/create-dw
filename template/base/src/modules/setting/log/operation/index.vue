<template>
  <div style="width: 100%">
    <Tabs id="dark" v-model:activeKey="activeKey" :destroyInactiveTabPane="true">
      <TabPane :key="i" :tab="i" v-for="i in tabList"> <RoleLog :typeVal="i" /> </TabPane>
      <!-- <TabPane key="角色" tab="角色"> <RoleLog :typeVal="activeKey" /> </TabPane> -->
    </Tabs>
  </div>
</template>
<script lang="ts" setup>
  import { Tabs } from 'ant-design-vue';
  import RoleLog from './components/roleLog/index.vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { ref } from 'vue';
  import Api from '../api';
  const TabPane = Tabs.TabPane;
  const { getDarkMode } = useRootSetting();
  const activeKey = ref('用户');
  const tabList = ref([]);
  Api.operate_logs_category().then((res) => {
    tabList.value = res;
  });
</script>
<style lang="less" scoped>
  #dark {
    ::v-deep.ant-tabs > .ant-tabs-nav,
    .ant-tabs > div > .ant-tabs-nav {
      background-color: v-bind('getDarkMode === "dark"?"#151515":"#fff" ');
      padding: 0px 10px;
    }
  }

  ::v-deep .vben-basic-table-form-container {
    padding: 0 0;
  }

  ::v-deep.ant-tabs-top > .ant-tabs-nav,
  .ant-tabs-bottom > .ant-tabs-nav,
  .ant-tabs-top > div > .ant-tabs-nav,
  .ant-tabs-bottom > div > .ant-tabs-nav {
    margin: 0;
  }
</style>
