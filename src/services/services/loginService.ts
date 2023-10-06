import api from "../api/apis";
import Taro from "@tarojs/taro";
import {useCodeStore} from "../../stores/code";
import {useJwtStore} from "../../stores/jwt";

interface loginData {
  account: string;
  password: string;
}
const code = useCodeStore();
const jwt = useJwtStore();

async function loginByAccount(
   data: loginData
): Promise<boolean> {
  let resData;
  await Taro.request({
    method: "POST",
    url: api.login.normal,
    data: data,
    success: function (res) {
      resData = res;
      console.log(resData);
    },
    fail: function (res) {
      console.error(res);
    }
  })
  if (resData.data.msg !== "ok") return false;
  jwt.setJwt(resData.data.data.jwt);
  await Taro.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        code.setCode(res.code)
        Taro.request({
          method: "POST",
          url: api.login.bind,
          data: {
            ...data,
            code: res.code
          }
        })
      } else {
        console.log('绑定自动登录失败！' + res.errMsg)
      }
    }
  })
  console.log("code:"+code.getCode());
return true;
}

async function autoLogin (): Promise<boolean> {
  const code = useCodeStore();
  let resData;
  await Taro.request({
    method: "POST",
    url: api.login.auto,
    data: {
      code: code.getCode(),
    },
    success: function (res) {
      resData = res;
    },
    fail: function (res) {
      console.error(res);
    }
  })
  if (resData.data.msg === "ok"){
    jwt.setJwt(resData.data.data.jwt);
    console.log("auto login success");
    return true
  }
  return false;
}

export {loginByAccount , autoLogin}
