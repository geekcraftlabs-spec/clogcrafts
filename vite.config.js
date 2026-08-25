import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // optional: stops overlay from popping up
    },
    watch: {
      usePolling: true, // helps on some Windows setups
    },
  },
  logLevel: 'info', // shows more detail
})