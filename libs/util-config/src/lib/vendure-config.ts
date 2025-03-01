import path from 'path';
import {
  DefaultAssetNamingStrategy,
  DefaultLogger,
  dummyPaymentHandler,
  LogLevel,
  TypeORMHealthCheckStrategy,
  VendureConfig,
} from '@vendure/core';
import { ConnectionOptions } from 'typeorm';
import {
  AssetServerPlugin,
  configureS3AssetStorage,
} from '@vendure/asset-server-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';

const PORT = +(process.env.API_INTERNAL_PORT as string);
const assetUrlPrefix =
  process.env.ASSET_URL_PREFIX ||
  `${process.env.API_PUBLIC_URL}:${process.env.API_PUBLIC_PORT}/vendure-assets/`;
const rootDir = process.cwd();

export const config: VendureConfig = {
  apiOptions: {
    port: PORT,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
  },
  authOptions: {
    requireVerification: true,
    tokenMethod: ['bearer', 'cookie'],
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_IDENTIFIER,
      password: process.env.SUPERADMIN_PASSWORD,
    },
  },
  dbConnectionOptions: {
    ...getDbConnectionOptions(),
    logging: ['error', 'warn'],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  logger: new DefaultLogger({
    level:
      process.env.LOG_LEVEL === 'debug'
        ? LogLevel.Debug
        : process.env.LOG_LEVEL === 'verbose'
        ? LogLevel.Verbose
        : LogLevel.Info,
  }),
  systemOptions: {
    healthChecks: [
      new TypeORMHealthCheckStrategy({ key: 'database', timeout: 5000 }),
    ],
  },
  plugins: [
    AssetServerPlugin.init({
      route: 'vendure-assets',
      assetUploadDir: path.join(rootDir, 'static/assets'),
      assetUrlPrefix,
      namingStrategy: new DefaultAssetNamingStrategy(),
      storageStrategyFactory: process.env.USE_MINIO
        ? configureS3AssetStorage({
            bucket: process.env.MINIO_BUCKET,
            credentials: {
              accessKeyId: process.env.MINIO_ACCESS_KEY,
              secretAccessKey: process.env.MINIO_SECRET_KEY,
            },
            nativeS3Configuration: {
              endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
              s3ForcePathStyle: true,
              signatureVersion: 'v4',
              region: process.env.MINIO_STORAGE_REGION || undefined,
            },
          })
        : undefined,
    }),

  ],
};

function getDbConnectionOptions() {
  return {
    type: 'postgres',
    synchronize: false,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  } as ConnectionOptions;
}
