import { generateMigration } from '@vendure/core';
import { ConnectionOptions } from 'typeorm';
import { config } from '@vendure-nx/util-config';

config.dbConnectionOptions = {
    ...config.dbConnectionOptions,
    logging: ['error', 'warn'],
} as ConnectionOptions;

const name = process.argv[2];
if (!name) {
    console.error(`No name provided for the migration. Use 'yarn nx run server:migration <name>'`);
    process.exit(1);
}

generateMigration(config, { name, outputDir: './apps/server/migrations' });
