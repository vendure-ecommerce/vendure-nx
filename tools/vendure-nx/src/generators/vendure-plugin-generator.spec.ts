import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { vendurePluginGeneratorGenerator } from './vendure-plugin-generator';
import { VendurePluginGeneratorGeneratorSchema } from './schema';

describe('vendure-plugin-generator generator', () => {
  let tree: Tree;
  const options: VendurePluginGeneratorGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await vendurePluginGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
