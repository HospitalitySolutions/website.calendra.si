import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link2 } from "lucide-react";

const isInternal = (href?: string) => Boolean(href && href.startsWith("/"));

const Anchor = ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (isInternal(href) || !href?.startsWith("http")) {
    return (
      <a href={href} className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
      {...rest}
    >
      {children}
    </a>
  );
};

/**
 * Headings render their own anchor link. `rehype-slug` supplies the id, and the
 * table of contents in `BlogArticlePage` targets the same ids, so the two cannot
 * drift apart.
 */
const Heading = ({ level, id, children }: { level: 2 | 3 | 4; id?: string; children?: ReactNode }) => {
  const Tag = `h${level}` as "h2" | "h3" | "h4";
  const size =
    level === 2
      ? "mt-14 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      : level === 3
        ? "mt-10 font-display text-xl font-bold text-foreground"
        : "mt-8 text-lg font-bold text-foreground";

  return (
    <Tag id={id} className={`group scroll-mt-28 ${size}`}>
      {children}
      {id ? (
        <a
          href={`#${id}`}
          aria-label={typeof children === "string" ? `Povezava do razdelka ${children}` : "Povezava do razdelka"}
          className="ml-2 inline-flex align-middle text-muted-foreground opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}
    </Tag>
  );
};

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => <h2 className="mt-14 font-display text-2xl font-bold text-foreground sm:text-3xl">{children}</h2>,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  p: ({ children }) => <p className="mt-5 text-base leading-8 text-foreground/90 sm:text-[1.0625rem]">{children}</p>,
  a: Anchor,
  ul: ({ children }) => <ul className="mt-5 grid gap-2.5 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 grid list-decimal gap-2.5 pl-6">{children}</ol>,
  li: ({ children }) => (
    <li className="relative pl-6 text-base leading-8 text-foreground/90 marker:text-primary [ol>&]:pl-0">
      <span className="absolute left-0 top-3 h-1.5 w-1.5 rounded-full bg-primary [ol>&]:hidden" aria-hidden="true" />
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mt-7 rounded-2xl border-l-4 border-primary/40 bg-primary/[0.04] px-6 py-4 text-base leading-8 text-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="mt-12 border-border/60" />,
  table: ({ children }) => (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60 shadow-soft">
      <table className="w-full min-w-[560px] border-collapse bg-card text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-background">{children}</thead>,
  th: ({ children }) => (
    <th scope="col" className="border-b border-border/60 px-4 py-3 font-bold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-border/40 px-4 py-3 align-top leading-6 text-muted-foreground">{children}</td>,
  code: ({ children }) => (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-muted/60 p-5 text-sm leading-6">{children}</pre>
  ),
  img: ({ src, alt, ...rest }) => (
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      className="mt-8 block h-auto w-full rounded-2xl border border-border/60"
      {...rest}
    />
  ),
};
