import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base works for local preview and GitHub Pages project sites
  base: './',
});
