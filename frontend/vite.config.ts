import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process']
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "connect-src 'self' https://*.pinata.cloud https://*.ipfs.io https://*.infura.io https://*.dweb.link https://*.nftstorage.link https://api.replicate.com https://fonts.googleapis.com https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://*.pinata.cloud https://*.ipfs.io https://*.infura.io https://*.dweb.link https://*.nftstorage.link https://img.freepik.com",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "worker-src 'self' blob:",
        "frame-src 'self'"
      ].join('; ')
    },
    proxy: {
      '/api': {
        target: 'https://api.replicate.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1'),
        headers: {
          'Authorization': `Token ${process.env.VITE_REPLICATE_API_TOKEN}`
        }
      },
      '/ipfs': {
        target: 'https://gateway.pinata.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ipfs/, '/ipfs'),
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
});
