<template>
  <view>
    <view class="titleBar">队伍重组</view>
    <view class="tips">tips: 第一个添加的将作为队长 最多添加6人</view>
    <button class="btn" @tap="addMember">扫码添加</button>
    <view class="membersWarp">
      <view class="newMember" v-for="(mem, index) in membersName">
        成员{{ index+1 }}id: {{ mem }}
        <view class="deleteBtn" @tap="() => delMember(index)">删除</view>
      </view>
    </view>
    <picker mode="selector" :range="campus" @change="onChangeCampus" class="campusPicker">
      已选择{{ campus[chosenCampus] }}
    </picker>
    <button class="btn" @tap="rebuild" v-if="membersJwt && membersJwt.length>0">提交团队</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "./index.css"
import { wxScan } from "../../services/services/wxService";
import Taro from "@tarojs/taro";
import { rebuildTeam } from "../../services/services/teamService";
import { useAdminStore } from "../../stores/admin";

const admin = useAdminStore();
const membersJwt = ref<string[]>();// 存放成员jwt
membersJwt.value = [];
const membersName = ref<string[]>();// 存放成员name
membersName.value = [];

const campus = ['朝晖', '屏峰半程', '屏峰全程', '莫干山半程', '莫干山全程'];
const chosenCampus = ref(0);

const addMember = () => {
  wxScan({
    success: (res) => {
      const data = JSON.parse(res);
      let flag = true; // 查重
      if(membersJwt.value && membersName.value) {
        for(let i=0; i<membersJwt.value?.length; i++) {
          if(membersJwt.value[i] === data.jwt) flag = false;
        }
        if(flag) {
          membersJwt.value.push(data.jwt);
          membersName.value.push(data.name);
        } else {
          Taro.showModal({
            title: "重复扫码"
          })
        }
      }
    },
    fail: (errMsg) => {
      Taro.showModal({
        title: "扫码错误",
        content: errMsg,
      })
    }
  })
}

const delMember = (index: number) => {
  membersJwt.value?.splice(index, 1);
  membersName.value?.splice(index, 1);
}

const rebuild = async () => {
  const suc = await rebuildTeam({
    jwts: membersJwt.value as string[],
    secret: admin.getSecret()+"",
    route: 1+chosenCampus.value,
  })
  if(suc) {
    Taro.navigateTo({
      url: "/pages/manage/index"
    })
  }
}

const onChangeCampus = (e) => {
  chosenCampus.value = e.detail.value;
}

</script>
