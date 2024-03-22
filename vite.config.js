import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // ← ← ← ← ← ←
    host: '0.0.0.0' // ← 新增内容 ←
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //解决跨域问题
  server: {
    proxy: {
      '/api': {
        target: 'http://223.2.43.76:8809/',
        ws: true, //代理websocked
        changeOrigin: true, //虚拟的站点需要更管origin
        secure: true, //是否https接口
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
