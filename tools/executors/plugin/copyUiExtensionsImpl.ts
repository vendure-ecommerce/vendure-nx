import { ExecutorContext } from '@nx/devkit';
import { copy, remove } from 'fs-extra';
import * as path from 'path';

interface VendurePluginBuilderOptions {
    uiExtensionsPath: string;
    outputPath: string;
}

/**
 * Copies the uncompiled UI extension files over to the plugin dist dir.
 */
export async function copyUiExtensionsExecutor(
    options: VendurePluginBuilderOptions,
    context: ExecutorContext,
) {
    const outputPath = path.join(context.root, options.outputPath);
    await copy(options.uiExtensionsPath, outputPath);
    await remove(path.join(outputPath, 'index.ts'));

    return { success: true, outputPath };
}

export default copyUiExtensionsExecutor;
