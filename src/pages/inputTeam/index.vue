<template>
  <view class="scanTeamWrap">
    <button @tap="showStateModal" class="btnScan">输入签到</button>
    <button @tap="toStatus()" v-if="code!==undefined">查看上一个输入的团队状态</button>
    <view class="scanTips">tips: 若团队成员下撤，输入后查看团队状态即可</view>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { checkIn } from "../../services/services/userService"
import { ref } from "vue";
import "./index.css"
import {wxModal} from "../../services/services/wxService";

const code = ref();
const codeType = ref();

function toStatus() {
  Taro.navigateTo({
    url: "/pages/teamInfo/index?code="+code.value+"&codeType="+codeType.value,
  });
}

const showStateModal = async () => {
  wxModal({
    placeholderText: "团队ID",
    success: async (content) => {
      code.value = content;
      codeType.value = 1;
      await checkIn({
        code_type: data.type,
        content: content+"",
      });
    }
  });
}
</script>


