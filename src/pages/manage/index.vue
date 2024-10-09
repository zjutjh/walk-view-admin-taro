<template>
<view>
    <view class="manageTitle">管理员: {{ admin.getName() }}</view>
    <view class="btnWrap" v-show="pageState === 0">
        <button class="btn" v-if="admin.getPoint() === 0" @tap="() => pageTo(1)">查看团队</button>
        <button class="btn" v-if="admin.getPoint() === 0" @tap="() => pageTo(2)">管理功能</button>
        <button class="btn" v-if="admin.getPoint() !== 0" @tap="checkIn">签到打卡</button>
        <button class="btn" v-if="admin.getPoint() !== 0" @tap="showStateModal">手动设置团队成员状态</button>
    </view>
    <view class="btnWrap" v-show="pageState === 1">
        <button class="btn" @tap="inquiryByScan">团队码查询</button>
        <button class="btn" @tap="inquiryById">团队id查询</button>
        <button class="btn" @tap="() => pageTo(0)">返回</button>
    </view>
    <view class="btnWrap" v-show="pageState === 2">
        
        <button class="btn" @tap="() => pageTo(0)">返回</button>
    </view>
</view>
</template>

<script setup lang="ts">
import "./index.css"
import { useAdminStore } from '../../stores/admin';
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { wxScan } from "../../services/services/scanService";

const admin = useAdminStore();
const pageState = ref(0); // 0为基础页 1为查看团队 2为管理功能

const checkIn = () => {
    Taro.navigateTo({
        url: "/pages/scanTeam/index",
    });
}

const pageTo = (page: number) => {
    pageState.value = page;
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

const inquiryByScan = () => {
    wxScan({
        success: (code) => {
            const data = JSON.parse(code);
            if(data.type === 1) {
                Taro.navigateTo({
                    url: "/pages/teamInfo/index?code="+data.code+"&codeType=1"+"&showBind=true",
                });
            } else {
                Taro.showModal({
                    title: "扫码失败",
                    content: "二维码类型错误，请扫团队码",
                });
            }
        },
        fail: (errMsg) => {
            Taro.showModal({
                title: "扫码失败",
                content: errMsg,
            });
        }
    })
}

const inquiryById = () => {
    wx.showModal({
        editable: true,
        placeholderText: "团队ID",
        success: (res) => {
            if(res.confirm) {
                //跳转团队信息
                Taro.navigateTo({
                    url: "/pages/teamInfo/index?code="+res.content+"&codeType=1&showBind=true",
                });
            }
        }
    })
}

</script>
