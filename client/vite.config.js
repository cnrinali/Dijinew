import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    proxy: {
      // API isteklerini backend sunucusuna yönlendir
      '/api': {
        target: 'http://localhost:5001', // Backend sunucu adresiniz
        changeOrigin: true,
        // secure: false, // HTTPS kullanmıyorsanız
        // rewrite: (path) => path.replace(/^\/api/, '') // Gerekirse /api kısmını kaldır
      },
      // Yüklenen dosyaları backend sunucusundan istemek için proxy kuralı
      '/uploads': {
        target: 'http://localhost:5001', // Backend sunucu adresiniz
        changeOrigin: true,
        // secure: false,
      }
    }
  },
  define: {
    // Environment variables
    'import.meta.env.VITE_API_URL': JSON.stringify(
      mode === 'production' 
        ? 'https://api.dijinew.com' 
        : 'http://localhost:5001'
    )
  }
}))
