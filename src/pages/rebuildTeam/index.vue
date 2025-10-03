<template>
  <view>
    <view class="titleBar">
      队伍重组
    </view>
    <view class="tips">
      tips: 第一个添加的将作为队长 最多添加6人
    </view>
    <button class="btn" @tap="addMember">
      扫码添加
    </button>
    <view class="membersWarp">
      <view v-for="(mem, index) in membersName" :key="index" class="newMember">
        成员{{ index+1 }}姓名: {{ mem }}
        <view class="deleteBtn" @tap="() => delMember(index)">
          删除
        </view>
      </view>
    </view>
    <picker
      mode="selector"
      :range="campus"
      class="campusPicker"
      @change="onChangeCampus"
    >
      已选择{{ campus[chosenCampus] }}
    </picker>
    <view class="newInfo">
      <input
        v-model="newTeamName"
        class="newInfoInput"
        type="text"
        placeholder="请输入新团队名"
      >
      <input
        v-model="newSlogon"
        class="newInfoInput"
        placeholder="请输入新口号"
      >
    </view>

    <button
      v-if="membersJwt && membersJwt.length>0"
      class="btn"
      @tap="rebuild({
        jwts: membersJwt as string[],
        secret: String(admin.getSecret()),
        route: 1 + chosenCampus,
        name: newTeamName,
        slogon: newSlogon
      });"
    >
      提交团队
    </button>
  </view>
</template>

<script setup lang="ts">
import "./index.css";

import Taro from "@tarojs/taro";
import { ref } from "vue";

import { rebuildTeam, rebuildTeamRequest } from "../../services/services/teamService";
import { wxScan } from "../../services/services/wxService";
import { useAdminStore } from "../../stores/admin";

const admin = useAdminStore();
/** 成员们的jwt */
const membersJwt = ref<string[]>([]);
/** 成员们的姓名 */
const membersName = ref<string[]>([]);

const campus = ["朝晖", "屏峰半程", "屏峰全程", "莫干山半程", "莫干山全程"];
const chosenCampus = ref<number>(0);

const newTeamName = ref<string>("");
const newSlogon = ref<string>("");

/** 扫入个人码 */
const addMember = () => {
  wxScan({
    success: (res) => {
      const data = JSON.parse(res);
      let flag = true; // 查重
      for (let i = 0; i < membersJwt.value.length; i++) {
        if (membersJwt.value[i] === data.jwt) {
          flag = false;
        }
      }
      if (flag) {
        membersJwt.value.push(data.jwt);
        membersName.value.push(data.name);
      } else {
        Taro.showModal({
          title: "重复扫码",
          showCancel: false
        });
      }

    },
    fail: (errMsg) => {
      Taro.showModal({
        title: "扫码错误",
        content: errMsg,
        showCancel: false
      });
    }
  });
};

const rebuild = async (data: rebuildTeamRequest) => {
  if (newTeamName.value === "" || newSlogon.value === "") {
    Taro.showModal({
      title: "请填写完整信息",
      showCancel: false
    });
    return;
  }
  rebuildTeam(data);
};

const delMember = (index: number) => {
  membersJwt.value.splice(index, 1);
  membersName.value.splice(index, 1);
};

const onChangeCampus = (e) => {
  chosenCampus.value = e.detail.value;
};

</script>
