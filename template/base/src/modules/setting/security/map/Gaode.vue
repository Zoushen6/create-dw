<template>
  <div ref="wrapRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, unref, onMounted } from 'vue';

  import { useScript } from '/@/hooks/web/useScript';

  const A_MAP_URL = 'https://webapi.amap.com/maps?v=2.0&key=adae9282f789bcbcbfe1bc8435e51490';

  export default defineComponent({
    name: 'AMap',
    props: {
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: 'calc(100vh - 78px)',
      },
    },
    setup() {
      const wrapRef = ref<HTMLDivElement | null>(null);
      const { toPromise } = useScript({ src: A_MAP_URL });

      async function initMap() {
        await toPromise();
        await nextTick();
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const AMap = (window as any).AMap;
        const map = new AMap.Map(wrapEl, {
          zoom: 4,
          center: [116.397428, 39.90923],
          viewMode: '3D',
        });
        map.on('click', mapClick);
        // new AMap.on('click', mapClick);
      }

      function mapClick() {
        console.log('地图点击了');
      }

      onMounted(() => {
        initMap();
      });

      return { wrapRef };
    },
  });
</script>
