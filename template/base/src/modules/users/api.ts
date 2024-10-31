import { axiosClient } from '/@/modules/api/index';

export default {
  addAccountList: axiosClient.post('/users'),
  getAccountList: axiosClient.get('/users'),
  editUsers: axiosClient.put('/users/{id}'),
  batchUsers: axiosClient.patch('/users:batch'),
  deleteUser: axiosClient.delete('/users/{id}'),
  import_users: axiosClient.get('/users/import'),
  responseType: 'blob',
  export_users: axiosClient.get('/users/export', {
    responseType: 'blob',
  }),
  get_del_user: axiosClient.get('/users/deleted'),
};
