import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@gantt": path.resolve(__dirname, "./codebase"),
      "@persian-gantt": path.resolve(__dirname, "./persian-dhtmlxgantt-ref/codebase"),
    },
  },
  css: {
    preprocessorOptions: {},
  },
});
