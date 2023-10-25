import {useJwtStore} from "../../stores/jwt";
import Taro from "@tarojs/taro";
import apis from "../api/apis";
import {TeamStatus} from "../../types/teamStatus";
import {useTeamStore} from "../../stores/team";

interface teamData {
  team_id: number
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
  if (res.data.msg === "ok" ){
    console.log("get team data success");
    return res.data.data;
  }
  else {
    console.log("get team data failed");
    return false;
  }
}

async function postTeamScanCode(
  data: teamData
) {
  await Taro.request({
    method: "POST",
    url: apis.team.teamScanCode,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (res) {
      console.log(res);
      if (res.data.code === 200 && res.data.msg === "ok") {
        console.log("team scan code success");
        Taro.showToast({
          title: "团队扫码成功",
          icon: "success",
        });

        const teamStore = useTeamStore();
        teamStore.setTeamId(data.team_id);

        Taro.navigateTo({
          url:"/pages/teamInfo/index",
        });
      }
      if(res.data.code === -1) {
        console.log("team scan code failed");
        Taro.showToast({
          title: "权限不足",
          icon: "error",
        });
      }
    },
    fail: function (res) {
      console.error(res);
    }
  });
}

async function letGoTeam (
  data: teamData): Promise<boolean>{
  let res ;
  await Taro.request({
    url: apis.team.teamPass,
    method: "POST",
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    fail: function () {
      return false;
    },
    success: function (resT){
      res = resT.data;
    }
  });
  if(res.code === 200) {
    await Taro.showToast({
      title: "放行成功!",
      icon: "success",
    });
    await Taro.navigateTo({
      url: "/pages/scanTeam/index"
    });
    return true;
  }
  else {
    await Taro.showToast({
      title: res.msg,
      icon: "error",
    });
    return false;
  }
}

export {getTeamStatus, postTeamScanCode , letGoTeam };
