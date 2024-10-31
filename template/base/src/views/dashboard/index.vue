<template>
  <div class="img_main">
    <PageWrapper>
      <template #headerContent> <WorkbenchHeader /> </template>
    </PageWrapper>
    <div
      class="img_main_center"
      :style="getDarkMode === 'dark' ? { backgroundColor: '#151515' } : { backgroundColor: '#fff' }"
    >
      <ProjectCard />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import ProjectCard from './components/ProjectCard.vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  const { getDarkMode } = useRootSetting();
</script>
<style lang="less" scoped>
  .img_main {
    width: 100%;
    height: 100%;
    padding: 16px;

    .img_main_center {
      width: 100%;
      height: 100%;
      padding: 20px;
      // background-color: #fff;
    }
  }

  ::v-deep .vben-page-wrapper .vben-page-wrapper-content {
    margin-bottom: 0px;
  }
</style>
