import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      '@shared': path.resolve(import.meta.dirname, './src/shared'),
      '@layouts': path.resolve(import.meta.dirname, './src/layouts'),
      '@features': path.resolve(import.meta.dirname, './src/features'),
      '@assets': path.resolve(import.meta.dirname, './src/assets'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@pages': path.resolve(import.meta.dirname, './src/pages'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
      '@context': path.resolve(import.meta.dirname, './src/context'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@config': path.resolve(import.meta.dirname, './src/config'),
      '@styles': path.resolve(import.meta.dirname, './src/styles'),
      '@services': path.resolve(import.meta.dirname, './src/services'),
    },
  },
  plugins: [react()],
})
