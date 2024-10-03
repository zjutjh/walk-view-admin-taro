const apis = {
  login:{
    normal: "/admin/auth/without", //POST 测试登录
    auto: "/admin/auth/auto", //POST 自动登录
    bind: "/admin/auth", //POST 管理员登录
  },
  user: {
    scanCheckInCode: "/admin/team/update" //POST 扫码签到
  },
  team: {
    // teamScanCode: "/admin/team/sm", //POST 团队扫码
    // teamPass: "/admin/team/out", //POST 团队放行/团队手动输入 ID
    teamStatus: "/admin/team/status", //GET 获取团队状态
  },
  // user: {
  //   userScanCode: "/admin/user/sm", //POST 用户扫码
  //   userPass: "/admin/user/out", //POST 用户放行/用户手动输入 ID
  // }

};

const BaseUrl = "https://walk.phlin.top/api/v1";

function appendHost(api: any) {
  for (const key in api)
    if (Object.prototype.hasOwnProperty.call(api, key))
      if (api[key] instanceof Object) appendHost(api[key]);
      else
        api[key] = BaseUrl + api[key];
}
appendHost(apis);
console.log(apis);
export default apis;
