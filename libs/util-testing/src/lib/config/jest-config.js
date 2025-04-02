const path = require('path');

const pluginArg = process.argv.find((arg) => arg.startsWith('--plugin='));

if (!pluginArg) {
  console.error('No plugin specified! Please pass --plugin=<pluginDirName>');
}
const pluginDirname = pluginArg.split('=')[1];

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: path.join('../../src/plugins', pluginDirname, 'e2e'),
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: './e2e-common/config/tsconfig.e2e.json',
      diagnostics: false,
    },
  },
};
