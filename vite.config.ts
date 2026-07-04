import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // 👇 Cukup tulis "/api" di sini, biar Vite tahu mana yang harus di-proxy
      "/api": {
        target: "https://library-backend-production-b9cf.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})