import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

/** Netlify 向け静的出力（published 記事のみビルド時に取得） */
export default defineConfig({
  output: "static",
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
