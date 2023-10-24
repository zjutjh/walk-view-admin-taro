<template>
<view class="content-wrapper">
  <text class="title">毅行管理员登录</text>
  <input class="login-input" type="text" placeholder="请输入账号" v-model="account"/>
  <input class="login-input" type="text" placeholder="请输入密码" v-model="password"/>
  <button class="login-button" type="submit" @tap="login">登录</button>
</view>
</template>

<script setup lang="ts">
import "./index.css";
import {ref} from "vue";
import { loginByAccount } from "../../services/services/loginService";
import Taro from "@tarojs/taro";

const account = ref<string>("");
const password = ref<string>("");


async function login(){
  const data = {
    account: account.value,
    password: password.value,
  };
  const res = await loginByAccount(data);
  if(res) {
    console.log("login success");
    await Taro.navigateTo({
      url: "/pages/scanTeam/index"
    });
  }
  else await Taro.showModal({
    title: "登录失败!",
    content: "账号或者密码错误"
  });
}
</script>
