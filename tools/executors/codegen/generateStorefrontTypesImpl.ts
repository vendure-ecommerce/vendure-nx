import { generate } from '@graphql-codegen/cli';
import { ExecutorContext } from '@nx/devkit';
import * as fs from 'fs-extra';

import { CodegenDefinition, PluginCodegenDefinition } from './codegen-types';

interface VendurePluginBuilderOptions {}

export async function generateTypesExecutor(options: VendurePluginBuilderOptions, context: ExecutorContext) {
    const defs = [
        {
            generate() {
                return {
                    'apps/storefront/src/app/common/introspection-results.ts': {
                        schema: `http://localhost:3000/shop-api`,
                        plugins: [{ add: { content: '/* eslint-disable */' } }, 'fragment-matcher'],
                    },
                };
            },
        },
        new CodegenDefinition({
            api: 'shop',
            output: 'apps/storefront/src/app/common/gql/',
            documents: [
              'apps/storefront/src/app/common/**/*.ts',
              'apps/storefront/src/app/core/**/*.ts',
              'apps/storefront/src/app/routing/**/*.ts',
              'apps/storefront/src/app/shared/**/*.ts',
            ],
            documentMode: 'string',
        }),
        new CodegenDefinition({
            api: 'shop',
            output: 'apps/storefront/src/app/account/common/gql/',
            documents: [
                'apps/storefront/src/app/account/**/*.graphql.ts',
                'apps/storefront/src/app/common/fragments.graphql.ts',
            ],
            documentMode: 'string',
        }),
        new CodegenDefinition({
            api: 'shop',
            output: 'apps/storefront/src/app/article/common/gql/',
            documents: [
                'apps/storefront/src/app/article/**/*.graphql.ts',
                'apps/storefront/src/app/common/fragments.graphql.ts',
            ],
            documentMode: 'string',
        }),
        new CodegenDefinition({
            api: 'shop',
            output: 'apps/storefront/src/app/checkout/common/gql/',
            documents: [
                'apps/storefront/src/app/checkout/**/*.graphql.ts',
                'apps/storefront/src/app/common/fragments.graphql.ts',
            ],
            documentMode: 'string',
        }),
        new CodegenDefinition({
            api: 'shop',
            output: 'apps/storefront/src/app/home/common/gql/',
            documents: [
                'apps/storefront/src/app/home/**/*.graphql.ts',
                'apps/storefront/src/app/common/fragments.graphql.ts',
            ],
            documentMode: 'string',
        }),
        new CodegenDefinition({
            api: 'shop',
            output: 'apps/storefront/src/app/catalog/common/gql/',
            documents: [
                'apps/storefront/src/app/catalog/**/*.graphql.ts',
                'apps/storefront/src/app/common/fragments.graphql.ts',
            ],
            documentMode: 'string',
        }),
        new CodegenDefinition({
            api: 'shop',
            output: 'apps/storefront/src/app/wishlist/common/gql/',
            documents: [
                'apps/storefront/src/app/wishlist/**/*.graphql.ts',
                'apps/storefront/src/app/common/fragments.graphql.ts',
            ],
            documentMode: 'string',
        }),
    ];
    const generates = defs.map((def) => def.generate()).reduce((result, def) => ({ ...result, ...def }), {});
    const config = {
        config: {
            strict: true,
            maybeValue: 'T',
            namingConvention: {
                enumValues: 'keep',
            },
            dedupeFragments: false,
        },
        generates,
    };
    console.log(JSON.stringify(config, null, 2));
    const generatedFiles = await generate(config, true);
    for (const file of generatedFiles) {
        fs.writeFileSync(file.filename, file.content, 'utf-8');
    }
    return { success: true };
}

export default generateTypesExecutor;
