<template>
  <view class="scanTeamWrap">
    <button @tap="get_scanCode" class="btnScan">扫码签到</button>
    <button @tap="toStatus()" v-if="code!==undefined">查看上一个扫码的团队状态</button>
    <view class="scanTips">tips: 若团队成员下撤，扫码后查看团队状态即可</view>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { checkIn } from "../../services/services/userService"
import { ref } from "vue";
import "./index.css"

const code = ref();  // 签到码 | 团队码
const codeType = ref();

function toStatus() {
  Taro.navigateTo({
    url: "/pages/teamInfo/index?code="+code.value+"&codeType="+codeType.value,
  });
}

const get_scanCode = () => {
  wx.scanCode({
      scanType: [ "barCode", "qrCode", "datamatrix", "pdf417" ],
      success: function(t) {
        if(t.errMsg === "scanCode:ok") {
          //二维码读取成功
          teamCheckIn(t.result);
        } else {
          //二维码读取失败
          Taro.showModal({
            title: "扫码失败!",
            content: t.errMsg,
          })
        }
      }
  });
}

const teamCheckIn = async (teamData: string) => {
  const data = JSON.parse(teamData);
  codeType.value = data.type;
  let content = data.type===1?data.team_id:data.code;
  code.value = content;
  await checkIn({
    code_type: data.type,
    content: content+"",
  })
}
</script>
