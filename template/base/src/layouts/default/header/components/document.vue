<template>
  <div>
    <Dropdown>
      <a-button class="ant-dropdown-link" @click.prevent>在线文档</a-button>
      <template #overlay>
        <Menu @click="clickFunction">
          <MenuItem
            key="https://www.apifox.cn/apidoc/shared-d0bddc7f-439d-4c49-a2e6-01c45a472c6a/api-41164333"
          >
            <a-button size="small" class="button_class">接口文档</a-button>
          </MenuItem>
          <MenuItem key="https://aisuda.bce.baidu.com/amis/zh-CN/docs/start/getting-started">
            <a-button size="small" class="button_class">Amis 文档</a-button>
          </MenuItem>
          <MenuItem key="https://www.ssssssss.org/">
            <a-button size="small" class="button_class">magic-api 文档</a-button>
          </MenuItem>
          <MenuItem key="https://surveyjs.io/">
            <a-button size="small" class="button_class">SurveyJS 文档</a-button>
          </MenuItem>
          <MenuItem key="https://doc.vvbin.cn/guide/">
            <a-button size="small" class="button_class">vben2 文档</a-button>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>
<script lang="ts" setup>
  import { Dropdown, Menu } from 'ant-design-vue';
  const MenuItem = Menu.Item;
  const clickFunction = (e) => {
    window.open(e.key, '_blank');
  };
</script>
<style lang="less" scoped>
  .button_class {
    width: 120px;
  }
</style>
