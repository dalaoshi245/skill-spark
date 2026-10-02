import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用相对路径，方便部署到任意静态托管的子目录（如 GitHub Pages 项目页）
  base: './',
})
