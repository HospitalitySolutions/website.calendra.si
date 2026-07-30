import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import type { SiteLanguage } from "@/lib/site-language";

type MdxComponent = ComponentType<{ components?: MDXComponents }>;

/**
 * Eagerly imports every compiled article body.
 *
 * Eager is deliberate: prerendering has to emit the full prose into the HTML,
 * and a lazily loaded body would leave hydration with nothing to match. Because
 * this module is only reachable from the blog route components, which are
 * themselves code-split, the bundled articles land in the blog chunk and never
 * touch the entry bundle.
 */
const modules = import.meta.glob<{ default: MdxComponent }>("/content/blog/*/*.mdx", { eager: true });

const bodies = new Map<string, MdxComponent>();

for (const [filePath, module] of Object.entries(modules)) {
  const match = /\/content\/blog\/(sl|en)\/(.+)\.mdx$/.exec(filePath);
  if (!match) continue;
  bodies.set(`${match[1]}:${match[2]}`, module.default);
}

export const getArticleBody = (slug: string, language: SiteLanguage) => bodies.get(`${language}:${slug}`);
