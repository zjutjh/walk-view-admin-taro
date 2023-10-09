<script setup lang="ts">
import Taro from "@tarojs/taro";
const handleToggle = () => {
  Taro.scanCode({
    success: (res) => {
      console.log(res);
      if(res.errMsg === "scanCode:ok") {
        const result =  res.result;
        const resultJson = eval("(" + result + ")");
        let {jwt, time} = resultJson;
        time = time / 1000; // 毫秒转秒
        let now = new Date().getTime(); //拿到当前的时间戳
        now = now / 1000; // 毫秒转秒
        if(now - time > 15) {
          Taro.showToast({
            title: "二维码已过期",
            icon: "error"
          });
          return;
        }else if(now - time <= 15) {
          Taro.showToast({
            title: "扫码成功",
            icon: "success"
          });

		      //发送请求到后端处理成员信息：放行、放弃
          return;
        }
      }
    }
  });
};
</script>

<template>

</template>

<style scoped>

</style>
