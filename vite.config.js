import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to avoid browser CORS preflight (OPTIONS) failure
      // Root cause: backend REST_Controller fails with 500 on OPTIONS requests
      '/api': {
        target: 'https://demo.lupinary.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
