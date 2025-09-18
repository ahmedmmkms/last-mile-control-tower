import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Last-Mile Delivery Driver App',
        short_name: 'Driver PWA',
        description: 'Driver application for last-mile delivery management',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        icon: 'public/logo192.png',
        start_url: '/',
        orientation: 'portrait-primary'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      // Use our custom service worker
      injectRegister: 'auto',
      swFilename: 'sw.js'
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    globals: true,
  },
  // Fix for Vercel build error - handle external dependencies properly
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          // Split vendor chunks to optimize bundle size
          vendor: ['react', 'react-dom'],
          material: ['@mui/material', '@mui/icons-material'],
          leaflet: ['leaflet', 'react-leaflet'],
          charts: ['recharts']
        }
      }
    }
  },
  // Optimize dependencies that are known to cause issues
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet', '@mui/material', '@mui/icons-material', 'recharts']
  },
  // Explicitly resolve problematic modules to prevent path resolution issues
  resolve: {
    alias: {
      // Force correct resolution of leaflet modules
      'leaflet': 'leaflet/dist/leaflet-src.esm.js'
    }
  }
})