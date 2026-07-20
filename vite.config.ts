import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/match-wise/',
  server: {
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
    @use "/src/styles/variables" as *;
    @use "/src/styles/mixins" as *;
  `,
      },
    },
  },
});
