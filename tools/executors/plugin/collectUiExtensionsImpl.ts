import { ExecutorContext } from '@nx/devkit';
import * as fs from 'fs-extra';
import * as path from 'path';

interface VendurePluginBuilderOptions {
    pluginsPath: string;
    pluginMatcher: string;
    outputPath: string;
}

export async function collectUiExtensionsExecutor(
    options: VendurePluginBuilderOptions,
    context: ExecutorContext,
) {
    const outputPath = path.join(context.root, options.outputPath);
    const pathContents = await fs.readdir(options.pluginsPath);
    const pluginMatcher = options.pluginMatcher ?? '^plugin-.+$';
    const pluginMatcherRe = new RegExp(pluginMatcher);
    for (const dir of pathContents) {
        // return { success: false, dir };

        if (pluginMatcherRe.test(dir)) {
            console.log(dir);
            const uiPath = path.join(context.root, options.pluginsPath, dir, 'src', 'ui');
            if (fs.pathExistsSync(uiPath)) {
                console.log(`copying to:`, path.join(outputPath, dir));
                await fs.copy(uiPath, path.join(outputPath, dir));
            }
        }
    }
    return { success: true, outputPath };
}

export default collectUiExtensionsExecutor;
