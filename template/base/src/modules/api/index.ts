import AxiosClient from '@cn-src/axios-client';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { ref } from 'vue';
import { router } from '/@/router';
import { useUserStore } from '/@/store/modules/user';
import { getToken } from '/@/utils/auth';
import { useMessage } from '/@/hooks/web/useMessage';
// import { debounce } from 'lodash-es';\
const flage = ref(false);
axios.interceptors.request.use(
  (config: any) => {
    if (config.url !== '/login') {
      const AccessToken = getToken();
      config.headers.Authorization = 'Bearer ' + AccessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
// @ts-ignore
const axiosClient: any = new AxiosClient(axios, {
  baseURL: import.meta.env.VITE_GLOB_API_URL,
  timeout: 5000,
  onCatch(_, error) {
    if (!error.response || error.response.status === 500) {
      return debounce(message.error('服务暂不可用，请稍后再试!'), 2000);
    }
    if (error.response.status === 401) {
      if (flage.value) {
        return;
      }
      flage.value = true;
      loginOut(error.response.data);
    } else {
      return debounce(returnErrMessage(error), 2000);
    }
  },
  onGet: {
    onPre(req) {
      for (const key in req.params) {
        if (req.params[key] == undefined) {
          delete req.params[key];
        }
      }
      return true;
    },
  },
});
function returnErrMessage(error) {
  message.error(error.response.data.message || error.response.statusText);

  return;
}
function debounce(fn, delay) {
  let time: any = null; //time用来控制事件的触发
  return function () {
    if (time !== null) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      fn();
      //利用call(),让this的指针从指向window 转成指向input
    }, delay);
  };
}
function loginOut(data) {
  const { message } = data;
  const { createConfirm } = useMessage();
  return createConfirm({
    title: '会话错误！',
    content: message,
    iconType: 'error',
    maskClosable: false,
    onOk() {
      const userStore = useUserStore();
      userStore.setToken(undefined);
      userStore.setSessionTimeout(false);
      userStore.setUserInfo(null);
      router.push('/login');
      flage.value = false;
    },
  });
}

export default {
  // 多页面公用接口

  // --------------------------登录相关--------------------------------------
  login: axiosClient.post('/login'),
  layoutApi: axiosClient.post('/logout'),
  getCaptcha: axiosClient.get('/public/login/captcha'),
  // --------------------------登录相关--------------------------------------

  // ------------------------用户信息------------------------------------
  getUserInfo: axiosClient.get('/user'),
  // ------------------------用户信息------------------------------------

  // ------------------------查询租户------------------------------------
  getLessesList: axiosClient.get('/public/tenants/list'),
  // ------------------------查询租户------------------------------------

  // --------------------------组织架构--------------------------------------
  // 组织相关
  getOrganLabel: axiosClient.get('/organs/select'),
  getOrganTree: axiosClient.get('/organs/tree'),
  // 角色相关
  getRulesList: axiosClient.get('/roles'),
  getRoleTree: axiosClient.get('/permissions:tree'),
  // --------------------------组织架构--------------------------------------

  // --------------------------系统设置--------------------------------------
  getSecurity: axiosClient.get('/system_settings:security'),
  getBasic: axiosClient.get('/public/system_settings:basic'),
  // --------------------------系统设置--------------------------------------

  // --------------------------文件上传--------------------------------------
  uploadTmp: axiosClient.postFormData('/file/upload_tmp'),
  // --------------------------文件上传--------------------------------------

  // --------------------------运维管理--------------------------------------
  // 菜单管理
  getMenuPage: axiosClient.get('/menu'),
  getMenuList: axiosClient.get('/menu/list'), //菜单查询全部

  //在线页面全部 数据
  getOnlineList: axiosClient.get('/online_page/list'),
  // --------------------------运维管理--------------------------------------

  // --------------------------gis--------------------------------------
  // 图层
  getLayerInfoList: axiosClient.get('/layerInfo/page'),
  createLayerInfo: axiosClient.post('/layerInfo/create'),
  putLayerInfo: axiosClient.put('/layerInfo/update/{id}'),
  uploadLayerInfo: axiosClient.postFormData('/layerInfo/upload'),
  deleteLayerInfo: axiosClient.delete('/layerInfo/delete/{id}'),
  getLayerDeailGeo: axiosClient.get('/layerData/geo/info/{id}'),
  dowenLoadLayerInfo: axiosClient.get('/layerInfo/download/{id}', {
    extractData: false,
    responseType: 'blob',
  }),
  // 图形
  getLayerData: axiosClient.get('/layerData/page'),
  createLayerData: axiosClient.post('/layerData/create'),
  putLayerData: axiosClient.put('/layerData/update/{id}'),
  getLayerDataInfo: axiosClient.get('/layerData/update/{id}'),
  deleteLayerData: axiosClient.delete('/layerData/delete/{id}'),
  getLayerDataInfoDeail: axiosClient.get('/layerData/info/{id}'),
  getLayerDataDeailGeo: axiosClient.get('/layerData/geo/data/{id}'),

  // --------------------------gis--------------------------------------
};

export { axiosClient };
