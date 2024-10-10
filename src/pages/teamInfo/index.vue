<template>
<view class="content-wrapper">
  <text class="title" v-if="teamData">
        {{teamData.admin.name + "管理员"}}
  </text>
  <view class="team-info-wrapper" v-if="teamData">
      <view class="team-info">
           <text class="left">{{"队伍id"}}</text>
           <text class="right">{{teamData.team.id}}</text>
      </view>
      <view class="team-info">
          <text class="left">{{"队伍名称"}}</text>
          <text class="right">{{teamData.team.name}}</text>
      </view>
      <view class="team-info">
          <text class="left">{{"队伍路线"}}</text>
          <text class="right">{{route[teamData.team.route]}}</text>
      </view>
      <view class="team-info">
          <text class="left">{{"队伍人数"}}</text>
          <text class="right">{{teamData.member.length}}</text>
      </view>
      <view class="team-info">
          <text class="left">{{"队伍状态"}}</text>
          <text class="right">{{teamStatus[teamData.team.status]}}</text>
      </view>
  </view>
  <view class="table-wrapper">
    <view class="table">
      <view class="tr">
        <view class="th">成员id</view>
        <view class="th">成员名称</view>
        <view class="th">操作</view>
        <view class="th">成员状态</view>
      </view>
      <view class="tr" v-for="(mem , index) in members" :key="index">
        <view class="td">{{ index }}</view>
        <view class="td">{{mem.name}}</view>
        <view class="td" :style="{
          color: mem.status===0 ? 'red' : 'black'
        }">{{walkStatus[mem.status]}}</view>
        <view class="td" @tap="() => changeMemberState(mem.jwt, mem.status)">{{ userState[mem.status] }}</view>
      </view>
    </view>
  </view>
  <button v-show="showBind" @tap="teamBind">团队绑定</button>
</view>
</template>

<script setup lang="ts">
import "./index.css";
import {onMounted, ref} from "vue";
import {TeamStatus} from "../../types/teamStatus";
import {memberStorageType, useMembersStore} from "../../stores/members";
import {getTeamStatus} from "../../services/services/teamService";
import Taro from "@tarojs/taro";
import { getCurrentInstance } from "@tarojs/runtime";
import { setUserState } from "../../services/services/userService";
import { bindTeamCode } from "../../services/services/teamService";
import { wxScan } from "../../services/services/wxService";

const teamStatus: string[] = ["未开始","未开始","进行中","扫码成功","放弃","完成"];
const route: string[] = ["朝晖路线","屏峰半程","屏峰全程","莫干山半程","莫干山全程"];
const walkStatus: string[] = ["", "未开始", "进行中", "扫码成功", "放弃", "完成"];
const userState: string[] = ["", "成员未到", "下撤", "下撤", "取消下撤", "已完成"];
const membersStore = useMembersStore();
const members = ref<memberStorageType[]>();
const teamData = ref<TeamStatus>();
const { router } = getCurrentInstance();
const showBind = ref<boolean>(router?.params.showBind as boolean);

const initData = async () => {
  const data = {
    code_type: router?.params.codeType as number,
    content: router?.params.code+"",
  };
  
  let resdata = await getTeamStatus(data);
  if(!resdata) {
    await Taro.showModal({
      title: "获取团队信息失败!",
      content: "权限不够或者登录有误!"
    });
    await Taro.navigateTo({
      url: "pages/scanTeam/index"
    });
  }
  teamData.value = resdata as TeamStatus;
  membersStore.initMembers(teamData.value["member"]);
  members.value = membersStore.getMembers();
}

const changeMemberState = async (openId: string, status: number) => {
  //---------待更改----------
  if(status === 5) { //完成
    Taro.showModal({
      title: "无法操作",
      content: teamStatus[status]+"状态下无法操作",
    })
  } else { // 进行中 || 未开始
    let suc = await setUserState({
      user_id: openId,
      status: status===4? 1 : 2, //状态待处理
    })
    if(suc) { initData(); }
  }
}

const teamBind = async () => {
  wx.showModal({
    title: "签到码",
    content: "请扫签到码",
    success: () => {
        wxScan({
          success: (code) => {
            const checkCodeJson = JSON.parse(code); //签到码json
            bindTeamCode({
              team_id: Number.parseInt(router?.params.code as string),
              code: checkCodeJson.code+"",
              type: checkCodeJson.type,
            })
          },
          fail: (errMsg) => {
            Taro.showModal({
              title: "扫码失败!",
              content: errMsg,
            })
          }
        })
    }
  })
}

onMounted(initData);

</script>
