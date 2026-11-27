
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const disableHMR = env.VITE_DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],

    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('fabric') || id.includes('konva') || id.includes('pixi')) return 'canvas';
            if (id.includes('lottie')) return 'lottie';
            if (id.includes('motion') || id.includes('gsap') || id.includes('@react-spring')) return 'motion';
            if (id.includes('lucide')) return 'icons';
            if (id.includes('react') || id.includes('scheduler')) return 'react';
          },
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      port: 5173,

      watch: disableHMR
        ? null
        : undefined,
    },
  };
});
