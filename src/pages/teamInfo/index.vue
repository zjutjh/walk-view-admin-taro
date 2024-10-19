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
    <view class="tips">
      蓝色为学生 红色为教师
    </view>
    <view class="table">
      <view class="tr">
        <view class="th">成员id</view>
        <view class="th">成员名称</view>
        <view class="th">成员状态</view>
        <view class="th">操作</view>
      </view>
      <view class="tr" :class="mem.type===1?'stuTr':'teaTr'" v-for="(mem , index) in members" :key="index">
        <view class="td">{{ index }}</view>
        <view class="td">{{mem.name}}</view>
        <view class="td">{{walkStatus[mem.status]}}</view>
        <view class="td pickerTd" @tap="() => changeMemberState(mem.jwt)">
          {{ userState[mem.status] }}
        </view>
      </view>
    </view>
  </view>
  <button v-show="showBind" @tap="teamBind">团队绑定</button>
  <button v-show="showBind" @tap="allMembersArrived">全部签到</button>
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

const allMembersArrived = async () => {
  let membersData;
  if(members.value) {
    membersData = [];
    for(let i=0; i<members.value.length; i++) {
      membersData.push({
        user_id: members.value[i].jwt,
        status: 1,
      })
    }
    let suc = await setUserState({list: membersData});
    let title;
    if(suc) title = "全部签到成功";
    else title = "签到失败";
    Taro.showModal({title: title});
  }
  initData();
}

const changeMemberState = async (openId: string) => {
  let choice;
  await Taro.showModal({
    title: "选择成员状态",
    confirmText: "继续走",
    cancelText: "下撤",
    success: (res) => {
      if(res.confirm) choice = 1; //继续走
      else choice = 2; //下撤
    }
  })
  let suc = await setUserState({list: [{
    user_id: openId,
    status: choice, //状态待处理
  }]})
  if(suc) { initData(); }
}

const teamBind = async () => {
  wx.showModal({
    title: "签到码",
    content: "请扫签到码",
    success: () => {
        wxScan({
          success: (code) => {
            console.log(code);
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
