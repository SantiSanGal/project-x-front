import react from "@vitejs/plugin-react-swc";
import sitemap from 'vite-plugin-sitemap'
import { defineConfig } from "vite";
import path from "path";

const routes = [
  "/",
  "login",
  "register",
  "about",
  "/redirect/:hash",
  "/policies",
  "*"
];

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://tatakaepixel.com',
      dynamicRoutes: routes,
      changefreq: 'weekly',
      priority: 0.8
    })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
