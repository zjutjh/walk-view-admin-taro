<template>
  <view class="content-wrapper">
  <view class="button-wrapper">
    <view>
      <button class="child" type="submit" @tap="getBack()">返回</button>
      <button class="child" type="submit" :style="{top: '100px',background: 'red'}" @tap="giveUp()">放弃</button>
    </view>
  </view>
  </view>
</template>

<script setup lang="ts">

import {ref,onMounted} from "vue";
import Taro from "@tarojs/taro";
import {postScanCodeMember} from "../../services/services/memberService";
import "./index.css";

function giveUp() {
  Taro.showModal({
    title: "放弃后不能更改,是否放弃?",
    success: (res) => {
      if(res.confirm) {
        changeWalkStatus(2);
      }
    }
  });
}
const memberJwt = ref("");
const walkStatusChange = ref(-1);
const getBack = () => {
  Taro.navigateTo({
    url: "/pages/teamInfo/index",
  });
};
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
        const {jwt} = resultJson;
        memberJwt.value = jwt;
        Taro.showToast({
          title: "扫码成功",
          icon: "success"
        });
        return;
      }
    }
  });
});
</script>
