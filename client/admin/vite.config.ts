// client/admin/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  base: "/admin/",
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"], // одна копия React
    alias: {
      // жёстко привязываем к локальным пакетам
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  server: {
    port: 5174,
    proxy: { "/api": "http://localhost:4005" }, // порт твоего бэка
    fs: { allow: [__dirname] }, // не даём читать ../client/src
  },
  build: { outDir: "../../server/admin", emptyOutDir: true }
});
