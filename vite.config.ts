import path from 'node:path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],

    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src')
        }
    },

    server: {
        port: 5173,
        host: '0.0.0.0',
        allowedHosts: true
    },

    build: {
        target: 'esnext',
        chunkSizeWarningLimit: 1000,
        minify: 'esbuild',
        rolldownOptions: {
            output: {
                chunkFileNames: ({ name }) => `y/${name}.js`,
                entryFileNames: ({ name }) => name === 'index' ? 'y/tkl.js' : name === 'entry-server' ? 'y/ssr.js' : `y/${name}.js`,
                assetFileNames: (c) => {
                    if (typeof c.source !== 'string') return `y/[name].[ext]`;
                    return `y/tkl.[ext]`;
                }
            },
            treeshake: true
        }
    },

    ssr: {
        noExternal: ['react', 'react-dom']
    }
})