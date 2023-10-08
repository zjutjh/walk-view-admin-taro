<template>
  <button @tap="toStatus()" >跳转到团队状态</button>
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
</script>
