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
npm i -D export.macro
// or
yarn add -D export.macro
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
  asyncComponent: true
});

export default routes;
```

output：

```js
import { name as _Users_route_macro_pages_index_tsx_name } from "/Users/route.macro/pages/index.tsx";
import { name as _Users_route_macro_pages_user_index_tsx_name } from "/Users/route.macro/pages/user/index.tsx";
import { name as _Users_route_macro_pages_user__uid__index_tsx_name } from "/Users/route.macro/pages/user/[uid]/index.tsx";
import { name as _Users_route_macro_pages_test_index_t_tsx_name } from "/Users/route.macro/pages/test/index.t.tsx";
import { name as _Users_route_macro_pages_login_tsx_name } from "/Users/route.macro/pages/login.tsx";
import { name as _Users_route_macro_pages_author__authorid__tsx_name } from "/Users/route.macro/pages/author/[authorid].tsx";

const routes = [{
  path: "/",
  children: [{
    path: "/author/",
    children: [{
      path: "/author/:authorid/",
      children: [],
      component: () => import("/Users/route.macro/pages/author/[authorid].tsx"),
      name: _Users_route_macro_pages_author__authorid__tsx_name
    }]
  }, {
    path: "/login/",
    children: [],
    component: () => import("/Users/route.macro/pages/login.tsx"),
    name: _Users_route_macro_pages_login_tsx_name
  }, {
    path: "/test/",
    children: [{
      path: "/test/index.t/",
      children: [],
      component: () => import("/Users/route.macro/pages/test/index.t.tsx"),
      name: _Users_route_macro_pages_test_index_t_tsx_name
    }]
  }, {
    path: "/user/",
    children: [{
      path: "/user/:uid/",
      children: [],
      component: () => import("/Users/route.macro/pages/user/[uid]/index.tsx"),
      name: _Users_route_macro_pages_user__uid__index_tsx_name
    }],
    component: () => import("/Users/route.macro/pages/user/index.tsx"),
    name: _Users_route_macro_pages_user_index_tsx_name
  }],
  component: () => import("/Users/route.macro/pages/index.tsx"),
  name: _Users_route_macro_pages_index_tsx_name
}];
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