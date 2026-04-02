import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isTestMode = mode === 'test'
  const isAnalyze = mode === 'analyze'

  return {
    plugins: [
      ...(isTestMode
        ? []
        : [
            tanstackRouter({
              target: 'react',
              autoCodeSplitting: true,
              routeFileIgnorePattern: String.raw`\.test\.`,
            }),
            tailwindcss(),
          ]),
      react(),
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'dist/stats.html',
              gzipSize: true,
              template: 'treemap',
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/test/vitest-setup.ts'],
    },
  }
})
