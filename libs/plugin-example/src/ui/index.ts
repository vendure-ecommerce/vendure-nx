import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import path from 'path';

export const uiExtensions: AdminUiExtension = {
  id: 'example',
  extensionPath: path.join(__dirname, './'),
  providers: ['providers.ts'],
  routes: [{ route: 'example', filePath: 'routes.ts' }],
};
