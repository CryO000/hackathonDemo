import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { webcrypto } from 'node:crypto'

// Ensure a Web Crypto `crypto.getRandomValues` is available in the Vite
// dev server (Node runtime). Some packages expect the browser Web Crypto
// API and will fail during config/optimization if it's missing.
if (!(globalThis as any).crypto) {
  ;(globalThis as any).crypto = webcrypto
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
