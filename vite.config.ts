import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
<<<<<<< HEAD
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],

=======
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
    define: {
      'process.env.GEMINI_API_KEY_CHAT': JSON.stringify(env.GEMINI_API_KEY_CHAT || env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY_WATERMARK': JSON.stringify(env.GEMINI_API_KEY_WATERMARK || env.GEMINI_API_KEY),
    },
<<<<<<< HEAD

=======
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
<<<<<<< HEAD

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    // 🔧 ADD THIS PART
    worker: {
      format: "es"
    }
  };
});
=======
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
