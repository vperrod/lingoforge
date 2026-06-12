/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:single` produces one self-contained HTML file (no PWA/SW —
// service workers don't run on file://)
export default defineConfig(({ mode }) => {
  const singleFile = mode === 'singlefile'
  return {
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    ...(singleFile
      ? [viteSingleFile()]
      : [
          VitePWA({
            registerType: 'autoUpdate',
            manifest: {
              name: 'LingoForge',
              short_name: 'LingoForge',
              description: 'Learn Russian and Spanish with games, SRS and daily goals',
              theme_color: '#4F46E5',
              background_color: '#EEF2FF',
              display: 'standalone',
              icons: [
                { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
              ],
            },
          }),
        ]),
  ],
  build: singleFile ? { outDir: 'dist-single' } : {},
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  }
})
