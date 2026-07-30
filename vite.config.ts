import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import path from "path";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { componentTagger } from "lovable-tagger";
import { blogManifestPlugin } from "./plugins/blog-manifest";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    // MDX must run before the React plugin so it sees JSX rather than markdown.
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkFrontmatter, remarkGfm], rehypePlugins: [rehypeSlug] }) },
    blogManifestPlugin(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    // Read by scripts/check-bundle-budget.mjs to tell the chunks a first-time
    // visitor must download apart from the lazily loaded route chunks.
    manifest: true,
    // Every route is prerendered and the bundles are fingerprinted and cached
    // for a year, so the goal here is a stable split rather than the smallest
    // possible first payload: React and the router change rarely and stay
    // cached across deploys, while page code changes often.
    rollupOptions: {
      treeshake: {
        // Routes and homepage sections are imported twice on purpose: statically
        // so `renderToString` can emit their markup during prerendering, and
        // through `lazy()` so the browser code-splits them. Rollup keeps a
        // statically reachable module alive unless it is known to be free of
        // side effects, and without this the client entry would carry the copy
        // of every page even though it only ever renders one.
        moduleSideEffects(id, external) {
          if (external) return true;

          const normalized = id.split("\\").join("/");
          return !/\/src\/(pages|components\/landing)\/[^/]+\.tsx$/.test(normalized);
        },
      },
      output: {
        // Only libraries that genuinely load on every route are pinned here.
        // A catch-all `vendor` bucket would be counterproductive: it drags
        // route-only dependencies such as the carousel and the date formatter
        // onto the homepage, which is the opposite of what splitting is for.
        manualChunks(id) {
          const normalized = id.split("\\").join("/");
          if (!normalized.includes("/node_modules/")) return undefined;

          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(normalized)) return "react";
          if (/\/node_modules\/(react-router|react-router-dom|@remix-run\/router)\//.test(normalized)) return "router";
          if (/\/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(normalized)) return "motion";
          if (normalized.includes("/node_modules/lucide-react/")) return "icons";

          return undefined;
        },
      },
    },
  },
}));
