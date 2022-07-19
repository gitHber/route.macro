[English](./README.md) | 简体中文

<div align="center">
<h1>route.macro</h1>
根据目录结构生成路由结构，类似umijs
</div>

[![NPM version](https://img.shields.io/npm/v/route.macro.svg?style=flat)](https://npmjs.org/package/route.macro)
[![Build Status](https://www.travis-ci.org/gitHber/route.macro.svg?branch=master)](https://www.travis-ci.org/github/gitHber/route.macro)
[![codecov](https://codecov.io/gh/gitHber/route.macro/branch/master/graph/badge.svg)](https://codecov.io/gh/gitHber/route.macro)

## 安装

```shell
npm i -D route.macro
// or
yarn add -D route.macro
```

## 先安装 babel-plugin-macros

`.babelrc`

```shell
{
  plugins: ['babel-plugin-macros']
}
```

## 使用

```js
import genRoute from "route.macro";

const routes = genRoute("./pages", {
  include: /[^.]*(\.(t|j)sx?)?$/,
  exclude: /components|(\.(less|css|md))$/
  injectName: true,
  asyncComponent: true
});

export default routes;
```

output：

```js
import _pages_index_tsx_component from "./pages/index.tsx";
import _pages_user_index_tsx_component from "./pages/user/index.tsx";
import _pages_user__uid__index_tsx_component from "./pages/user/[uid]/index.tsx";
import _pages_test_index_t_tsx_component from "./pages/test/index.t.tsx";
import _pages_login_tsx_component from "./pages/login.tsx";
import _pages_author__authorid__tsx_component from "./pages/author/[authorid].tsx";

const routes = [
  {
    path: "/",
    children: [
      {
        path: "/author/",
        children: [
          {
            path: "/author/:authorid/",
            children: [],
            component:
              _pages_author__authorid__tsx_component,
            title:
              _pages_author__authorid__tsx_component.title,
          },
        ],
      },
      {
        path: "/login/",
        children: [],
        component:
          _pages_login_tsx_component,
        title:
          _pages_login_tsx_component.title,
      },
      {
        path: "/test/",
        children: [
          {
            path: "/test/index.t/",
            children: [],
            component:
              _pages_test_index_t_tsx_component,
            title:
              _pages_test_index_t_tsx_component.title,
          },
        ],
      },
      {
        path: "/user/",
        children: [
          {
            path: "/user/:uid/",
            children: [],
            component:
              _pages_user__uid__index_tsx_component,
            title:
              _pages_user__uid__index_tsx_component.title,
          },
        ],
        component:
          _pages_user_index_tsx_component,
        title:
          _pages_user_index_tsx_component.title,
      },
    ],
    component: _pages_index_tsx_component,
    title:
      _pages_index_tsx_component.title,
  },
];
export default routes;
```
## 配置
.babel-plugin-macrosrc.js
```js
const path = require("path");
module.exports = {
  routeHelper: {
    // 文件名 文件目录需要手动创建
    output: (filename) => path.resolve(__dirname, "output/", filename),
  },
};
```