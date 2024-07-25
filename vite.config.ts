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
            // Splitting each library into its own chunk
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
        }
      }
    },
    chunkSizeWarningLimit: 600, // Increasing the chunk size warning limit
  }
});
