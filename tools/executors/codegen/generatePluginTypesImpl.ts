import { generate } from '@graphql-codegen/cli';
import { ExecutorContext } from '@nx/devkit';
import * as fs from 'fs-extra';

import { PluginCodegenDefinition } from './codegen-types';

interface VendurePluginBuilderOptions {
    schemaUrl: string;
    pluginPath: string;
    includeUi: boolean;
    includeE2eShop: boolean;
    includeE2eAdmin: boolean;
    customOutputFile?: string;
}

export async function generateTypesExecutor(options: VendurePluginBuilderOptions, context: ExecutorContext) {
    const defs = new PluginCodegenDefinition(options);
    const generates = defs.generate().reduce((result, def) => ({ ...result, ...def }), {});
    const generatedFiles = await generate(
        {
            config: {
                strict: true,
                maybeValue: 'T',
                deprecatedFieldsWithReason: true,
                inputValueDeprecation: true,
                namingConvention: {
                    enumValues: 'keep',
                },
            },
            generates,
        },
        true,
    );
    for (const file of generatedFiles) {
        fs.writeFileSync(file.filename, file.content, 'utf-8');
    }
    return { success: true };
}

export default generateTypesExecutor;
