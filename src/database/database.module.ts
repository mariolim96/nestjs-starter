import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Pool, PoolConfig } from 'pg';

export const DATABASE = Symbol('DATABASE');

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: (configService: ConfigService) => {
        const dbUser = configService.get<string>('DATABASE_USER');
        const dbPassword = configService.get<string>('DATABASE_PASSWORD');
        const dbHost = configService.get<string>('DATABASE_HOST');
        const dbPort = configService.get<number>('DATABASE_PORT');
        const dbName = configService.get<string>('DATABASE_NAME');

        if (!dbUser || !dbPassword || !dbHost || !dbPort || !dbName) {
          throw new Error('Database configuration is incomplete');
        }
        const connectionString: string = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        const config: PoolConfig = {
          connectionString,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        };

        try {
          const pool = new Pool(config);
          return drizzle(pool, { schema });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Unknown database connection error';
          throw new Error(`Failed to create database pool: ${errorMessage}`);
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
