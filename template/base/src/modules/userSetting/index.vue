<template>
  <ScrollContainer>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="tabBarStyle" :destroyInactiveTabPane="true">
        <template v-for="item in settingList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="item.component" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tabs } from 'ant-design-vue';

  import { ScrollContainer } from '/@/components/Container/index';
  import { settingList } from './data';

  import BaseSetting from './BaseSetting.vue';
  import SecureSetting from './SecureSetting.vue';
  import SystemNotification from './SystemNotification.vue';
  // import AccountBind from './AccountBind.vue';
  // import MsgNotify from './MsgNotify.vue';

  export default defineComponent({
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      BaseSetting,
      SecureSetting,
      SystemNotification,
      // AccountBind,
      // MsgNotify,
    },
    setup() {
      return {
        prefixCls: 'account-setting',
        settingList,
        tabBarStyle: {
          width: '220px',
        },
      };
    },
  });
</script>
<style lang="less" scoped>
  .account-setting {
    margin: 15px;
    // margin: 12px auto;
    // max-width: 1500px;
    // width: 85%;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }

  //@media screen and (max-width: 1330px) {
  //  .account-setting {
  //    width: calc(100% - 3vw);
  //    margin: 12px;
  //  }
  //}
</style>
