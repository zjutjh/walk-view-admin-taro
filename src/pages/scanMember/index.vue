<template>
  <view class="button-wrapper">
    <view>
      <button class="child" type="submit" @tap="changeWalkStatus(1)">放行</button>
      <button class="child" type="submit" @tap="changeWalkStatus(2)">放弃</button>
    </view>
  </view>
</template>

<script setup lang="ts">

import {ref,onMounted} from "vue";
import Taro from "@tarojs/taro";
import {postScanCodeMember} from "../../services/services/memberService";

const memberJwt = ref("");
const walkStatusChange = ref(-1);

const changeWalkStatus = (val: number) => {
  if(val === 1) {
    walkStatusChange.value = 1;
  }
  else if(val === 2) {
    walkStatusChange.value = 2;
  }
  postScanCodeMember({
    jwt: memberJwt.value,
    walk_status: walkStatusChange.value
  });
  walkStatusChange.value = -1;
};

onMounted(() => {
  walkStatusChange.value = -1;

  Taro.scanCode({
    success: (res) => {
      console.log(res);
      if(res.errMsg === "scanCode:ok") {
        const result =  res.result;
        const resultJson = JSON.parse(result);
        let {time} = resultJson;
        const {jwt} = resultJson;
        memberJwt.value = jwt;
        time = time / 1000; // 毫秒转秒
        let now = new Date().getTime(); //拿到当前的时间戳
        now = now / 1000; // 毫秒转秒
        if(now - time > 15) {
          Taro.showToast({
            title: "二维码已过期",
            icon: "error"
          });
          Taro.navigateTo({
            url:"/pages/teamInfo/index",
          });
          return;
        }else if(now - time <= 15) {
          Taro.showToast({
            title: "扫码成功",
            icon: "success"
          });
          return;
        }
      }
    }
  });
});
</script>
