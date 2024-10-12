<template>
<view>
    <view class="manageTitle">管理员: {{ admin.getName() }}</view>
    <view class="btnWrap" v-show="pageState === 0">
        <button class="btn" v-if="admin.getPoint() === 0" @tap="() => pageTo(1)">查看团队</button>
        <button class="btn" v-if="admin.getPoint() === 0" @tap="management">管理功能</button>
        <button class="btn" v-if="admin.getPoint() !== 0" @tap="checkIn">签到打卡</button>
        <button class="btn" v-if="admin.getPoint() !== 0" @tap="showStateModal">手动设置团队成员状态</button>
    </view>
    <view class="btnWrap" v-show="pageState === 1">
        <button class="btn" @tap="inquiryByScan">团队码查询</button>
        <button class="btn" @tap="inquiryById">团队id查询</button>
        <button class="btn" @tap="() => pageTo(0)">返回</button>
    </view>
    <view class="btnWrap" v-show="pageState === 2">
        <button class="btn" @tap="pageToRebuildTeam">重组队伍</button>
        <button class="btn" @tap="() => pageTo(3)">直接提交团队</button>
        <button class="btn" @tap="pageToStats">查看五条路线情况</button>
        <button class="btn" @tap="() => pageTo(0)">返回</button>
    </view>
    <view class="btnWrap" v-show="pageState === 3">
        <button class="btn" @tap="commitTeamByScan">团队码提交</button>
        <button class="btn" @tap="commitTeamById">团队id提交</button>
        <button class="btn" @tap="() => pageTo(2)">返回</button>
    </view>
</view>
</template>

<script setup lang="ts">
import "./index.css"
import { useAdminStore } from '../../stores/admin';
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { wxScan, wxModal } from "../../services/services/wxService";
import { verifyPassword } from "../../services/services/adminService";
import { commitTeam } from "../../services/services/teamService";

const admin = useAdminStore();
const pageState = ref(0); // 0为基础页 1为查看团队 2为管理功能

const checkIn = () => {
    Taro.navigateTo({
        url: "/pages/scanTeam/index",
    });
}

const pageToStats = () => {
    Taro.navigateTo({
        url: "/pages/stats/index",
    })
}

const pageToRebuildTeam = () => {
    Taro.navigateTo({
        url: "/pages/rebuildTeam/index",
    })
}

const pageTo = (page: number) => {
    pageState.value = page;
}

const showStateModal = () => {
    wxModal({
        placeholderText: "团队ID",
        success: (content) => {
            Taro.navigateTo({
                url: "/pages/teamInfo/index?code="+content+"&codeType=1",
            });
        }
    })
}

const inquiryByScan = () => {
    wxScan({
        success: (code) => {
            const data = JSON.parse(code);
            if(data.type === 1) {
                Taro.navigateTo({
                    url: "/pages/teamInfo/index?code="+data.team_id+"&codeType=1"+"&showBind=true",
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
    wxModal({
        placeholderText: "团队ID",
        success: (content) => {
            //跳转团队信息
            Taro.navigateTo({
                url: "/pages/teamInfo/index?code="+content+"&codeType=1&showBind=true",
            });
        },
    })
}

const management = () => {
    wxModal({
        placeholderText: "管理员密码",
        success: async (password) => {
            if(await verifyPassword({secret: password})) {
                pageTo(2);
            } else {
                Taro.showModal({title: "密码错误"});
            }
        }
    })
}

const commitTeamByScan = () => {
    wxScan({
        success: (code) => {
            const data = JSON.parse(code);
            if(data.type === 1) {
                commitTeam({
                    team_id: data.team_id,
                    secret: admin.getSecret+"",
                })
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

const commitTeamById = () => {
    wxModal({
        placeholderText: "团队ID",
        success: (content) => {
            commitTeam({
                team_id: Number.parseInt(content),
                secret: admin.getSecret()+"",
            })
        },
    })
}

</script>
