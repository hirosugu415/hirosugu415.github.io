import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// index.html と work.html の2ページ構成。ページ内リンク（work.html#test）をそのまま使うため、
// ルーターではなく Vite のマルチページで分けている。
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: "static",
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        work: resolve(import.meta.dirname, "work.html"),
      },
    },
  },
});
