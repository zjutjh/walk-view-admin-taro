import api from "../api/apis";
import Taro from "@tarojs/taro";
import {useCodeStore} from "../../stores/code";
import {useJwtStore} from "../../stores/jwt";
import { useAdminStore } from "../../stores/admin";
import { reportErrModal } from "./wxService";

interface loginData {
  account: string;
  password: string;
}
const code = useCodeStore();
const jwt = useJwtStore();
const admin = useAdminStore();

const saveLoginData = (resAdmin: any) => {
  console.log(resAdmin);
  admin.setAccount(resAdmin.account);
  admin.setAdminId(resAdmin.admin_id);
  admin.setName(resAdmin.name);
  admin.setPoint(resAdmin.point);
  admin.setRoute(resAdmin.route);
}

//账号登陆服务
async function loginByAccount(
  data: loginData
): Promise<boolean> {
  Taro.showLoading({
    title: "登录中",
    mask: true,
  });
  let resData;
  await Taro.request({
    method: "POST",
    url: api.login.normal,
    data: data,
    success: function (res) {
      resData = res;
    },
    fail(res) { reportErrModal(res.errMsg); }
  });
  if (resData.data.msg !== "ok"){ 
    Taro.hideLoading();
    return false;
  }
  jwt.setJwt(resData.data.data.jwt);
  saveLoginData(resData.data.data.admin);

  //绑定自动登录
  await Taro.login({
    success: function (res) {
      if (res.code) {
        Taro.request({
          method: "POST",
          url: api.login.bind,
          data: {
            ...data,
            code: res.code
          }
        }).then((res) => {
          if(res.data.data.jwt)
            jwt.setJwt(res.data.data.jwt);
        });
        code.setCode(res.code);
      } else {
        console.log("绑定自动登录失败！" + res.errMsg);
      }
    }
  });
  Taro.hideLoading();
  return true;
}

//自动登录
async function autoLogin (): Promise<boolean> {
  Taro.showLoading({
    title: "自动登录中",
    mask: true,
  });
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
    fail(res) { reportErrModal(res.errMsg); }
  });
  if (resData.data.msg === "ok"){
    jwt.setJwt(resData.data.data.jwt);
    saveLoginData(resData.data.data.admin);
    console.log("auto login success");

    //重制code登录凭证
    Taro.login({
      success: (res) => {
        if(res.code) {
          code.setCode(res.code);
        }
      }
    })
    Taro.hideLoading();
    return true;
  }
  Taro.hideLoading();
  return false;
}

export {loginByAccount , autoLogin};
