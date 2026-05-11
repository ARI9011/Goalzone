import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/data.js',
                'resources/js/i18n.js',
                'resources/js/auth.js',
                'resources/js/render.js',
            ],
            refresh: true,
        }),
    ],
});