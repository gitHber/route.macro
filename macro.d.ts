export interface RouteItem {
  path: string;
  title?: string;
  component?: any;
  children?: RouteItem[];
}
/**
 * generate routes by file tree
 * @param dir path of root directory
 */
declare const genRoutes: (
  dir: string,
  conf: {
    include?: RegExp;
    exclude?: RegExp;
    injectTitle?: boolean;
    asyncComponent?: boolean;
  }
) => RouteItem[];

export default genRoutes;

declare module "react" {
  interface FunctionComponent {
    title?: string;
  }
}
