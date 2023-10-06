import {defineStore} from "pinia";
import {ref} from "vue";
import Taro from "@tarojs/taro";


export const useCodeStore = defineStore("code",() => {
  const code = ref<string>("");
  const setCode = (c) => {
    code.value = c;
    Taro.setStorageSync("code",c);
  };

  const getCode = () => {
    if(code.value !== "") return code.value;
    else
      return Taro.getStorageSync("code");
  };

  return { code , setCode , getCode };
});
