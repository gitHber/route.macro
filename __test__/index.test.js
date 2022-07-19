const pluginTester = require("babel-plugin-tester");
const path = require("path");
const plugin = require("babel-plugin-macros");

pluginTester.default({
  pluginName: "export",
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename, parserOpts: {} },
  tests: {
    default: `
      import genRoutes from "../macro";
      const routes = genRoutes("../pages/", {
        exclude: /(\.(less|css))$/,
      });
      const routes2 = genRoutes("../pages/", {
        exclude: /(\.(less|css))$/,
      });
      export default routes;
    `,
    "include": `
      import genRoutes from "../macro";
      const routes = genRoutes("../pages/", {
        include: /^[^.]*(\.(j|t)sx?)?/,
        exclude: /(\.(less|css))$/,
      });
      export default routes;
    `,
    "exclude": `
      import genRoutes from "../macro";
      const routes = genRoutes("../pages/", {
        exclude: /components|(\.(less|css))$/,
      });
      export default routes;
    `,
    "inject title": `
      import genRoutes from "../macro";
      const routes = genRoutes("../pages/", {
        exclude: /components|(\.(less|css))$/,
        injectTitle: true,
      });
      export default routes;
    `,
    "async component": `
      import genRoutes from "../macro";
      const routes = genRoutes("../pages/", {
        exclude: /components|(\.(less|css))$/,
        injectTitle: true,
        asyncComponent: true,
      });
      export default routes;
    `,
  },
});
