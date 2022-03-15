import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.ELECTRON=="true" ? './' : "./",
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'app': path.resolve(__dirname, './'),
      'font': path.resolve(__dirname, './public/font')
    },
  },
  server: {
    fs: {
      strict: true,
    }
  }
})
