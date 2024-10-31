import { axiosClient } from '/@/modules/api/index';

export default {
  // --------------------------组织架构--------------------------------------
  getOrganList: axiosClient.get('/organs'),
  getOrganLabel: axiosClient.get('/organs/select'),
  editOrganList: axiosClient.put('/organs/{id}'),
  addOrganList: axiosClient.post('/organs'),
  getOrganTree: axiosClient.get('/organs/tree'),
  deleteOrganTree: axiosClient.delete('/organs/{id}'),
  export_organ: axiosClient.get('/organs/export', {
    responseType: 'blob',
  }),
  // --------------------------组织架构--------------------------------------

  // --------------------------角色相关--------------------------------------
  getRulesList: axiosClient.get('/roles'),
  addRule: axiosClient.post('/roles'),
  editRule: axiosClient.put('/roles/{id}'),
  deleteRule: axiosClient.delete('/roles/{id}'),
  getRoleTree: axiosClient.get('/permissions:tree'),
  getRoleList: axiosClient.get('/permissions:list'),
  editDefault: axiosClient.patch('/roles/{id}'),
  // --------------------------角色相关--------------------------------------
};
