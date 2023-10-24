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
        postTeamScanCode({team_id});
        return;
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
  background: #169bd5;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 6px;
  height: 70px;
  width: 500px;
  font-size: 30px;
  line-height: 50px;
  margin: 20px;
}
</style>
