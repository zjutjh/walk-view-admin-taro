const apis = {
  login:{
    normal: "/admin/auth/without", //POST 测试登录
    auto: "/admin/auth/auto", //POST 自动登录
    bind: "/admin/auth", //POST 管理员登录
  },
  user: {
    scanCheckInCode: "/admin/team/update", //POST 扫码签到
    setUserState: "/admin/team/user_status" //POST 设置用户状态
  },
  team: {
    teamBind: "/admin/team/bind", // POST 团队码和签到码绑定
    teamStatus: "/admin/team/status", //GET 获取团队状态
    commitTeam: "/admin/team/submit", //POST 直接提交团队
    rebuildTeam: "/admin/team/regroup", //POST 重组队伍
    verifyTeam: "/admin/team/destination", //POST 终点确认
  },
  admin: {
    adminSecret: "/admin/team/secret", //POST 验证管理员 接口封锁
    routeDetail: "/admin/detail", //GET 路线人数查询
    submitDetail: "/admin/submit" //GET 报名人数查询
  }
};

/**
 * 此处使用dotenvx打入环境变量, 然后Taro 会在打包时静态替换
 * ApiBaseUrl是存在的, 详见config/index.ts和.env
 */
const BaseUrl = ApiBaseUrl;


function appendHost(api: Record<string, string | Record<string, string>>) {
  for (const key in api)
    if (Object.prototype.hasOwnProperty.call(api, key))
      if (api[key] instanceof Object) appendHost(api[key]);
      else
        api[key] = BaseUrl + api[key];
}
appendHost(apis);
export default apis;
