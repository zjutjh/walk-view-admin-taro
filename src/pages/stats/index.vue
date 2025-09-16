<template>
  <view>
    <view class="titleBar">路线人数统计</view>
    <view v-if="routeData" class="wrap">
      <!-- 此处 v-show 用于隐藏莫干山半程统计信息 可以在必要时开启 -->
      <view v-for="(route, index) in routeInfo" v-show="route[0] != 'mgsHalf'" :key="index" class="table-container">
        <view class="table-header">
          <view class="header-cell">{{ route[1] }}</view>
          <view class="header-cell" v-for="(point, index) in routeData[route[0]]" :key="index">{{ point.label }}</view>
        </view>
        <view class="table-row">
          <view class="row-cell">人数</view>
          <view class="row-cell" v-for="(point, index) in routeData[route[0]]" :key="index">{{ point.count }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.css";
import { useAdminStore } from "../../stores/admin";
import { getRouteDetail, verifyPassword } from "../../services/services/adminService";
import { onBeforeMount, ref } from "vue";

const admin = useAdminStore();
const routeData = ref();

const routeInfo = [
  ["zh", "朝晖路线"],
  ["pfHalf", "屏峰半程"],
  ["pfAll", "屏峰全程"],
  ["mgsHalf", "莫干山半程"],
  ["mgsAll", "莫干山全程"],
];

onBeforeMount(async () => {
  if(await verifyPassword({ secret: admin.getSecret()+""})) { //确认密码正确性
    routeData.value = await getRouteDetail({secret: admin.getSecret()+""});
  }
});

</script>