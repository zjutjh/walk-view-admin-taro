<template>
  <view class="content-wrapper">
    <text class="title">团队身份认证</text>
    <team-scan-code />
    <input class="team-input" type="text" placeholder="如遇团队通行码扫码失败，请手动输入团队ID进入" v-model="handleTeamID"/>
    <button class="team-button" type="submit" @tap="handleInput">手动进入</button>
  </view>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import TeamScanCode from "../../components/TeamScanCode.vue";
import {postTeamScanCode} from "../../services/services/teamService";
import {useTeamStore} from "../../stores/team";
import Taro from "@tarojs/taro";

onMounted(() => {
});


const handleTeamID = ref("");
const teamStore = useTeamStore();
const handleInput = () => {
  postTeamScanCode({
    team_id: parseInt(handleTeamID.value.toString())
  });
  if(teamStore.team_id !== -1) {
    Taro.navigateTo({
      url:"/pages/teamInfo/index",
    });
  }
};

</script>
