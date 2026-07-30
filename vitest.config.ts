import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import path from "path";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { blogManifestPlugin } from "./plugins/blog-manifest";

export default defineConfig({
  // The blog manifest and MDX plugins are required here too, so that tests
  // exercise the same article registry the build produces rather than a stub.
  plugins: [
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkFrontmatter, remarkGfm], rehypePlugins: [rehypeSlug] }) },
    blogManifestPlugin(),
    react(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
