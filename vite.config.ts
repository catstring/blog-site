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
            const libs = ['react', 'react-dom', 'lodash', 'your-large-lib-here'];
            const name = id.toString().split('node_modules/')[1].split('/')[0];
            if (libs.includes(name)) {
              return name;
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 700, // Adjusted as a temporary measure to see the impact
  }
});
