import { axiosClient } from '/@/modules/api/index';

export default {
  // --------------------------运维管理--------------------------------------
  getRoleTree: axiosClient.get('/permissions:tree'),
  // 任务管理
  getInstancePage: axiosClient.get('/task_instances'),
  putInstancePage: axiosClient.put('/task_instances'),
  getTaskListPage: axiosClient.get('/tasks'),
  cancelTask: axiosClient.patch('/task_instances:cancel'),
  stop_all_task: axiosClient.patch('/task_instances:pause'),
  recover_all_task: axiosClient.patch('/task_instances:resume'),
  // 在线用户
  getOnlineList: axiosClient.get('/online_user'),
  onlineUserKick: axiosClient.patch('/online_user:kick'),
  //配置管理
  getSetSettingPage: axiosClient.get('/system_settings'),
  putSetSetting: axiosClient.put('/system_settings/{id}'),
  deleteSetSetting: axiosClient.delete('/system_settings/{id}'),
  addSetSetting: axiosClient.post('/system_settings'),
  system_setting_category: axiosClient.get('/system_settings/category'),
  // 菜单管理
  getMenuPage: axiosClient.get('/menu'),
  addMenuPage: axiosClient.post('/menu'),
  putMenuPage: axiosClient.put('/menu/{id}'),
  deleteMenuPage: axiosClient.delete('/menu/{id}'),
  // 文件管理
  getFilePage: axiosClient.get('/file/page'),
  deleteFilePage: axiosClient.post('/file/delete'),
  downloadFile: axiosClient.get('/file/download', {
    extractData: false,
    responseType: 'blob',
  }),
  fileThereAre: axiosClient.post('/file/exists'),
  fileMove: axiosClient.post('/file/move'),
  fileUploadTemp: axiosClient.postFormData('/file/upload'),
  coverFile: axiosClient.postFormData('/file/cover'),
  // 在线用户
  getOnlinePage: axiosClient.get('/online_page'),
  putOnlinePage: axiosClient.put('/online_page/{id}'),
  deleteOnlinePage: axiosClient.delete('/online_page/{id}'),
  addOnlinePage: axiosClient.post('/online_page'),
  // 权限管理
  getPermissionsPage: axiosClient.get('/permissions'),
  putPermissions: axiosClient.put('/permissions/{id}'),
  deletePermissions: axiosClient.delete('/permissions/{id}'),
  addPermissions: axiosClient.post('/permissions'),
  permissions_category: axiosClient.get('/permissions/category'),
  // 日历管理
  getCalendarList: axiosClient.get('/calendar/list'),
  setCalender: axiosClient.get('/calendar/schedule'),
  // 租户管理
  getLessee: axiosClient.get('/tenants'),
  addLessee: axiosClient.post('/tenants'),
  putLessee: axiosClient.put('/tenants/{id}'),
  deleteLessee: axiosClient.delete('/tenants/{id}'),
  getStorageList: axiosClient.post('/file/storageList'),
  // 一键生成
  getCreateLabel: axiosClient.get('/autoDev/tables'),
  setCreateDev: axiosClient.post('/autoDev/generate'),
  // 消息管理
  getMessageList: axiosClient.get('/message/page'),
  mewMessage: axiosClient.post('/message'),
  getUserList: axiosClient.get('/users'),
  deleteMessage: axiosClient.delete('/message'),
  setNewMessage: axiosClient.post('/message'),
  // 系统配置
  queryEmailConfig: axiosClient.get('/system_settings:email'),
  editEmailConfig: axiosClient.put('/system_settings:email'),
  setBasic: axiosClient.put('/system_settings:basic'),
  // system_settings:basic
  getBasic: axiosClient.get('/public/system_settings:basic'),
  uploadLogo: axiosClient.postFormData('/file/upload_tmp'),
  // --------------------------运维管理--------------------------------------
};
