import { axiosClient } from '/@/modules/api/index';

export default {
  editSecurity: axiosClient.put('/system_settings:security'),
};
