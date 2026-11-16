import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site lives at the root of halodesignsystem.dev. Set SITE_BASE to serve it from a sub-folder instead.
export default defineConfig({
  base: process.env.SITE_BASE ?? '/',
  plugins: [react()],
});
