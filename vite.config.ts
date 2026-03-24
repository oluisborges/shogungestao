import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Path alias @/ maps to src/ so imports stay clean regardless of nesting depth.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
