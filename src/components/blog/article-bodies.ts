import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { MDXComponents } from "mdx/types";
import type { SiteLanguage } from "@/lib/site-language";

type MdxComponent = ComponentType<{ components?: MDXComponents }>;

/**
 * Prerender every article synchronously, but download only the current article
 * body in the browser. The same Suspense boundary is rendered on both sides so
 * hydration can keep the server's complete prose while that body loads.
 *
 * Both glob patterns stay literal so adding a translated MDX article continues
 * to work without updating a hand-written import list.
 */
const bodies: Record<string, MdxComponent | LazyExoticComponent<MdxComponent>> = import.meta.env.SSR
  ? import.meta.glob<MdxComponent>("/content/blog/*/*.mdx", { eager: true, import: "default" })
  : Object.fromEntries(
      Object.entries(import.meta.glob<{ default: MdxComponent }>("/content/blog/*/*.mdx")).map(
        ([filePath, load]) => [filePath, lazy(load)],
      ),
    );

export const getArticleBody = (slug: string, language: SiteLanguage) =>
  bodies[`/content/blog/${language}/${slug}.mdx`];
