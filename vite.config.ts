import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isTestMode = mode === 'test'

  return {
    plugins: [
      ...(!isTestMode
        ? [
            tanstackRouter({
              target: 'react',
              routeFileIgnorePattern: '\\.test\\.',
            }),
            tailwindcss(),
          ]
        : []),
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'happy-dom',
      globals: true,
    },
  }
})
