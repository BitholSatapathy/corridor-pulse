import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/corridor-pulse/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
