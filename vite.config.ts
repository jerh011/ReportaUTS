// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: { disabled: false, config: true },
      manifest: {
        name: 'ReportUTS',
        short_name: 'ReportUTS',
        description: 'ReportUTS',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/campana-128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/icons/campana-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        globIgnores: ['**/*cactus*.png'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
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
