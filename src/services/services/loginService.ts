import Taro from "@tarojs/taro";
import apis from "../apis/apiList";

interface loginData {
    account: string;
    password: string;
}

async function testLoginService(data: loginData) {
  await Taro.request({
      url: apis.login.testLogin,
      method: "POST",
      data: data,
      header: {
          'content-type': 'application/json' // 默认值
      },
      success:  (res) => {
          console.log(res.data);
          if (res.data.code === 200) {
              Taro.showToast({
                  title: "登录成功",
                  icon: "success"
              });
              Taro.navigateTo({ url: "/pages/scanTeam/index" });
          }

      }
  }).catch((err) => {
      console.log(err);
      Taro.showToast({
          title: "登录失败",
          icon: "error"
      });
  });
}

export { testLoginService };


