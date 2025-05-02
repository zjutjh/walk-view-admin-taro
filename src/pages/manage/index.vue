<template>
  <view>
    <view class="manageTitle">
      <view>管理员: {{ admin.getName() }}</view>
      <view>路线: {{ route[admin.getRoute()] }}</view>
      <view>点位: {{ admin.getPoint() }}</view>
    </view>
    <view class="btnWrap" v-show="pageState === 0">
      <button class="btn" v-if="admin.getPoint() === '起点'" @tap="() => pageTo(1)">起点操作</button>
      <button class="btn" v-if="admin.getPoint() === '起点'" @tap="() => pageTo(4)">终点操作</button>
      <button class="btn" v-if="admin.getPoint() === '起点'" @tap="management">管理功能</button>
      <button class="btn" v-if="admin.getPoint() !== '起点'" @tap="checkIn">扫码签到</button>
      <button class="btn" v-if="admin.getPoint() !== '起点'" @tap="inputIn">输入签到</button>
    </view>
    <view class="btnWrap" v-show="pageState === 1">
      <view class="operationTitle">起点操作</view>
      <button class="btn" @tap="inquiryByScan">团队码查询</button>
      <button class="btn" @tap="inquiryById">团队id查询</button>
      <button class="btn" @tap="() => pageTo(0)">返回</button>
    </view>
    <view class="btnWrap" v-show="pageState === 2">
      <view class="operationTitle">管理功能</view>
      <button class="btn" @tap="pageToRebuildTeam">重组队伍</button>
      <button class="btn" @tap="() => pageTo(3)">直接提交团队</button>
      <button class="btn" @tap="pageToStats">查看五条路线情况</button>
      <button class="btn" @tap="pageToApplication">查看报名信息</button>
      <button class="btn" @tap="() => pageTo(0)">返回</button>
    </view>
    <view class="btnWrap" v-show="pageState === 3">
      <view class="operationTitle">直接提交团队</view>
      <!-- <button class="btn" @tap="commitTeamByScan">团队码提交</button> -->
      <button class="btn" @tap="commitTeamById">团队id提交</button>
      <button class="btn" @tap="() => pageTo(2)">返回</button>
    </view>
    <view class="btnWrap" v-show="pageState === 4">
      <view class="operationTitle">终点操作</view>
      <button class="btn" @tap="verifyTeamByScan">二维码查询</button>
      <button class="btn" @tap="verifyTeamById">团队id查询</button>
      <button class="btn" @tap="() => pageTo(0)">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.css";
import { useAdminStore } from "../../stores/admin";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { wxScan, wxModal } from "../../services/services/wxService";
import { verifyPassword } from "../../services/services/adminService";
import { commitTeam } from "../../services/services/teamService";

const admin = useAdminStore();
const pageState = ref(0); // 0为基础页 1为查看团队 2为管理功能
const route: string[] = ["", "朝晖路线","屏峰半程","屏峰全程","莫干山半程","莫干山全程"];

const checkIn = () => {
  Taro.navigateTo({
    url: "/pages/scanTeam/index",
  });
};

const inputIn = () => {
  Taro.navigateTo({
    url: "/pages/inputTeam/index",
  });
};

const pageToStats = () => {
  Taro.navigateTo({
    url: "/pages/stats/index",
  });
};

const pageToRebuildTeam = () => {
  Taro.navigateTo({
    url: "/pages/rebuildTeam/index",
  });
};

const pageToApplication = () => {
  Taro.navigateTo({
    url: "/pages/applicationInfo/index",
  });
};

const pageTo = (page: number) => {
  pageState.value = page;
};


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
  });
};

const inquiryById = () => {
  wxModal({
    placeholderText: "团队ID",
    success: (content) => {
      //跳转团队信息
      Taro.navigateTo({
        url: "/pages/teamInfo/index?code="+content+"&codeType=1&showBind=true",
      });
    },
  });
};

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
  });
};

// 已弃用
// const commitTeamByScan = () => {
//   wxScan({
//     success: (code) => {
//       const data = JSON.parse(code);
//       if(data.type === 1) {
//         commitTeam({
//           team_id: data.team_id,
//           secret: admin.getSecret+"",
//         });
//       } else {
//         Taro.showModal({
//           title: "扫码失败",
//           content: "二维码类型错误，请扫团队码",
//         });
//       }
//     },
//     fail: (errMsg) => {
//       Taro.showModal({
//         title: "扫码失败",
//         content: errMsg,
//       });
//     }
//   });
// };

const commitTeamById = () => {
  wxModal({
    placeholderText: "团队ID",
    success: (content) => {
      commitTeam({
        team_id: Number.parseInt(content),
        secret: admin.getSecret()+"",
      });
    },
  });
};

const verifyTeamByScan = () => {
  wxScan({
    success: (code) => {
      const data = JSON.parse(code);
      const content = data.type === 1 ? data.team_id : data.code;
      Taro.navigateTo({
        url: "/pages/teamInfo/index?code=" + content + "&codeType=" + data.type +"&verifyData=true",
      });
    },
    fail: (errMsg) => {
      Taro.showModal({
        title: "扫码失败",
        content: errMsg,
      });
    }
  });
};

const verifyTeamById = () => {
  wxModal({
    placeholderText: "团队ID",
    success: (content) => {
      //跳转团队信息
      Taro.navigateTo({
        url: "/pages/teamInfo/index?code="+content+"&codeType=1&verifyData=true",
      });
    },
  });
};

</script>
