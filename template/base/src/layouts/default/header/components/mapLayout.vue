<template>
  <div @click="clickFunction">
    <a-button>分析平台</a-button>
  </div>
  <!-- <Tooltip title="分析平台" placement="bottom" :mouseEnterDelay="0.5" @click="clickFunction">
    <Icon icon="material-symbols:arrows-more-up-rounded" />
  </Tooltip> -->
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  // import { Tooltip } from 'ant-design-vue';
  // import Icon from '/@/components/Icon';

  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'AnalysisPage',
    // components: { Icon, Tooltip },

    setup() {
      const { resolve } = useRouter();

      function clickFunction() {
        const nuwPath = resolve({
          path: '/gis-analysis',
        });
        window.open(nuwPath.href, '_blank');
      }

      return {
        clickFunction,
      };
    },
  });
</script>
