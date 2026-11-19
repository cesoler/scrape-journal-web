import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Em dev, /api é repassado ao back (quando VITE_USE_MOCK=false).
      proxy: {
        '/api': env.API_PROXY_TARGET ?? 'http://localhost:3000',
      },
    },
  }
})
