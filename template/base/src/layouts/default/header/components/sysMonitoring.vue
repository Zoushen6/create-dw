<template>
  <div @click="clickFunction">
    <a-button>系统监控</a-button>
  </div>
  <!-- <Tooltip title="分析平台" placement="bottom" :mouseEnterDelay="0.5" @click="clickFunction">
    <Icon icon="material-symbols:arrows-more-up-rounded" />
  </Tooltip> -->
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { useRouter } from 'vue-router';
  // const { replace } = useRouter();
  export default defineComponent({
    name: 'SysMonitoring',
    // components: { Icon, Tooltip },

    setup() {
      function clickFunction() {
        window.open('/admin', '_blank');
      }

      return {
        clickFunction,
      };
    },
  });
</script>
