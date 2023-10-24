<template>
  <view class="content-wrapper">
    <input class="num-input" type="text" placeholder="请输入队员序号（1，2，3，4，5，6)" v-model="number"/>
    <view class="button-wrapper">
      <view>
        <button class="child" type="submit" @tap="getBack()">返回</button>
        <button class="child" type="submit" :style="{top: '100px',background: 'red'}" @tap="changeWalkStatus(2)">放弃</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {postHandleMember} from "../../services/services/memberService";
import {useMembersStore} from "../../stores/members";
import Taro from "@tarojs/taro";
import "./index.css";

const membersStore = useMembersStore();

const walkStatusChange = ref(-1);
const number = ref();
const changeWalkStatus = async (val: number) => {
  if(val === 1) {
    walkStatusChange.value = 1;
  }
  else if(val === 2) {
    walkStatusChange.value = 2;
  }
  number.value = parseInt(number.value.toString());
  if(number.value === 1 || number.value === 2 || number.value === 3 || number.value === 4 || number.value === 5 || number.value === 6) {

    await Taro.showModal({
      title: "请确定姓名是否为:" + membersStore.originMembersStorage[parseInt(number.value.toString()) - 1].name,
      success: async (res) => {
        if (res.confirm) {
          membersStore.dealMember(membersStore.originMembersStorage[parseInt(number.value.toString()) - 1].user_id, walkStatusChange.value);
          await postHandleMember({
            user_id: membersStore.originMembersStorage[parseInt(number.value.toString()) - 1].user_id,
            walk_status: walkStatusChange.value
          });
          await Taro.showToast({
            title: "录入成功",
            icon: "success"
          });
          await Taro.navigateTo({
            url: "/pages/teamInfo.index",
          });
        }
      }
    });
    //更新 store

  }else {
    await Taro.showToast({
      title: "队员序号输入有误",
      icon: "error"
    });
    return;
  }
};
const getBack = () => {
  Taro.navigateTo({
    url: "/pages/teamInfo/index",
  });
};
</script>
