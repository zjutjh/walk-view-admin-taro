import {useJwtStore} from "../../stores/jwt";
import Taro from "@tarojs/taro";
import apis from "../api/apis";
import {TeamStatus} from "../../types/teamStatus";
import { reportErrModal } from "./wxService";

const jwt = useJwtStore();

interface teamData {
  code_type: number,
  content: string
}

async function getTeamStatus(
  data: teamData
): Promise<TeamStatus | boolean> {
  let res;
  await Taro.request({
    method: "GET",
    url: apis.team.teamStatus,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (resData) {
      res = resData;
    },
    fail(res) { reportErrModal(res.errMsg); }
  });
  if (res.data.msg === "ok" ){
    console.log("get team data success");
    return res.data.data;
  }
  else {
    console.log("get team data failed");
    return false;
  }
}

interface teamBindData {
  team_id: number,
  code: string,
  type: number
}

async function bindTeamCode(
  data: teamBindData
): Promise<boolean> {
  await Taro.request({
    method: "POST",
    url: apis.team.teamBind,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (resData) {
      if(resData.data.code === 200) {
        wx.showModal({
          title: "绑定成功"
        })
        return true;
      } else {
        wx.showModal({
          title: "绑定失败",
          content: resData.data.msg,
        })
      }
    },
    fail(res) { reportErrModal(res.errMsg); }
  })
  return false;
}

interface commitTeamData {
  team_id: number,
  secret: string,
}

const commitTeam = async (
  data: commitTeamData
): Promise<boolean> => {
  await Taro.request({
    method: "POST",
    url: apis.team.commitTeam,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (resData) {
      if(resData.data.code === 200) {
        wx.showModal({
          title: "提交成功"
        })
        return true;
      } else {
        wx.showModal({
          title: "提交失败",
          content: resData.data.msg,
        })
      }
    },
    fail(res) { reportErrModal(res.errMsg); }
  })
  return false;
}

interface rebuildTeamData {
  jwts: string[],
  secret: string,
  route: number
}

const rebuildTeam = async (
  data: rebuildTeamData
): Promise<boolean> => {
  let sucFlag = false;
  await Taro.request({
    method: "POST",
    url: apis.team.rebuildTeam,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (resData) {
      if(resData.data.code === 200) {
        wx.showModal({
          title: "重组队伍成功"
        })
        sucFlag = true;
      } else {
        wx.showModal({
          title: "重组队伍失败",
          content: resData.data.msg,
        })
      }
    },
    fail(res) { reportErrModal(res.errMsg); }
  })
  return sucFlag;
}

interface verifyTeamData {
  team_id: number,
  status: number
}

const verifyTeamDestination = async (
  data: verifyTeamData
): Promise<boolean> => {
  let sucFlag = false;
  await Taro.request({
    method: "POST",
    url: apis.team.verifyTeam,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (resData) {
      if(resData.data.code === 200) {
        wx.showModal({
          title: "确认队伍成功"
        })
        sucFlag = true;
      } else {
        wx.showModal({
          title: "确认队伍失败",
          content: resData.data.msg,
        })
      }
    },
    fail(res) { reportErrModal(res.errMsg); }
  })
  return sucFlag;
}

export { getTeamStatus , bindTeamCode, commitTeam, rebuildTeam ,verifyTeamDestination};
