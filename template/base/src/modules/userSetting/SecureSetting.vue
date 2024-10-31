<template>
  <div>
    <CollapseContainer title="安全设置" :canExpan="false">
      <List>
        <template v-for="item in list" :key="item.key">
          <ListItem>
            <ListItemMeta>
              <template #title>
                {{ item.title }}
                <div class="extra" v-if="item.extra" @click="openTargetModal">
                  {{ item.extra }}
                </div>
              </template>
              <template #description>
                <div>{{ item.description }}</div>
              </template>
            </ListItemMeta>
          </ListItem>
        </template>
      </List>
    </CollapseContainer>
    <ModalPassword @register="register" />
  </div>
</template>
<script lang="ts">
  import { List } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useModal } from '/@/components/Modal';
  import { secureSettingList } from './data';
  import ModalPassword from './components/password.vue';
  export default defineComponent({
    components: {
      ModalPassword,
      CollapseContainer,
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
    },
    setup() {
      const [register, { openModal }] = useModal();
      function openTargetModal() {
        openModal(true);
      }
      return {
        register,
        openTargetModal,
        list: secureSettingList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
</style>
