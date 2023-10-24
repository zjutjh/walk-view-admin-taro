<template>
<view class="content-wrapper">
  <text class="title">
        {{teamData.admin.name + "管理员"}}
  </text>
  <view class="team-info-wrapper">
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
      </view>
      <view class="tr" v-for="(mem , index) in teamData.member" :key="index">
        <view class="td">{{ index + 1}}</view>
        <view class="td">{{mem.name}}</view>
        <view class="td" >{{walkStatus[mem.walk_status]}}</view>
      </view>
    </view>
  </view>
  <view class="button-wrapper">
    <view>
      <button class="child" type="submit" @tap="pushToScanMember">扫码通行</button>
      <button class="child" type="submit" @tap="pushToHandleScanMember">手动输入放弃队员序号</button>
      <button class="child"  type="submit" @tap="letGo()">
        {{"放行团队"}}
      </button>
      <button class="child" :style="{background: '#169bd5'}" type="submit" @tap="getBack()">返回</button>
    </view>
  </view>
</view>
</template>

<script setup lang="ts">
import "./index.css";
import {onBeforeMount, onMounted, ref} from "vue";
import {TeamStatus} from "../../types/teamStatus";
import {memberStorageType, useMembersStore} from "../../stores/members";
import {getTeamStatus, letGoTeam , postTeamScanCode} from "../../services/services/teamService";
import Taro, {useDidShow} from "@tarojs/taro";
import {useTeamStore} from "../../stores/team";
import {apis} from "@tarojs/plugin-platform-h5/dist/dist/definition.json";
import login = apis.login;
import {postMemberList} from "../../services/services/memberService";
const teamStatus: string[] = ["数据错误","未开始","进行中","未完成","完成","扫码成功"];
const route: string[] = ["数据错误","朝晖路线","屏峰半程","屏峰全程","莫干山半程","莫干山全程"];
const walkStatus: string[] = ["数据错误","未开始","进行中","扫码成功","放弃","完成"];
const membersStore = useMembersStore();
const members = ref<memberStorageType[]>();
const teamData = ref<TeamStatus | boolean >();

function getBack() {
  Taro.navigateTo({
    url: "/pages/index/index",
  });
}
const canLetGo = ref<boolean>(false);

async function letGo () {
  if(!teamData.value) return;
  for(let idx = 0 ; idx < teamData.value["member"].length;idx++){
    if(teamData.value["member"][idx]["walk_status"] === 4)
      useMembersStore().deletByUserId(teamData.value["member"][idx]["open_id"]);
  }
  if (await postMemberList({
    user: membersStore.getMembers()
  }))
  {
    const data = {
      team_id: useTeamStore().getTeamId(),
    };
    await letGoTeam(data);
  }
  else {
    await Taro.showToast({
      icon: "error",
      title: "成员放行失败!"
    });
  }
}



useDidShow(async () => {
  const data = {
    team_id: useTeamStore().getTeamId()
  };
  teamData.value = await getTeamStatus(data);
  if(!teamData.value) {
    await Taro.showModal({
      title: "获取团队信息失败!",
      content: "权限不够或者登录有误!"
    });
    await Taro.navigateTo({
      url: "/pages/scanTeam/index"
    });
  }
}
);

onBeforeMount(async () => {
  const data = {
    team_id: useTeamStore().getTeamId()
  };
  teamData.value = await getTeamStatus(data);
  if(!teamData.value) {
    await Taro.showModal({
      title: "获取团队信息失败!",
      content: "权限不够或者登录有误!"
    });
    await Taro.navigateTo({
      url: "/pages/scanTeam/index"
    });
  }
  else {
    console.log(teamData.value);
    membersStore.initMembers(teamData.value["member"]);
    members.value = membersStore.getMembers();
    console.log(members);
    const len = members.value?.length;
    let ct = 0;
    for(let i = 0 ; i < len ; i ++) {
      if (members.value[i]["status"] === 1)
        ct ++;
    }
    if ( ct > len / 2 )
      canLetGo.value = true;
  }
});

const pushToScanMember = () => {
  Taro.navigateTo({
    url: "/pages/scanMember/index"
  });
};

const pushToHandleScanMember = () => {
  Taro.navigateTo({
    url: "/pages/handleScanMember/index"
  });
};
</script>
