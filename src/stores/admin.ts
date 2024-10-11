import {defineStore} from "pinia";
import {ref} from "vue";
import Taro from "@tarojs/taro";

export const useAdminStore = defineStore("admin",() => {
  const adminId = ref<number>();
  const setAdminId = (a: number) => {
    adminId.value = a;
    Taro.setStorageSync("adminId", a);
  }
  const getAdminId = ():number => {
    if(adminId.value !== undefined) return adminId.value;
    else return Taro.getStorageSync("adminId");
  }

  const name = ref<string>();
  const setName = (a: string) => {
    name.value = a;
    Taro.setStorageSync("name", a);
  }
  const getName = ():string => {
    if(name.value !== undefined) return name.value;
    else return Taro.getStorageSync("name");
  }

  const account = ref<string>();
  const setAccount = (a: string) => {
    account.value = a;
    Taro.setStorageSync("account", a);
  }
  const getAccount = ():string => {
    if(account.value !== undefined) return account.value;
    else return Taro.getStorageSync("account");
  }
  
  //点位
  const point = ref<number>();
  const setPoint = (a: number) => {
    point.value = a;
    Taro.setStorageSync("point", a);
  }
  const getPoint = ():number => {
    if(point.value !== undefined) return point.value;
    else return Taro.getStorageSync("point");
  }

  //1 是朝晖路线，2 屏峰半程，3 屏峰全程，4 莫干山半程，5 莫干山全程
  const route = ref<number>();
  const setRoute = (a: number) => {
    route.value = a;
    Taro.setStorageSync("route", a);
  }
  const getRoute = ():number => {
    if(route.value !== undefined) return route.value;
    else return Taro.getStorageSync("route");
  }

  const secret = ref<string>();
  const setSecret = (s: string) => { secret.value = s; };
  const getSecret = () => { return secret.value; };
  return { 
    setAdminId, getAdminId,
    setName, getName,
    setAccount, getAccount,
    setPoint, getPoint,
    setRoute, getRoute,
    setSecret, getSecret,
   };
});
