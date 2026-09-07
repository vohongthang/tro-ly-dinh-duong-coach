import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Nếu deploy lên GitHub Pages dạng https://<user>.github.io/<ten-repo>/
// hãy đổi base thành "/<ten-repo>/". Nếu deploy Vercel hoặc domain riêng, giữ "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
