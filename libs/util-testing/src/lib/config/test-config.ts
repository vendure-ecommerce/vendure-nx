import { DefaultLogger, LogLevel, mergeConfig } from '@vendure/core';
import {
    PostgresInitializer,
    registerInitializer,
    SqljsInitializer,
    testConfig as defaultTestConfig,
} from '@vendure/testing';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

/**
 * We use a relatively long timeout on the initial beforeAll() function of the
 * e2e tests because on the first run (and always in CI) the sqlite databases
 * need to be generated, which can take a while.
 */
export const TEST_SETUP_TIMEOUT_MS = process.env.E2E_DEBUG ? 1800 * 1000 : 120000;

export function initializeE2e(dataDir: string) {
    registerInitializer('sqljs', new SqljsInitializer(dataDir));
    registerInitializer('postgres', new PostgresInitializer());
}

export const testConfig = mergeConfig(defaultTestConfig, {
    importExportOptions: {
        importAssetsDir: path.join(__dirname, '..', 'fixtures/assets'),
    },
    // logger: new DefaultLogger({ level: LogLevel.Info }),
    dbConnectionOptions: getDbConfig(),
});

function getDbConfig(): ConnectionOptions {
    const dbType = process.env.DB || 'sqljs';
    switch (dbType) {
        case 'postgres':
            return {
                type: 'postgres',
                synchronize: false,
                logging: false,
                host: process.env.DB_HOST,
                port: (process.env.DB_PORT as any) || 5432,
                username: 'postgres',
                password: process.env.DB_ROOT_PASSWORD,
            };
        case 'sqljs':
        default:
            return defaultTestConfig.dbConnectionOptions;
    }
}
