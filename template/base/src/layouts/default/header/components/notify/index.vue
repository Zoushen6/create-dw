<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <!-- <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              绑定title-click事件的通知列表中标题是“可点击”的
              <NoticeList :list="item.list" v-if="item.key === '1'" @title-click="onNoticeClick" />
              <NoticeList :list="item.list" v-else />
            </TabPane>
          </template>
        </Tabs> -->
        <!-- <NoticeList :list="listData"  @title-click="onNoticeClick" /> -->
        <NoticeList @success="success" />
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { Popover, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  // import { ListItem } from './data';
  import NoticeList from './list.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import API from '../../api.ts';

  export default defineComponent({
    components: { Popover, BellOutlined, Badge, NoticeList },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      // const { createMessage } = useMessage();
      const count = ref(0);
      onMounted(() => {
        getList();
      });
      // const listData = ref([{key: '1',name: '站内信',list:[]}])
      // const coount
      const getList = () => {
        API.getPrivateList({ params: { receiveState: false } }).then((res) => {
          count.value = res.total;
        });
      };
      const success = (num) => {
        count.value = num;
      };
      // const listData = ref(tabListData);

      // function onNoticeClick(record: ListItem) {
      //   createMessage.success('你点击了通知，ID=' + record.id);
      //   // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
      //   record.titleDelete = !record.titleDelete;
      // }

      return {
        prefixCls,
        // listData,
        success,
        count,
        // onNoticeClick,
        // getList,
        numberStyle: {},
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }

  .vben-header-notify__overlay {
    width: 260px !important;
  }
</style>
