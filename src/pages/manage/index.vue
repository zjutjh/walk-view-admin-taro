<template>
<view>
    <view class="manageTitle">管理员: {{ admin.getName() }}</view>
    <view class="btnWrap">
        <button class="btn" v-if="admin.getPoint() === 0">查看团队</button>
        <button class="btn" v-if="admin.getPoint() === 0">管理功能</button>
        <button class="btn" v-if="admin.getPoint() !== 0">签到打卡</button>
    </view>
</view>
</template>

<script setup lang="ts">
import "./index.css"
import { useAdminStore } from '../../stores/admin';

const admin = useAdminStore();
</script>
