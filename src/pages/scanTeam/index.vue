<template>
  <button @tap="toStatus()" >跳转到团队状态</button>
  <button @tap="get_scanCode">扫码</button>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import {onMounted} from "vue";

onMounted(() => {
});

function toStatus() {
  Taro.navigateTo({
    url: "/pages/teamInfo/index",
  });
}


const get_scanCode = () => {
  wx.scanCode({
      scanType: [ "barCode", "qrCode", "datamatrix", "pdf417" ],
      success: function(t) {
          console.log(t);
          var o = t.result;
      }
  });
}
</script>
