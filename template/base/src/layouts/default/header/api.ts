import { axiosClient } from '/@/modules/api/index';
export default {
  getPrivateList: axiosClient.get('/message/private/page'), // 获取消息列表
  readMessage: axiosClient.patch('/message/received/{id}'), // 标记消息为已读
  users_roleSwitch: axiosClient.patch('/users/roleSwitch/{roleId}'), // 切换角色
};
