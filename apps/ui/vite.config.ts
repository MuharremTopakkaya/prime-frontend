import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-macros'
        ]
      }
    }),
    svgr({
      svgrOptions: {
        ref: true,
        svgo: false,
        titleProp: true,
        icon: true
      }
    })
  ],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      'helpers': path.resolve(__dirname, './src/helpers'),
      'images': path.resolve(__dirname, './src/images'),
      'styles': path.resolve(__dirname, './src/styles'),
      'demos': path.resolve(__dirname, './src/demos'),
      'pages': path.resolve(__dirname, './src/pages')
    }
  },
  server: {
    port: 5174,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'styled-components', 'framer-motion']
  }
})
