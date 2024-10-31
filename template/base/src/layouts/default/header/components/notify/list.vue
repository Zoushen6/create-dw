<template>
  <div class="notice_list">
    <div
      class="list"
      v-for="item in listData.content"
      :key="item.id"
      @click="handleAction(item.id)"
    >
      <div class="list_img">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
      </div>
      <div class="right_content">
        <div class="list_title"
          ><span>{{ item.subject }}</span></div
        >
        <div class="list_content">{{ item.content }}</div>
      </div>
    </div>
    <Empty v-if="listData?.content?.length == 0" :description="'暂无数据'" />
    <div class="page_content">
      <Pagination
        v-model:current="params.page"
        :total="listData.total"
        size="small"
        :hideOnSinglePage="true"
        @change="paginationChange"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, defineEmits } from 'vue';
  import API from '../../api.ts';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Pagination, Empty } from 'ant-design-vue';
  const { createMessage } = useMessage();
  const emits = defineEmits(['success']);
  onMounted(() => {
    getList(params.value);
  });
  const listData = ref({});
  const params = ref({ page: 1, size: 5, receiveState: false });
  const getList = (params = params.value) => {
    API.getPrivateList({ params: params }).then((res) => {
      listData.value = res;
    });
  };

  const paginationChange = (page) => {
    params.value.page = page;
    getList(params.value);
  };
  const handleAction = (id) => {
    API.readMessage({ pathVars: { id: id } }).then(() => {
      createMessage.success('消息ID - ' + id + ' - 已标记为已读');
      getList(params.value);
      emits('success', listData.value.total);
    });
  };
</script>

<style lang="less">
  .notice_list {
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;

    .list {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;
      // justify-content: space-between;

      .list_img {
        width: 40px;
        height: 40px;

        img {
          width: 40px;
          height: 40px;
        }
      }

      .right_content {
        padding-left: 15px;
      }
    }

    .page_content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }
  }
</style>
