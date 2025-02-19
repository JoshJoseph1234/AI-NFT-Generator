import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.replicate.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1'),
        headers: {
          'Authorization': `Token ${process.env.VITE_REPLICATE_API_TOKEN}`
        }
      }
    }
  },
  define: {
    'process.env.REPLICATE_API_TOKEN': JSON.stringify(process.env.VITE_REPLICATE_API_TOKEN),
  },
});
