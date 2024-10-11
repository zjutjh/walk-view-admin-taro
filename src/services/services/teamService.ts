import {useJwtStore} from "../../stores/jwt";
import Taro from "@tarojs/taro";
import apis from "../api/apis";
import {TeamStatus} from "../../types/teamStatus";

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
    fail: function (res) {
      console.error(res);
    }
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
    fail: function (res) {
      console.error(res);
    }
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
    fail: function (res) {
      console.error(res);
    }
  })
  return false;
}

export { getTeamStatus , bindTeamCode, commitTeam };
