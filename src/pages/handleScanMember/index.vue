<template>
  <view class="content-wrapper">
    <input class="login-input" type="text" placeholder="请输入队员序号（1，2，3，4，5)" v-model="number"/>
    <view class="button-wrapper">
      <view>
        <button class="child" type="submit" @tap="changeWalkStatus(1)">放行该队员通行</button>
        <button class="child" type="submit" @tap="changeWalkStatus(2)">该队员放弃继续</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {postHandleMember} from "../../services/services/memberService";
import {useMembersStore} from "../../stores/members";
import Taro from "@tarojs/taro";

const membersStore = useMembersStore();

const walkStatusChange = ref(-1);
const number = ref();
const changeWalkStatus = (val: number) => {
  if(val === 1) {
    walkStatusChange.value = 1;
  }
  else if(val === 2) {
    walkStatusChange.value = 2;
  }
  number.value = parseInt(number.value.toString());
  if(number.value === 1 || number.value === 2 || number.value === 3 || number.value === 4 || number.value === 5) {
    postHandleMember({
      user_id: membersStore.membersStorage[parseInt(number.value.toString()) - 1].openId,
      walk_status: walkStatusChange.value
    });
    //更新 store
    membersStore.dealMember(membersStore.membersStorage[parseInt(number.value.toString()) - 1].openId, walkStatusChange.value);
    Taro.showToast({
      title: "录入成功",
      icon: "success"
    });
  }else {
    Taro.showToast({
      title: "队员序号输入有误",
      icon: "error"
    });
    return;
  }
};
</script>
