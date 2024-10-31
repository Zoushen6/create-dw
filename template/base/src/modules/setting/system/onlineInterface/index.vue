<template>
  <div class="online_interface">
    <iframe
      name="online_interface"
      :src="iframeSrc"
      height="100%"
      width="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const iframeSrc =
    window.onlineUrl + '/api/public/magicWeb/index.html?token=' + userStore.getToken;
</script>
<style lang="less" scoped>
  .online_interface {
    position: relative;
    display: inline-block;
    width: 100%;
    height: calc(100vh - 100px);
  }
</style>
