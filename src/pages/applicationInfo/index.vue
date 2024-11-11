<template>
  <view>
    <view class="appInfoTitle">五条路线报名情况</view>
    <view class="appInfoTableHeader">
      <view class="cell">路线</view>
      <view class="cell">类型</view>
      <view class="cell">队伍数量</view>
      <view class="cell">总数</view>
    </view>
    <view v-for="campusData in submitData" class="appInfoWrap1">
      <view v-for="teamData in campusData" class="appInfoWrap2">
        <view class="cellRoute">{{ teamData.Route }}</view>
        <view class="cell">{{ teamData.TeamType }}</view>
        <view class="cell">{{ teamData.TeamNum }}</view>
        <view class="cell">{{ teamData.TotalNum }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getSubmitDetail } from "../../services/services/adminService";
import { useAdminStore } from "../../stores/admin";
import "./index.css"

const adminStore = useAdminStore();

const submitData = ref();

onMounted(async () => {
  submitData.value = await getSubmitDetail({
    secret: adminStore.getSecret()+""
  });
  console.log(submitData.value);
})

</script>