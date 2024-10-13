# walk-view-admin-taro
浙江工业大学精弘网络毅行管理员小程序

## 程序运行

- 命令行

```
//安装依赖项
pnpm i

//编译成weapp
pnpm dev:weapp
```

- 微信开发者工具

打开 `walk-view-admin-taro/dist`

## 小程序维护相关事项

### 目录结构

添加页面时在 `src/app.config.ts` 中添加路径名

#### pages

- handleScanMember 空页面 (前人遗留不知作用)

- index 登录页

- manage 管理主页 用于展示基本功能

- rebuildTeam 重组队伍

- scanTeam 签到打卡扫码队伍

- stats 展示五条路线人数信息

- teamInfo 展示队伍信息 可更改队伍成员状态

#### services

用于存放api相关服务

apis.ts 用于统一存放api地址

xxxService.ts 用于存放api对接函数

其中 wxService.ts 封装了微信的输入拟态框、微信扫码、网络错误反馈

2024.10.13 Rosyr