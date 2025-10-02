<template>
  <view class="content-wrapper">
    <text class="title">
      毅行管理员登录
    </text>
    <input
      v-model="account"
      class="login-input"
      type="text"
      placeholder="请输入账号"
    >
    <input
      v-model="password"
      class="login-input"
      type="text"
      placeholder="请输入密码"
    >
    <button class="login-button" @tap="login">
      登录
    </button>
  </view>
</template>

<script setup lang="ts">
import "./index.css";

import Taro from "@tarojs/taro";
import { onMounted, ref } from "vue";

import { autoLogin, loginByAccount } from "../../services/services/loginService";
import { useCodeStore } from "../../stores/code";

const account = ref<string>("");
const password = ref<string>("");

async function login() {
  const data = {
    account: account.value,
    password: password.value
  };
  const res = await loginByAccount(data);
  if (res) {
    await Taro.navigateTo({
      url: "/pages/manage/index"
    });
  } else {
    await Taro.showModal({
      title: "登录失败!",
      content: "账号或者密码错误"
    });
  }
}

onMounted(async () => {
  const code = useCodeStore();
  if (code.getCode() === "") {
    return;
  } else if (!await autoLogin()) {
    await Taro.showModal({
      title: "登录失败!",
      content: "自动登录失败请再次登录!",
      showCancel: false
    });
  } else {
    await Taro.navigateTo({
      url: "/pages/manage/index"
    });
  }
  return;
});

</script>
