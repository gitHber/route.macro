English | [简体中文](./README_zh-CN.md)

<div align="center">
<h1>route.macro</h1>
generate routes by directory, just like umijs or nextjs
</div>

[![NPM version](https://img.shields.io/npm/v/route.macro.svg?style=flat)](https://npmjs.org/package/route.macro)
[![Build Status](https://www.travis-ci.org/gitHber/route.macro.svg?branch=master)](https://www.travis-ci.org/github/gitHber/route.macro)
[![codecov](https://codecov.io/gh/gitHber/route.macro/branch/master/graph/badge.svg)](https://codecov.io/gh/gitHber/route.macro)

## install

```shell
npm i -D route.macro
// or
yarn add -D route.macro
```

## ensure you have installed babel-plugin-macros

`.babelrc`

```shell
{
  plugins: ['babel-plugin-macros']
}
```

## usage

```js
import genRoute from "route.macro";

const routes = genRoute("./pages", {
  include: /[^.]*(\.(t|j)sx?)?$/,
  exclude: /components|(\.(less|css|md))$/
  injectTitle: true, // will injectTitle by component.title, asyncComponent must be false 
  asyncComponent: false
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

## config
.babel-plugin-macrosrc.js
```js
const path = require("path");
module.exports = {
  routeHelper: {
    // filename path dir need created by yourself
    output: (filename) => path.resolve(__dirname, "output/", filename),
  },
};
```