<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="文件详情"
    @visible-change="handleVisibleChange"
    width="700px"
    :showOkBtn="false"
    cancelText="返回"
  >
    <Description :bordered="false" :column="1" @register="register1" class="mt-5 mx-20" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, useDescription } from '/@/components/Description/index';
  export default defineComponent({
    components: { BasicModal, Description },
    props: {
      userData: { type: Object },
    },
    setup(props) {
      const modelRef = ref({});

      const [register] = useModalInner((data) => {
        data && onDataReceive(data.record);
      });
      const [register1] = useDescription({
        data: modelRef,
        schema: [
          {
            field: 'originalFilename',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '原始文件名',
          },
          {
            field: 'sizeStr',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '文件大小',
            render: (_, data) => {
              return `${data.sizeStr}（${data.size} B）`;
            },
          },

          {
            field: 'platform',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '存储平台',
          },
          {
            field: 'basePath',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '基础路径',
          },

          {
            field: 'path',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '存储路径',
          },
          {
            field: 'url',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '文件访问地址',
            // render: (curVal, data) => {
            //   return `${data.username}-${curVal}`;
            // },
          },
          // {
          //   field: 'size',
          //   labelStyle: {
          //     textAlign: 'right',
          //   },
          //   labelMinWidth: 110,
          //   label: '文件大小',
          // },

          {
            field: 'fileName',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '文件名称',
          },

          {
            field: 'ext',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '文件扩展名',
          },
          {
            field: 'contentType',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: 'MIME类型',
          },

          {
            field: 'thUrl',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '略缩图访问路径',
          },
          {
            field: 'thFilename',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '略缩图名称',
          },
          {
            field: 'thSize',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '略缩图大小',
          },
          {
            field: 'thContentType',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '略缩图MIME类型',
          },
          {
            field: 'objectId',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '文件所属对象id',
          },
          {
            field: 'objectType',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '文件所属对象类型',
          },
          {
            field: 'updatedAt',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '更新时间',
          },
          {
            field: 'createTime',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '创建时间',
          },
          {
            field: 'updatedBy',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '更新者',
            render(val) {
              if (val) {
                return val.name;
              }
            },
          },

          {
            field: 'createdBy',
            labelStyle: {
              textAlign: 'right',
            },
            labelMinWidth: 110,
            label: '创建者',
            render(val) {
              if (val) {
                return val.name;
              }
            },
          },
        ],
      });
      function onDataReceive(data) {
        let obj = data;
        modelRef.value = { ...obj };
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      return { register, model: modelRef, handleVisibleChange, register1 };
    },
  });
</script>
<style lang="less" scoped>
  .modal_main {
    width: 400px;

    .label_class {
      margin: 20px 10px;
    }
  }
</style>
