<template>
  <div class="lg:flex">
    <div id="avatar">
      <img style="width: 100%; height: 100%" :src="img_src" alt="" />
    </div>
    <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
      <h1 class="md:text-lg text-md">您好, {{ userInfo.name }} 欢迎登录管理系统</h1>
      <span class="text-secondary"> 管理系统——让我们聆听客户的声音 </span>
      <span class="text-secondary"> {{ time }} </span>
    </div>
    <div class="flex flex-1 justify-end md:mt-0 mt-4">
      <div class="flex flex-col justify-center text-right"> </div>

      <div class="flex flex-col justify-center text-right md:mx-16 mx-12">
        <!-- <span class="text-secondary"> 项目 </span>
        <span class="text-2xl">8</span> -->
      </div>
      <div class="flex flex-col justify-center text-right md:mr-10 mr-4">
        <!-- <span class="text-secondary"> 团队 </span>
        <span class="text-2xl">300</span> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, onBeforeUnmount } from 'vue';
  // import { Avatar } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  const time = ref('');
  const img_src = ref('/resource/img/portrait3.png');
  function showTime() {
    let show_day: any = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    let time: any = new Date();
    let year: any = time.getFullYear();
    let month: any = time.getMonth() + 1;
    let date: any = time.getDate();
    let day: any = time.getDay();
    let hour: any = time.getHours();
    let minutes: any = time.getMinutes();
    let second: any = time.getSeconds();
    month < 10 ? (month = '0' + month) : month;
    // month = month + 1;
    hour < 10 ? (hour = '0' + hour) : hour;
    minutes < 10 ? (minutes = '0' + minutes) : minutes;
    second < 10 ? (second = '0' + second) : second;
    let now_time =
      // "当前时间：" +
      year +
      '年' +
      month +
      '月' +
      date +
      '日' +
      ' ' +
      show_day[day - 1] +
      ' ' +
      hour +
      ':' +
      minutes +
      ':' +
      second;
    return now_time;
  }
  const inter = setInterval(() => {
    time.value = showTime();
  }, 1000);
  onBeforeUnmount(() => {
    clearInterval(inter);
  });

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
</script>
<style lang="less" scoped>
  #avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #0033ff94;
  }
</style>
