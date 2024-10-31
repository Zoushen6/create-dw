import { axiosClient } from '/@/modules/api/index';

export default {
  patUserPassword: axiosClient.patch('/user/password'),
  putUserAvatar: axiosClient.patch('/user/avatar'),
  patUserInfo: axiosClient.patch('/user/basic'),
  getPrivateList: axiosClient.get('/message/private/page'), // 获取消息列表
  // 查询用户是否能编辑当前用户基础信息
  getUserIsUpdateInfo: axiosClient.get('/system_settings:userBasicEdit'),
};
