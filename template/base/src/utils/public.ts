import { useUserStore } from '/@/store/modules/user';
import { useMessage } from '/@/hooks/web/useMessage';
// 动态生成密码校验数组
export function regularFun(objData) {
  const userStore = useUserStore();
  const obj = JSON.parse(JSON.stringify(objData));
  let str: any = [];
  if (!obj.passwordFormatEnabled) {
    str = [];
  } else {
    str.push({
      // /^[\S]{6,15}$/
      str: eval(`/.{${obj.passwordFormatLengthMin},${obj.passwordFormatLengthMax}}/`),
      warning:
        '密码必须在' +
        obj.passwordFormatLengthMin +
        '位到' +
        obj.passwordFormatLengthMax +
        '位之间',
    });
    if (obj.passwordFormatHasLetter) {
      str.push({
        str: /(?=.*[a-zA-Z])/,
        warning: '密码必须包含字母',
      });
    }
    if (obj.passwordFormatBothCase) {
      str.push({
        str: /(?=.*[A-Z])(?=.*[a-z])/,
        warning: '密码必须同时包含大小写字母',
      });
    }

    if (obj.passwordFormatHasNum) {
      str.push({
        str: /(?=.*[0-9])/,
        warning: '密码必须包含数字',
      });
    }
    if (obj.passwordFormatHasSymbol) {
      str.push({
        str: new RegExp(`.*[${obj.passwordFormatSymbols}]+.*`),
        warning: '密码必须包含特殊字符',
      });
    }
  }

  userStore.setRegularStr(str);
}
// 表头序号累加
export function filterIndex(pageSize) {
  return {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: 50,
    customRender: ({ index }) => {
      return (pageSize.page - 1) * pageSize.size + (index + 1);
    },
  };
}
// 文件下载
export const exportDataFunction = (res, name) => {
  const { createMessage } = useMessage();
  // const
  const url = window.URL.createObjectURL(
    new Blob([res], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
  );
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  const fileName = name;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  createMessage.success('下载成功！');
};
