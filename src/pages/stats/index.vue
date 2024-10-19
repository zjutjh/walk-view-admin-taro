<template>
    <view>
        <view class="titleBar">路线人数统计</view>

        <view class="statsTableWrapper" v-if="statsData">
            <view class="table">
                <view class="tr">
                    <view class="th">点位</view>
                    <view class="td" v-for="index of maxLength">{{ index==1?"未到人数":(index==2?"起点":index-2) }}</view>
                </view>
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
import { computed, onBeforeMount, ref } from "vue";

const admin = useAdminStore();

const statsData = ref();

const maxLength = computed(() => {
    let max = 0;
    max = max>statsData.value.mgsAll.length?max:statsData.value.mgsAll.length;
    max = max>statsData.value.mgsHalf.length?max:statsData.value.mgsHalf.length;
    max = max>statsData.value.pfAll.length?max:statsData.value.pfAll.length;
    max = max>statsData.value.pfHalf.length?max:statsData.value.pfHalf.length;
    max = max>statsData.value.zh.length?max:statsData.value.zh.length;
    return max;
})

onBeforeMount(async () => {
    console.log(await verifyPassword({ secret: admin.getSecret()+""}));
    if(true) { //确认密码正确性
        statsData.value = await getRouteDetail({secret: admin.getSecret()+""});
        console.log(statsData);
    }
})

</script>