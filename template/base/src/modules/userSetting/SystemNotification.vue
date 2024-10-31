<template>
  <div>
    <CollapseContainer title="系统通知" :canExpan="false">
      <List item-layout="vertical" :data-source="list" :pagination="pagination">
        <template #renderItem="{ item }">
          <ListItem>
            <template #actions>
              <!-- <a key="list-loadmore-edit">edit</a> -->
              <a key="list-loadmore-more">删除</a>
            </template>
            <ListItemMeta :description="item.content">
              <template #title>
                <span>{{ item.subject }}</span>
              </template>
              <template #avatar>
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
              </template>
            </ListItemMeta>
            <div class="list_content"></div>
          </ListItem>
        </template>
      </List>
    </CollapseContainer>
  </div>
</template>
<script setup>
  // import { Progress, Row, Col } from 'ant-design-vue';
  import { defineComponent, ref, onMounted } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { List, ListItem, ListItemMeta, Avatar } from 'ant-design-vue';
  import API from './api';
  onMounted(() => {
    getlist(params.value);
  });
  const pagination = {
    onChange: (page) => {
      console.log(page);
      params.value.page = page;
      getlist(params.value);
    },
    defaultPageSize: 5,
  };
  const params = ref({ page: 1, size: 5 });
  const list = ref([]);
  const getlist = (params) => {
    API.getPrivateList({ params: params }).then((res) => {
      list.value = res.content;
      pagination.total = res.total;
    });
  };
</script>
<style lang="less" scoped>
  .ant-list-item {
    display: flex;

    .list_content {
      width: 300px;
    }
  }

  ::v-deep .ant-list-item-action {
    width: 150px;
  }
</style>
