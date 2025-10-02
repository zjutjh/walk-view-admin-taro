/// <reference types="@tarojs/taro" />

// 定义环境变量
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_BASE_URL: string;
  }
}
