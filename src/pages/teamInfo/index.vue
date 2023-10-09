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
      <view class="tr" v-for="(mem , index) in members" :key="index">
        <view class="td">{{ index }}</view>
        <view class="td">{{mem.name}}</view>
        <view class="td" :style="{
          color: mem.status===0 ? 'red' : 'white'
        }">{{walkStatus[mem.status]}}</view>
      </view>
    </view>
  </view>
  <view class="button-wrapper">
    <view>
      <button class="child" type="submit" @tap="pushToScanMember">扫码通行</button>
      <button class="child" type="submit" @tap="pushToHandleScanMember">手动输入队员序号</button>
      <button class="child" type="submit" @tap="login">提交团队</button>
      <button class="child" type="submit" @tap="login">放弃</button>
    </view>
  </view>
</view>
</template>

<script setup lang="ts">
import "./index.css";
import {onMounted, pushScopeId, ref} from "vue";
import {TeamStatus} from "../../types/teamStatus";
import {memberStorageType, useMembersStore} from "../../stores/members";
import {getTeamStatus} from "../../services/services/teamService";
import Taro from "@tarojs/taro";
import {useTeamStore} from "../../stores/team";
import {apis} from "@tarojs/plugin-platform-h5/dist/dist/definition.json";
import login = apis.login;
const teamStatus: string[] = ["未开始","未开始","进行中","扫码成功","放弃","完成"];
const route: string[] = ["朝晖路线","屏峰半程","屏峰全程","莫干山半程","莫干山全程"];
const walkStatus: string[] = ["未处理","以扫码放行","已放弃"];
const membersStore = useMembersStore();
const members = ref<memberStorageType[]>();
const teamData = ref<TeamStatus | boolean >();

// teamData.value = ref<TeamStatus | boolean >({ "admin": {
//   "admin_id": 1,
//   "name": "屏峰半程1号点",
//   "account": "crk",
//   "point": 1,
//   "route": 5
// },
// "member": [
//   {
//     "campus": 1,
//     "contact": {
//       "qq": "",
//       "tel": "19857313952",
//       "wechat": ""
//     },
//     "gender": 1,
//     "name": "甘凯哲",
//     "open_id": "+XUVWF1AwdFaW2aC4N8GRFVU8Rw8GJlwrML0H1wpij0=",
//     "walk_status": 4
//   },
//   {
//     "campus": 2,
//     "contact": {
//       "qq": "222",
//       "tel": "19857311393",
//       "wechat": "111"
//     },
//     "gender": 1,
//     "name": "惜寞",
//     "open_id": "4dag8rtffEmI5JCzj0JuKO19a2AK4c1+8DF4kYbfDtA=",
//     "walk_status": 4
//   },
//   {
//     "campus": 1,
//     "contact": {
//       "qq": "",
//       "tel": "19857313956",
//       "wechat": ""
//     },
//     "gender": 2,
//     "name": "麻长坤",
//     "open_id": "IpV/Ug177rOKmRaPEWZI2mPDQMEz5DFmpc/7uNXNIcY=",
//     "walk_status": 4
//   },
//   {
//     "campus": 2,
//     "contact": {
//       "qq": "357",
//       "tel": "13758285854",
//       "wechat": "159"
//     },
//     "gender": 2,
//     "name": "zhull",
//     "open_id": "YLRz+VvxsJSxHmkA2t2FuiluA5wm1oagCkHrJdKBFPM=",
//     "walk_status": 2
//   }
// ],
// "team": {
//   "allow_match": false,
//   "id": 4,
//   "name": "精弘网络",
//   "password": "114514",
//   "point": 0,
//   "route": 4,
//   "slogan": "派大星",
//   "start_num": 1,
//   "status": 2
// }});
onMounted(async () => {
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
      url: "pages/scanTeam/index"
    });
  }
  membersStore.initMembers(teamData.value["member"]);
  members.value = membersStore.getMembers();
  console.log(members);
});

const handleToggle = () => {
  Taro.scanCode({
    success: (res) => {
      console.log(res);
      if(res.errMsg === "scanCode:ok") {
        const result =  res.result;
        const resultJson = eval("(" + result + ")");
        let {jwt, time} = resultJson;
        time = time / 1000; // 毫秒转秒
        let now = new Date().getTime(); //拿到当前的时间戳
        now = now / 1000; // 毫秒转秒
        if(now - time > 15) {
          Taro.showToast({
            title: "二维码已过期",
            icon: "error"
          });
          return;
        }else if(now - time <= 15) {
          Taro.showToast({
            title: "扫码成功",
            icon: "success"
          });

          //发送请求到后端处理成员信息：放行、放弃
          return;
        }
      }
    }
  });
};

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
