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
      },

      workbox: {
        // Permitir archivos hasta 5 MiB (si necesitas precachearlos)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB

        // Patrón de archivos a precachear
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],

        // Ignorar cualquier PNG que contenga "cactus" en el nombre (más robusto que nombres con espacios)
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
