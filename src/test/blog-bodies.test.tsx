import { Suspense, useEffect } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mdxComponents } from "@/components/blog/mdx-components";
import { allBlogArticles } from "@/lib/blog";

const loadBodies = async (ssr: boolean) => {
  vi.resetModules();
  vi.stubEnv("SSR", ssr);
  return import("@/components/blog/article-bodies");
};

const HydrationComplete = ({ onReady }: { onReady: () => void }) => {
  useEffect(onReady, [onReady]);
  return null;
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("blog body rendering", () => {
  it("prerenders every article's prose and heading anchors without suspending", async () => {
    const { getArticleBody } = await loadBodies(true);

    for (const article of allBlogArticles) {
      const Body = getArticleBody(article.slug, article.language);
      expect(Body, `missing body for ${article.language}/${article.slug}`).toBeDefined();

      const html = renderToString(
        <Suspense fallback={<p data-testid="article-loading">Loading</p>}>
          <Body components={mdxComponents} />
        </Suspense>,
      );
      const container = document.createElement("div");
      container.innerHTML = html;

      expect(container.querySelector("[data-testid=article-loading]")).toBeNull();
      expect(container.querySelectorAll("p").length).toBeGreaterThan(5);
      const renderedIds = Array.from(container.querySelectorAll("[id]"), (node) => node.id);
      expect(renderedIds).toEqual(expect.arrayContaining(article.headings.map((heading) => heading.id)));
    }
  });

  it.each(["sl", "en"] as const)("hydrates a lazy %s body without replacing prerendered prose", async (language) => {
    const article = allBlogArticles.find((item) => item.language === language)!;
    const serverBodies = await loadBodies(true);
    const ServerBody = serverBodies.getArticleBody(article.slug, language);
    const onReady = vi.fn();
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <Suspense fallback={null}>
        <ServerBody components={mdxComponents} />
        <HydrationComplete onReady={onReady} />
      </Suspense>,
    );
    document.body.append(container);
    const firstParagraph = container.querySelector("p");
    const originalProse = container.textContent;

    const clientBodies = await loadBodies(false);
    const ClientBody = clientBodies.getArticleBody(article.slug, language);
    const onRecoverableError = vi.fn();
    let root: Root | undefined;

    try {
      await act(async () => {
        root = hydrateRoot(
          container,
          <Suspense fallback={null}>
            <ClientBody components={mdxComponents} />
            <HydrationComplete onReady={onReady} />
          </Suspense>,
          { onRecoverableError },
        );
      });
      await waitFor(() => expect(onReady).toHaveBeenCalledOnce());

      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(container.querySelector("p")).toBe(firstParagraph);
      expect(container.textContent).toBe(originalProse);
    } finally {
      if (root) await act(async () => root?.unmount());
      container.remove();
    }
  });
});
