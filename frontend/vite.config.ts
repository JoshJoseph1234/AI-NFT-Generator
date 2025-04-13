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
        // Add localhost to connect-src
        "connect-src 'self' http://localhost:* https://localhost:* https://*.pinata.cloud https://*.ipfs.io https://*.infura.io https://*.dweb.link https://*.nftstorage.link https://api.replicate.com https://fonts.googleapis.com https://fonts.gstatic.com",
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
        target: 'http://localhost:5000',
        changeOrigin: true,
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
