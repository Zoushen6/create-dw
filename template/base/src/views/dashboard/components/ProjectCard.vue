<template>
  <div class="img_main">
    <div class="img">
      <img id="img_id" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>
<script>
  import { defineComponent, onMounted } from 'vue';
  import img from '/resource/img/home_img.png';
  export default defineComponent({
    setup() {
      document.getElementsByClassName('img');
      onMounted(() => {
        let img_dom = document.getElementById('img_id');
        img_dom.src = img;
      });
      return {};
    },
  });
</script>
<style lang="less" scoped>
  .img_main {
    width: 100%;
    height: 100%;
    position: relative;
    // background-color: #fff;
  }

  .img {
    width: 800px;
    height: 460px;
    margin: 0 auto;
  }
</style>
