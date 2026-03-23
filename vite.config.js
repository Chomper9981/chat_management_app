import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://owlla-dev.thinklabs.com.vn/',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'https://owlla-dev.thinklabs.com.vn/',
        ws: true,
        changeOrigin: true,
      }
    }
  },
})
