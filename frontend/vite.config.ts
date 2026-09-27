import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const beDomain = env.VITE_BEAPI;

  return {
    plugins: [react(), svgr(), tailwindcss()],

    server: {
      host: "0.0.0.0",

      allowedHosts: ["ascitic-lacy-nonironically.ngrok-free.dev"],

      proxy: {
        "/api": {
          target: beDomain,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
