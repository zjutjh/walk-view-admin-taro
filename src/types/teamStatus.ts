export interface Member {
  campus: number,
  contact: {
    qq: string,
    tel: string,
    wechat: string
  },
  gender: number,
  name: string,
  open_id: string,
  walk_status: number
}

export interface TeamStatus {
  admin: {
    admin_id: number,
    name: string,
    account: string,
    point: number,
    route: number
  },
  member: Member[],
  team: {
    /** 是否接受随机分配 */
    allow_match: boolean,
    /** 团队id */
    id: number,
    /** 队伍名 */
    name: string,
    /** 加入团队的密码 */
    password: string,
    /** 点位 */
    point: string,
    /** 所行路线 */
    route: number,
    /** 口号 */
    slogan: string,
    /** 队伍人数 */
    start_num: number,
    /** 1未开始 2进行中 3未完成 4完成 5扫码成功 */
    status: number,
    /** 队伍绑定的签到码的code */
    code: string,
  }
}
