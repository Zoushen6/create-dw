import { axiosClient } from '/@/modules/api/index';

export default {
  getLogPage: axiosClient.get('/operate_logs'),
  getLoginPage: axiosClient.get('/login_logs'),
  operate_logs_export: axiosClient.get('/operate_logs/export', {
    extractData: false,
    responseType: 'blob',
  }),
  login_logs_export: axiosClient.get('/login_logs/export', {
    extractData: false,
    responseType: 'blob',
  }),
  operate_logs_category: axiosClient.get('/operate_logs/category'),
};
