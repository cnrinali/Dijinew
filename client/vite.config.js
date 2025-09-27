import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Backend URL'ini environment variable'dan al
  const backendUrl = mode === 'production' ? 'https://dijinew-api.vercel.app' : 'http://localhost:5001';

  return {
    plugins: [react()],
    server: {
      proxy: {
        // API isteklerini backend sunucusuna yönlendir - Merkezi config
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          // secure: false, // HTTPS kullanmıyorsanız
          // rewrite: (path) => path.replace(/^\/api/, '') // Gerekirse /api kısmını kaldır
        },
        // Yüklenen dosyaları backend sunucusundan istemek için proxy kuralı
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
          // secure: false,
        }
      }
    },
    define: {
      // Environment variables - Merkezi URL yönetimi
      'import.meta.env.VITE_BACKEND_API_URL': JSON.stringify(backendUrl)
    }
  }
})
