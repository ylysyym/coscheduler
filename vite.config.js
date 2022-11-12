/* eslint-env node */

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        server: {
            port: 8080,
            proxy: {
                '/api': {
                    target: process.env.VITE_API_SERVER,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
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
};
