# Clockin-Server

## 目录

```bash
-- src
   controllers // 处理逻辑
   entity // 数据库模型
   routers // 路由
   types // 存放命名空间文件
   config.ts // 存放小程序appsecret,appid
   index.ts // 入口文件
-- .gitignore
-- config.js // 存放数据库用户名及密码
-- ormconfig.js // 数据库配置
-- package.json
-- README.md
-- tsconfig.json
-- yarn.lock
```

## 安装依赖

```js
npm init -y
yarn add typescript ts-node@6.2.0 -D #ts-node安装@7版本以上不出现命名空间不识别的情况
yarn add koa -S
yarn add @types/koa -D

// 路由相关
yarn add koa-router koa2-cors koa-bodyparser -S
yarn add @types/koa-router @types/koa2-cors @types/koa-bodyparser -D

// typeorm及数据库
yarn add mysql typeorm reflect-metadata -S
```

## 运行

```js
yarn dev
```