import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import { ExamplePlugin } from '@vendure-nx/plugin-example';

export const uiExtensionsConfig: AdminUiExtension[] = [
  // When you create plugins which include UI extensions, add them here.
  ExamplePlugin.uiExtensions,
];
