import {useJwtStore} from "../../stores/jwt";
import Taro from "@tarojs/taro";
import apis from "../api/apis";
import {useMembersStore} from "../../stores/members";
import {ref} from "vue";

interface scanCodeMemberData {
	jwt: string,
	walk_status: number,//1为继续走，2 为放弃
}

interface handleMemberData {
	user_id: string,//也是 openid
	walk_status: number,//1为继续走，2 为放弃
}

interface memberListData {
  user: handleMemberData[],
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
        Taro.showToast({
          title: "扫码成功",
          icon: "success",
        });
        Taro.navigateTo({
          url: "/pages/teamInfo/index"
        });
      }
      else {
        Taro.showToast({
          title: res.data.msg,
          icon: "error",
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
    success: async function (res) {
      console.log(res);
      if (res.data.code === 200) {
        await useMembersStore().deletByUserId(data.user_id);
        console.log("handle member success");
        await Taro.showToast({
          title: "处理成功",
          icon: "success",
        });
      }
      else if(res.data.code === -1) {
        console.log("handle member failed");
        Taro.showToast({
          title: res.data.msg,
          icon: "error",
        });
      }
    }
  });
}

async function postMemberList(data: memberListData): Promise<boolean> {
  console.log(data);
  const suc = ref(false);
  await Taro.request({
    method: "POST",
    url: apis.user.userList,
    data: data,
    header: {
      "Authorization": "Bearer " + jwt.getJwt()
    },
  }).then((res) => {
    console.log(res);
    if (res.data.code === 200) {
      console.log("批量方放行成功");
      suc.value = true;
    }
    else {
      Taro.showToast({
        title: res.data.msg,
        icon: "error",
      });
      suc.value = false;
    }
  });
  return suc.value;
}

export {postScanCodeMember, postHandleMember , postMemberList};
