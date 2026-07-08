import path from 'path'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/e2e/**', '**/.next/**']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@llp/types': path.resolve(__dirname, 'types/index.ts')
    }
  }
})
