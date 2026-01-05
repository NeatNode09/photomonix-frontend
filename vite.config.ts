import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./app/components"),
      "@sections": path.resolve(__dirname, "./app/components/sections"),
      "@routes": path.resolve(__dirname, "./app/routes"),
      "@services": path.resolve(__dirname, "./app/services"),
      "@hooks": path.resolve(__dirname, "./app/hooks"),
      "@utils": path.resolve(__dirname, "./app/utils"),
      "@types": path.resolve(__dirname, "./app/types"),
      "@constants": path.resolve(__dirname, "./app/constants"),
      "@contexts": path.resolve(__dirname, "./app/contexts"),
      "@config": path.resolve(__dirname, "./app/config"),
      "~": path.resolve(__dirname, "./app"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
