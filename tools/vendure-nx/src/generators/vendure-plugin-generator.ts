import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { VendurePluginGeneratorSchema } from './schema';
import { updateJson } from 'nx/src/generators/utils/json';

/**
 * @description
 * Convert a string to UPPERCASE.
 * @param val
 */
function uppercase(val: string) {
  return val.toUpperCase();
}

/**
 * @description
 * Convert a string to UPPERCASE with underscore separator.
 * @param val
 */
function constantcase(val: string) {
  return val.replace(/(?:^|\.?)([A-Z])/g, (x, y) => '_' + y)
    .replace(/^_/, '')
    .toUpperCase();
}

/**
 * @description
 * Convert a string to TitleCase.
 * @param val
 */
function titlecase(val: string) {
  return val
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * @description
 * Convert a string to kebab-case.
 * @param val
 */
function kebabcase(val: string) {
  return val.replace(/(?:^|\.?)([A-Z])/g, (x, y) => '-' + y.toLowerCase()).replace(/^-/, '');
}

/**
 * @description
 * Generates a Vendure plugin in nx workspace.
 * @param tree
 * @param options
 */
export async function vendurePluginGenerator(
  tree: Tree,
  options: VendurePluginGeneratorSchema
) {
  const name = `plugin-${kebabcase(options.name)}`;
  const projectRoot = `libs/${name}`;

  addProjectConfiguration(tree, name, {
    root: projectRoot,
    targets: {
      "lint": {
        "executor": "@nx/eslint:lint",
        "outputs": ["{options.outputFile}"]
      },
    ...(options.e2e ? {
        "test": {
          "executor": "@nx/vite:test",
          "outputs": [`{workspaceRoot}/coverage/libs/${name}`],
          "options": {
            "config": "vite.config.ts"
          }
        } } : undefined
      ),
      codegen: {
        executor: './tools/executors/codegen:generate-plugin-types',
        options: {
          pluginPath: `libs/${name}/src`,
          includeUi: options.uiExtension,
          includeE2eShop: options.e2e,
          includeE2eAdmin: options.e2e,
        },
      },
    },
    tags: [],
  })

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    uppercase,
    titlecase,
    kebabcase,
    constantcase,
    filename: kebabcase(options.name),
    ...options,
  });

  if(!options.e2e) {
    tree.delete(path.join(projectRoot, 'src/e2e'));
  }

  if(!options.uiExtension) {
    tree.delete(path.join(projectRoot, 'src/ui'));
  }

  updateJson(tree, 'tsconfig.base.json', (tsConfig) => {
    // Add plugin path to tsconfig.base.json
    if (tsConfig.compilerOptions.paths) {
      tsConfig.compilerOptions.paths[`${options.scope}/${name}`] = [`${projectRoot}/src/index.ts`];
    }
    return tsConfig;
  });

  await formatFiles(tree);

}

export default vendurePluginGenerator;
