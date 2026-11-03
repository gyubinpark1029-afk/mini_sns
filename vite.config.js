import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages는 /저장소명/ 아래에서 서비스되므로 base를 맞춰야 한다.
export default defineConfig({
  base: '/mini_sns/',
  plugins: [react()],
})
