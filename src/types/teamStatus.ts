export interface member {
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
  member: member[],
  team: {
    allow_match: boolean,
    id: number,
    name: string,
    password: string,
    point: string,
    route: number,
    slogan: string,
    start_num: number,
    status: number,
  }
}
