/// <reference types="vitest" />
import { defineConfig } from 'vite';

import viteTsConfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';

export default defineConfig({
    plugins: [
        // SWC required to support decorators used in test plugins
        // See https://github.com/vitest-dev/vitest/issues/708#issuecomment-1118628479
        // Vite plugin
        swc.vite({
            jsc: {
                transform: {
                    // See https://github.com/vendure-ecommerce/vendure/issues/2099
                    useDefineForClassFields: false,
                },
            },
        }),
        viteTsConfigPaths({
            root: '.',
        }),
    ],
    test: {
        /**
         * For local debugging of the e2e tests, we set a very long timeout value otherwise tests will
         * automatically fail for going over the 5 second default timeout.
         */
        testTimeout: process.env.E2E_DEBUG ? 1800 * 1000 : process.env.CI ? 30 * 1000 : 15 * 1000,
        globals: true,
        cache: {
            dir: '../../node_modules/.vitest',
        },
        environment: 'jsdom',
        reporters: ["default"],
        include: ['src/**/*.{test,spec,e2e-spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        // include: ['src/**/geosearch.e2e-spec.ts'],
    },
});
