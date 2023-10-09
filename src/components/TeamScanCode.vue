<script setup lang="ts">
import Taro from "@tarojs/taro";
import {postTeamScanCode} from "../services/services/teamService";


const handleToggle = () => {
  Taro.scanCode({
    success: (res) => {
      console.log(res);
      if(res.errMsg === "scanCode:ok") {
        const result =  res.result;
        const resultJson = JSON.parse(result);
        const {team_id} = resultJson;
        let {time} = resultJson;
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
		      //发送请求到后端拿到团队信息，并跳转页面
          postTeamScanCode({team_id});
          return;
        }
      }
    }
  });
};

</script>

<template>
    <button class="scan-button" type="submit" @tap="handleToggle">团队扫码</button>
</template>

<style scoped>
.scan-button {
  outline-style: none ;
  background: #169bd5;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 6px;
  height: 70px;
  width: 500px;
  font-size: 30px;
  color: aliceblue;
  line-height: 50px;
  margin: 20px;
}
</style>
