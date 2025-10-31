import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      views: path.resolve(__dirname, 'src/views'),
      assets: path.resolve(__dirname, 'src/assets'),
      contexts: path.resolve(__dirname, 'src/contexts'),
      theme: path.resolve(__dirname, 'src/theme'),
      variables: path.resolve(__dirname, 'src/variables'),
      layouts: path.resolve(__dirname, 'src/layouts'),
      'routes': path.resolve(__dirname, 'src/routes.tsx'),
      'routes.js': path.resolve(__dirname, 'src/routes.tsx'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5132',
        changeOrigin: true,
        secure: false,
        // Rewrite if services ever call without leading /api
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  }
})
