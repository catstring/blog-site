import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Here we try to avoid chunking certain smaller or problematic libraries
            const chunks = ['react', 'react-dom', 'lodash'];
            const chunkName = id.toString().split('node_modules/')[1].split('/')[0];
            if (chunks.includes(chunkName)) {
              return chunkName;
            }
            return 'vendor'; // Group smaller dependencies into a single chunk
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
});
