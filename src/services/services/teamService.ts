import {useJwtStore} from "../../stores/jwt";
import Taro from "@tarojs/taro";
import apis from "../api/apis";
import {TeamStatus} from "../../types/teamStatus";

interface teamData {
  code_type: number,
  content: string
}

interface teamBindData {
  team_id: number,
  code: string,
  type: number
}

const jwt = useJwtStore();

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
  console.log(res);
  if (res.data.msg === "ok" ){
    console.log("get team data success");
    return res.data.data;
  }
  else {
    console.log("get team data failed");
    return false;
  }
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

export { getTeamStatus , bindTeamCode };
