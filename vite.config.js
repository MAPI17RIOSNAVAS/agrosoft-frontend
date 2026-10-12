import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Toda petición que comience con /api se enviará al backend
      '/api': {
        target: 'http://localhost:3000', // URL y puerto de tu backend
        changeOrigin: true,
        secure: false,}}}
})
