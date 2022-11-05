/* eslint-env node */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

export default defineConfig({
    server: {
        port: 8080
    },
    define: {
        'process.env': process.env
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, 'src')
            }
        ]
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    },
    plugins: [vue()]
});
