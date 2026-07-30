declare module "virtual:blog-manifest" {
  import type { BlogArticleMeta } from "@/lib/blog";

  export const blogArticles: BlogArticleMeta[];
}

declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXComponents } from "mdx/types";

  const MDXComponent: ComponentType<{ components?: MDXComponents }>;
  export default MDXComponent;
}
