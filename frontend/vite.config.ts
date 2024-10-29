import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPath from 'vite-tsconfig-paths' // npm i vite-tsconfig-paths

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPath()], // 추가하기
})