import Taro from "@tarojs/taro";

import { useJwtStore } from "../../stores/jwt";
import { TeamStatus } from "../../types/teamStatus";
import apis from "../api/apis";
import { reportErrModal } from "./wxService";

const jwt = useJwtStore();

interface teamRequest {
  code_type: number,
  content: string
}

async function getTeamStatus(
  data: teamRequest
): Promise<TeamStatus | boolean> {
  let res;
  await Taro.request({
    method: "GET",
    url: apis.team.teamStatus,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function(resData) {
      res = resData;
    },
    fail(failRes) {
      reportErrModal(failRes.errMsg);
    }
  });
  if (res.data.msg === "ok") {
    return res.data.data;
  }

  return false;

}

interface teamBindRequest {
  team_id: number,
  code: string,
  type: number
}

async function bindTeamCode(
  data: teamBindRequest
): Promise<boolean> {
  await Taro.request({
    method: "POST",
    url: apis.team.teamBind,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function(resData) {
      if (resData.data.code === 200) {
        wx.showModal({
          title: "绑定成功"
        });
        return true;
      }
      wx.showModal({
        title: "绑定失败",
        content: resData.data.msg
      });

    },
    fail(res) {
      reportErrModal(res.errMsg);
    }
  });
  return false;
}

interface commitTeamRequest {
  team_id: number,
  secret: string,
}

const commitTeam = async (
  data: commitTeamRequest
): Promise<boolean> => {
  await Taro.request({
    method: "POST",
    url: apis.team.commitTeam,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function(resData) {
      if (resData.data.code === 200) {
        wx.showModal({
          title: "提交成功"
        });
        return true;
      }
      wx.showModal({
        title: "提交失败",
        content: resData.data.msg
      });

    },
    fail(res) {
      reportErrModal(res.errMsg);
    }
  });
  return false;
};

export interface rebuildTeamRequest {
  jwts: string[],
  secret: string,
  /** 1 是朝晖路线，2 屏峰半程，3 屏峰全程，4 莫干山半程，5 莫干山全程 */
  route: number,
  name: string,
  slogon: string
}

const rebuildTeam = async (
  data: rebuildTeamRequest
): Promise<boolean> => {
  let sucFlag = false;
  await Taro.request({
    method: "POST",
    url: apis.team.rebuildTeam,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: (resData) => {
      if (resData.data.code === 200) {
        wx.showModal({
          title: "重组队伍成功",
          cancelText: "留在此页",
          confirmText: "往回主页",
          success: (res) => {
            if (res.confirm) {
              Taro.navigateTo({
                url: "/pages/manage/index"
              });
            }
          }
        });
        sucFlag = true;
      } else {
        wx.showModal({
          title: "重组队伍失败",
          content: resData.data.msg
        });
      }
    },
    fail(res) {
      reportErrModal(res.errMsg);
    }
  });
  return sucFlag;
};

interface verifyTeamRequest {
  team_id: number,
  status: number
}

const verifyTeamDestination = async (
  data: verifyTeamRequest
): Promise<boolean> => {
  let sucFlag = false;
  await Taro.request({
    method: "POST",
    url: apis.team.verifyTeam,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function(resData) {
      if (resData.data.code === 200) {
        wx.showModal({
          title: "确认队伍成功"
        });
        sucFlag = true;
      } else {
        wx.showModal({
          title: "确认队伍失败",
          content: resData.data.msg
        });
      }
    },
    fail(res) {
      reportErrModal(res.errMsg);
    }
  });
  return sucFlag;
};

export { bindTeamCode, commitTeam, getTeamStatus, rebuildTeam, verifyTeamDestination };
