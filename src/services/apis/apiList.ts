const apis = {
  login:{
    testLogin: "/admin/auth/without", //POST 测试登录
    autoLogin: "/admin/auth/auto", //POST 自动登录
    adminLogin: "/admin/auth", //POST 管理员登录
  },
  team: {
    teamScanCode: "/admin/team/sm", //POST 团队扫码
    teamPass: "/admin/team/out", //POST 团队放行/团队手动输入 ID
    teamStatus: "/admin/team/status", //GET 获取团队状态
  },
  user: {
    userScanCode: "/admin/user/sm", //POST 用户扫码
    userPass: "/admin/user/out", //POST 用户放行/用户手动输入 ID
  }

};

export default apis;
