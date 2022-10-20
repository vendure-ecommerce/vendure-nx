import { uiExtensionsConfig } from '@vendure-nx/util-config';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';

compileUiExtensions({
    outputPath: path.join(__dirname, '../../../dist/apps/admin-ui-app'),
    extensions: uiExtensionsConfig,
    devMode: false,
})
    .compile?.()
    .then(() => {
        process.exit(0);
    });
