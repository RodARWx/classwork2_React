import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // This class project intentionally ships a single bundle; the default 500 kB
    // advisory is raised to 600 kB (the real output is ~529 kB raw / ~161 kB gzip).
    chunkSizeWarningLimit: 600,
  },
});
