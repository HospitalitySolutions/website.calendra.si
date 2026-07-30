import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import type { Plugin } from "vite";

export const BLOG_MANIFEST_MODULE_ID = "virtual:blog-manifest";
const RESOLVED_ID = `\0${BLOG_MANIFEST_MODULE_ID}`;

const CONTENT_DIR = "content/blog";
const LANGUAGES = ["sl", "en"] as const;
const WORDS_PER_MINUTE = 200;

type Language = (typeof LANGUAGES)[number];

export type BlogHeading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type BlogArticleMeta = {
  language: Language;
  slug: string;
  /** Pairs the Slovenian and English versions of one article for hreflang. */
  translationKey: string;
  title: string;
  description: string;
  /** Short definitional passage rendered under the H1 and quoted by AI answers. */
  answer: string;
  category: string;
  tags: string[];
  datePublished: string;
  dateModified: string;
  heroImageAlt: string;
  draft: boolean;
  readingMinutes: number;
  wordCount: number;
  headings: BlogHeading[];
};

const REQUIRED_STRING_FIELDS = [
  "title",
  "description",
  "answer",
  "translationKey",
  "category",
  "datePublished",
  "heroImageAlt",
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Strips MDX syntax that should not count towards reading time or leak into a
 * heading label: fenced code, JSX tags, link targets, and emphasis markers.
 */
const toPlainText = (markdown: string) =>
  markdown
    .replace(/^---[\s\S]*?^---/m, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~#>]/g, " ");

const readHeadings = (body: string): BlogHeading[] => {
  const slugger = new GithubSlugger();
  const headings: BlogHeading[] = [];
  let insideFence = false;

  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = toPlainText(match[2]).replace(/\s+/g, " ").trim();
    headings.push({ id: slugger.slug(text), text, depth: match[1].length as 2 | 3 });
  }

  return headings;
};

/**
 * Rejects images with no alt text. An image is the one element a screen reader
 * cannot infer anything from, and image search has nothing else to index.
 */
const assertImagesHaveAltText = (body: string, where: string) => {
  const withoutCode = body.replace(/```[\s\S]*?```/g, " ");

  const markdownImages = [...withoutCode.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)];
  for (const [, alt, src] of markdownImages) {
    if (alt.trim() === "") throw new Error(`${where}: image "${src}" has no alt text.`);
  }

  const jsxImages = [...withoutCode.matchAll(/<img\b([^>]*)>/g)];
  for (const [, attributes] of jsxImages) {
    const alt = /\balt\s*=\s*(?:"([^"]*)"|\{?['"]([^'"]*)['"]\}?)/.exec(attributes);
    const value = alt?.[1] ?? alt?.[2];
    if (value === undefined || value.trim() === "") {
      throw new Error(`${where}: an <img> element has no alt text.`);
    }
  }
};

const parseArticle = (filePath: string, language: Language): BlogArticleMeta => {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = path.basename(filePath, ".mdx");
  const where = `${CONTENT_DIR}/${language}/${slug}.mdx`;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof data[field] !== "string" || data[field].trim() === "") {
      throw new Error(`${where}: frontmatter field "${field}" is required and must be a non-empty string.`);
    }
  }

  for (const field of ["datePublished", "dateModified"] as const) {
    const value = data[field];
    if (value !== undefined && !ISO_DATE.test(String(value))) {
      throw new Error(`${where}: frontmatter "${field}" must be an ISO date (YYYY-MM-DD), received "${value}".`);
    }
  }

  assertImagesHaveAltText(content, where);

  const words = toPlainText(content).split(/\s+/).filter(Boolean).length;

  return {
    language,
    slug,
    translationKey: String(data.translationKey),
    title: String(data.title),
    description: String(data.description),
    answer: String(data.answer),
    category: String(data.category),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    datePublished: String(data.datePublished),
    dateModified: String(data.dateModified ?? data.datePublished),
    heroImageAlt: String(data.heroImageAlt),
    draft: data.draft === true,
    wordCount: words,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    headings: readHeadings(content),
  };
};

/**
 * Fails the build on the content mistakes that are invisible in review but
 * expensive in search: an article published in one language only, a duplicate
 * slug, a description that will be truncated in results, or a hero image with
 * no alt text.
 */
