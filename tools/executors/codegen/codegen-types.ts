import { Types } from '@graphql-codegen/plugin-helpers';

export interface CodegenDefConfig {
    output: string;
    api: 'shop' | 'admin';
    documentMode?: 'string' | 'documentNode';
    documents?: string | string[];
    plugins?: any[];
}

export class CodegenDefinition {
    constructor(private options: CodegenDefConfig) {}

    generate(): { [output: string]: Types.ConfiguredOutput } {
        const { api, documents, output, plugins } = this.options;
        const effectivePlugins = plugins || (!documents ? ['typescript'] : []);
        return {
            [output]: {
                schema: `http://localhost:3000/${api}-api`,
                documents,
                ...(!!documents
                    ? {
                          preset: 'client',
                          presetConfig: {
                              fragmentMasking: false,
                          },
                          config: {
                              documentMode: this.options.documentMode,
                          },
                      }
                    : {}),
                ...(!!documents
                    ? {}
                    : { plugins: [{ add: { content: '/* eslint-disable */' } }, ...effectivePlugins] }),
            },
        };
    }
}

export class PluginCodegenDefinition {
    constructor(
        private config: {
            pluginPath: string;
            includeE2eShop?: boolean;
            includeE2eAdmin?: boolean;
            includeUi?: boolean;
        },
    ) {}

    generate(): Array<{ [output: string]: Types.ConfiguredOutput }> {
        const { pluginPath, includeE2eShop, includeE2eAdmin, includeUi } = this.config;
        const defs: CodegenDefinition[] = [];
        defs.push(
            new CodegenDefinition({
                output: `${pluginPath}/lib/generated-admin-types.ts`,
                api: 'admin',
            }),
            new CodegenDefinition({
                output: `${pluginPath}/lib/generated-shop-types.ts`,
                api: 'shop',
            }),
        );
        if (includeE2eShop) {
            defs.push(
                new CodegenDefinition({
                    output: `${pluginPath}/e2e/graphql/gql-shop/`,
                    documents: `${pluginPath}/e2e/graphql/shop-e2e-definitions.graphql.ts`,
                    api: 'shop',
                }),
            );
        }
        if (includeE2eAdmin) {
            defs.push(
                new CodegenDefinition({
                    output: `${pluginPath}/e2e/graphql/gql-admin/`,
                    documents: `${pluginPath}/e2e/graphql/admin-e2e-definitions.graphql.ts`,
                    api: 'admin',
                }),
            );
        }
        if (includeUi) {
            defs.push(
                new CodegenDefinition({
                    output: `${pluginPath}/ui/gql/`,
                    documents: `${pluginPath}/ui/**/*.ts`,
                    api: 'admin',
                }),
            );
        }
        return defs.map((d) => d.generate());
    }
}
