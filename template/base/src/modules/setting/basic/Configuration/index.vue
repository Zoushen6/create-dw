<template>
  <Card>
    <Tabs style="margin-top: 20px" v-model:activeKey="activeValue" tab-position="top">
      <!-- <TabPane v-for="item in tabList" :key="item.key" :tab="item.name">
        <component :is="item.component" />
      </TabPane> -->
      <TabPane key="1" tab="系统配置">
        <systemConfig v-if="activeValue === '1'" />
      </TabPane>
      <TabPane key="2" tab="邮件配置">
        <emailConfig v-if="activeValue === '2'" />
      </TabPane>
    </Tabs>
  </Card>
</template>

<script setup>
  import { ref } from 'vue';
  import { Card, Tabs } from 'ant-design-vue';
  import systemConfig from './systemConfig.vue';
  import emailConfig from './emailConfig.vue';
  const activeValue = ref('1');

  // const tabList = ref([
  //   {
  //     key: '1',
  //     name: '系统配置',
  //     component: 'systemConfig',
  //   },
  //   {
  //     key: '2',
  //     name: '邮件配置',
  //     component: 'emailConfig',
  //   },
  // ]);
</script>

<style></style>
