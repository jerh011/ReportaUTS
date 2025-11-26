import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'ReportaUTS',
        short_name: 'ReportaUTS',
        description: 'ReportaUTS',
        theme_color: '#ffffff',
        // añade tus icons aquí si los tienes
       icons: [{ src: '/icons/notificacion.png', sizes: '256x256', type: 'image/png' }]
      },

     workbox: {
  globIgnores: [
    '**/cactus-background.png',
    '**/fondo cactus-tono verde.png',
    '**/fondo-cactus-tono-verde.png' // por si renombraste
  ],
  globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|webp|svg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-runtime',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
},

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
});
