import {defineStore} from "pinia";
import {ref} from "vue";
import Taro from "@tarojs/taro";

export const useJwtStore = defineStore("jwt",() => {
  const jwt = ref<string>("");
  const setJwt = (j) => {
    jwt.value = j;
    Taro.setStorageSync("jwt", j);
  };
  const getJwt = () => {
    if(jwt.value !== "" ) return jwt.value;
    return Taro.getStorageSync("jwt");
  };
  return { jwt , setJwt , getJwt};
});
