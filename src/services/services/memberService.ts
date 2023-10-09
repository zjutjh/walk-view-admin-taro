import {useJwtStore} from "../../stores/jwt";
import Taro from "@tarojs/taro";
import apis from "../api/apis";
import {useMembersStore} from "../../stores/members";

interface scanCodeMemberData {
	jwt: string,
	walk_status: number,//1为继续走，2 为放弃
}

interface handleMemberData {
  id: number
	user_id: string,//也是 openid
	walk_status: number,//1为继续走，2 为放弃
}

const jwt = useJwtStore();

async function postScanCodeMember(
  data: scanCodeMemberData
) {
  await Taro.request({
    method: "POST",
    url: apis.user.userScanCode,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (res) {
      console.log(res);
      if (res.data.code === 200) {
        console.log("member scan code success");
        useMembersStore().dealMember(res.data.data.open_id,data.walk_status);
        Taro.showToast({
          title: "扫码成功",
          icon: "success",
        });
      }
    },
    fail: function (res) {
      console.error(res);
    }
  });
}

async function postHandleMember(
  data: handleMemberData
) {
  await Taro.request({
    method: "POST",
    url: apis.user.userPass,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
    success: function (res) {
      console.log(res);
      if (res.data.code === 200) {
        console.log("handle member success");
        useMembersStore().handleMember(data.id,data.walk_status);
        Taro.showToast({
          title: "处理成功",
          icon: "success",
        });
      }
      else if(res.data.code === -1) {
        console.log("handle member failed");
        Taro.showToast({
          title: "请先扫团队扫码",
          icon: "error",
        });
      }
    }
  });
}

export {postScanCodeMember, postHandleMember};