const validate = (articles: BlogArticleMeta[]) => {
  const problems: string[] = [];

  for (const language of LANGUAGES) {
    const seen = new Map<string, string>();
    for (const article of articles.filter((item) => item.language === language)) {
      const previous = seen.get(article.slug);
      if (previous) problems.push(`duplicate slug "${article.slug}" in ${language}`);
      seen.set(article.slug, article.slug);

      const key = seen.get(`key:${article.translationKey}`);
      if (key) problems.push(`duplicate translationKey "${article.translationKey}" in ${language}`);
      seen.set(`key:${article.translationKey}`, article.translationKey);

      if (article.description.length < 70 || article.description.length > 165) {
        problems.push(
          `${language}/${article.slug}: description is ${article.description.length} characters (expected 70-165)`,
        );
      }

      const answerWords = article.answer.split(/\s+/).filter(Boolean).length;
      if (answerWords < 25 || answerWords > 90) {
        problems.push(`${language}/${article.slug}: answer is ${answerWords} words (expected 25-90)`);
      }

      if (article.title.length > 65) {
        problems.push(`${language}/${article.slug}: title is ${article.title.length} characters (expected 65 or fewer)`);
      }

      if (article.headings.length === 0) {
        problems.push(`${language}/${article.slug}: has no "##" headings, so it cannot build a table of contents`);
      }
    }
  }

  const byKey = new Map<string, Set<Language>>();
  for (const article of articles) {
    const languages = byKey.get(article.translationKey) ?? new Set<Language>();
    languages.add(article.language);
    byKey.set(article.translationKey, languages);
  }

  for (const [key, languages] of byKey) {
    const missing = LANGUAGES.filter((language) => !languages.has(language));
    if (missing.length > 0) {
      problems.push(`translationKey "${key}" is missing a ${missing.join(" and ")} version`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Blog content validation failed:\n  - ${problems.join("\n  - ")}`);
  }
};

export const readBlogArticles = (root: string): BlogArticleMeta[] => {
  const articles: BlogArticleMeta[] = [];

  for (const language of LANGUAGES) {
    const dir = path.join(root, CONTENT_DIR, language);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".mdx")).sort()) {
      articles.push(parseArticle(path.join(dir, file), language));
    }
  }

  validate(articles);

  return articles.sort((a, b) => b.datePublished.localeCompare(a.datePublished));
};

/**
 * Exposes article frontmatter as a pure-data virtual module.
 *
 * The alternative, an eager `import.meta.glob` over the MDX files, would make
 * every article body reachable from `src/lib/seo.ts` and therefore from the
 * main bundle. Keeping metadata and prose in separate module graphs is what lets
 * the router, sitemap and SEO layer know about articles without shipping them.
 */
export const blogManifestPlugin = (): Plugin => {
  let root = process.cwd();

  return {
    name: "calendra:blog-manifest",

    configResolved(config) {
      root = config.root;
    },

    resolveId(id) {
      return id === BLOG_MANIFEST_MODULE_ID ? RESOLVED_ID : undefined;
    },

    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      return `export const blogArticles = ${JSON.stringify(readBlogArticles(root))};`;
    },

    /**
     * Article bodies are only ever used by the code-split blog route, but the
     * SSR branch in `AppRoutes.tsx` creates a static import edge from the entry
     * graph. Rollup keeps a module in the entry chunk when it cannot prove the
     * module is free of side effects, which is what dragged every article's
     * prose into the main bundle. Compiled MDX only declares a component, so
     * declaring that here lets tree shaking move the articles into the blog
     * chunk where they belong.
     */
    transform(code, id) {
      const normalized = id.split("\\").join("/");
      const isArticle = normalized.includes("/content/blog/") && normalized.endsWith(".mdx");
      const isArticleRegistry = normalized.endsWith("/components/blog/article-bodies.ts");

      if (!isArticle && !isArticleRegistry) return undefined;
      return { code, map: null, moduleSideEffects: false };
    },

    configureServer(server) {
      const contentRoot = path.join(root, CONTENT_DIR);
      server.watcher.add(contentRoot);

      const invalidate = (file: string) => {
        if (!file.startsWith(contentRoot)) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", invalidate);
      server.watcher.on("change", invalidate);
      server.watcher.on("unlink", invalidate);
    },
  };
};
