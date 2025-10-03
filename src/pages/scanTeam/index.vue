<template>
  <view class="scanTeamWrap">
    <button class="btnScan" @tap="getScanCode">
      扫码签到
    </button>
    <button v-if="code!==undefined" @tap="toStatus()">
      查看上一个扫码的团队状态
    </button>
    <view class="scanTips">
      tips: 若团队成员下撤，扫码后查看团队状态即可
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.css";

import Taro from "@tarojs/taro";
import { ref } from "vue";

import { checkIn } from "../../services/services/userService";

/** 签到码 || 团队码 */
const code = ref();
const codeType = ref();

function toStatus() {
  Taro.navigateTo({
    url: "/pages/teamInfo/index?code=" + code.value + "&codeType=" + codeType.value
  });
}

const getScanCode = () => {
  wx.scanCode({
    scanType: [ "barCode", "qrCode", "datamatrix", "pdf417" ],
    success: function(t) {
      if (t.errMsg === "scanCode:ok") {
        // 二维码读取成功
        teamCheckIn(t.result);
      } else {
        // 二维码读取失败
        Taro.showModal({
          title: "扫码失败!",
          content: t.errMsg,
          showCancel: false
        });
      }
    }
  });
};

const teamCheckIn = async (teamData: string) => {
  const data = JSON.parse(teamData);
  codeType.value = data.type;
  const content = data.type === 1 ? data.team_id : data.code;
  code.value = content;

  console.log("扫码结果", data);
  await checkIn({
    code_type: data.type,
    content: String(content)
  });
};
</script>
