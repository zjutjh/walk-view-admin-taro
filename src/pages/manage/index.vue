<template>
<view>
    <view class="manageTitle">管理员: {{ admin.getName() }}</view>
    <view class="btnWrap">
        <button class="btn" v-if="admin.getPoint() === 0">查看团队</button>
        <button class="btn" v-if="admin.getPoint() === 0">管理功能</button>
        <button class="btn" v-if="admin.getPoint() !== 0" @tap="checkIn">签到打卡</button>
        <button class="btn" @tap="showStateModal">手动设置团队成员状态</button>
    </view>
</view>
</template>

<script setup lang="ts">
import "./index.css"
import { useAdminStore } from '../../stores/admin';
import Taro from "@tarojs/taro";

const admin = useAdminStore();

const checkIn = () => {
    Taro.navigateTo({
    url: "/pages/scanTeam/index",
  });
}

const showStateModal = () => {
    wx.showModal({
        editable: true,
        placeholderText: "团队ID",
        success: (res) => {
            if(res.confirm) {
                //跳转团队信息
                Taro.navigateTo({
                    url: "/pages/teamInfo/index?code="+res.content+"&codeType=1",
                });
            }
        }
    })
}

</script>
