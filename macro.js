const { createMacro } = require("babel-plugin-macros");
const fs = require("fs");
const path = require("path");
const t = require("@babel/types");
const generate = require("@babel/generator");

/**
 *
 * @param {string} dir 目录路径
 * @param {string} route 路由路径
 * @param {{include?: RegExp; exclude?: RegExp;}} conf 配置
 * @returns {{path: string; source: string;}[]} routes
 */
function getPagesTree(dir, route, conf) {
  /**
   *
   * @param {string} dir 目录路径
   * @param {string} route 路由路径
   * @returns {path: 路由, source: 文件路径}[]
   */
  function loop(dir, route) {
    const tree = {
      children: [],
      path: route,
    };
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      if (conf.include && !conf.include.test(file)) {
        return;
      }
      if (conf.exclude && conf.exclude.test(file)) {
        return;
      }
      const filepath = path.join(dir, file);
      // 处理index文件
      if (/^index\.(t|j)sx?$/.test(file)) {
        tree.source = filepath;
        return;
      }
      // 其他文件
      const stats = fs.statSync(filepath);
      const fileInfo = path.parse(file);
      let currentRoute;
      let regRes = /^\[(.*)\]/.exec(file);
      if (regRes) {
        currentRoute = `${route}:${regRes[1]}/`;
      } else {
        currentRoute = `${route}${fileInfo.name}/`;
      }
      if (stats.isDirectory()) {
        tree.children.push(loop(filepath, currentRoute));
      } else {
        tree.children.push({
          path: currentRoute,
          source: filepath,
        });
      }
    });
    return tree;
  }
  return loop(dir, route);
}

/**
 * @typedef {typeof t} Types
 * @typedef {{path: string; source?: string; children?: []}} Route
 * @param {Route[]} routes
 * @param {babel.PluginPass} state
 * @param {Types} types
 * @param {{ injectTitle: boolean; asyncComponent: boolean; }} conf 配置
 * @return {Types["arrayExpression"]}
 */
function createRouteAst(rootRoutes, state, types, conf) {
  function loop(routes) {
    const routesAst = types.arrayExpression([]);
    routes.forEach((route) => {
      // route object
      const objectAst = types.objectExpression([]);
      routesAst.elements.push(objectAst);
      let subRoutesAst = loop(route.children || []);
      objectAst.properties.push(
        types.objectProperty(
          types.identifier("path"),
          types.stringLiteral(route.path)
        ),
        types.objectProperty(types.identifier("children"), subRoutesAst)
      );
      // 有对应的组件
      if (route.source) {
        const importAst = types.importDeclaration(
          [],
          types.stringLiteral(route.source)
        );
        // 异步引入, injectTitle不生效
        if (conf.asyncComponent) {
          objectAst.properties.push(
            types.objectProperty(
              types.identifier("component"),
              types.arrowFunctionExpression(
                [],
                types.callExpression(types.identifier("import"), [
                  types.stringLiteral(route.source),
                ])
              )
            )
          );
        } else {
          const componentName =
            route.source.replace(/\/|\.|-|\[|\]/g, "_") + "_component";
          importAst.specifiers.push(
            types.importDefaultSpecifier(types.identifier(componentName))
          );
          objectAst.properties.push(
            types.objectProperty(
              types.identifier("component"),
              types.identifier(componentName)
            )
          );
          // 注入name
          if (conf.injectTitle) {
            objectAst.properties.push(
              types.objectProperty(
                types.identifier("title"),
                types.memberExpression(
                  types.identifier(componentName),
                  types.identifier("title")
                )
              )
            );
          }
        }

        state.file.path.unshiftContainer("directives", importAst);
      }
    });
    return routesAst;
  }

  return loop(rootRoutes);
}

module.exports = createMacro(
  function (context) {
    const { references, state, babel, config } = context;

    if (!references.default) {
      logError(state.file.path, "only support default import");
    }
    references.default.forEach((referencePath) => {
      const args = referencePath.parentPath.get("arguments");
      let cwdPath = args[0] ? args[0].node.value : "";
      let conf;
      try {
        const source = args[1] ? args[1].getSource() : "{}";
        conf = eval(`(${source})`);
      } catch (e) {
        console.error(
          "genRoutes conf only support {include: RegExp; exclude: RegExp;}"
        );
        throw e;
      }
      const tree = getPagesTree(
        path.join(path.dirname(state.filename), cwdPath),
        "/",
        conf
      );
      referencePath.parentPath.replaceWith(
        createRouteAst([tree], state, babel.types, conf)
      );
    });
    if (config.output && references.default.length) {
      let node = references.default[0];
      while (node.type !== "Program") {
        if (node.parentPath === null) return;
        node = node.parentPath;
      }
      let code = generate.default(node.node).code;
      // 输出临时文件
      fs.writeFileSync(config.output(path.basename(state.filename)), code);
    }
  },
  {
    configName: "routeHelper",
  }
);
