<template>
    <view>
        <view class="titleBar">路线人数统计</view>

        <view class="table-wrapper" v-if="statsData">
            <view class="table">
                <view class="tr">
                    <view class="th">莫干山全程</view>
                    <view class="td" v-for="num in statsData.mgsAll">{{ num }}</view>
                </view>
                <view class="tr">
                    <view class="th">莫干山半程</view>
                    <view class="td" v-for="num in statsData.mgsHalf">{{ num }}</view>
                </view>
                <view class="tr">
                    <view class="th">屏峰全程</view>
                    <view class="td" v-for="num in statsData.pfAll">{{ num }}</view>
                </view>
                <view class="tr">
                    <view class="th">屏峰半程</view>
                    <view class="td" v-for="num in statsData.pfHalf">{{ num }}</view>
                </view>
                <view class="tr">
                    <view class="th">朝晖</view>
                    <view class="td" v-for="num in statsData.zh">{{ num }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import "./index.css"
import { useAdminStore } from "../../stores/admin";
import { getRouteDetail, verifyPassword } from "../../services/services/adminService";
import { onBeforeMount, ref } from "vue";

const admin = useAdminStore();

const statsData = ref();

onBeforeMount(async () => {
    console.log(await verifyPassword({ secret: admin.getSecret()+""}));
    if(true) { //确认密码正确性
        statsData.value = await getRouteDetail({secret: admin.getSecret()+""});
        console.log(statsData);
    }
})

</script>