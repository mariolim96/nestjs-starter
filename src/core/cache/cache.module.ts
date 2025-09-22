import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { CacheHealthService } from './cache-health.service';
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<{
          host: string;
          port: number;
          password?: string;
        }>('redis');
        const cacheConfig = configService.get<{
          ttl: number;
          max: number;
        }>('cache');
        if (!redisConfig) {
          throw new Error('Redis configuration is missing');
        }
        if (!cacheConfig) {
          throw new Error('Cache configuration is missing');
        }

        // Create Redis connection URL
        const redisUrl =  `redis://${redisConfig.password ? `:${redisConfig.password}@` : ''}${redisConfig.host}:${redisConfig.port}`;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        // const cache = new CacheableMemory({
        //   lruSize: cacheConfig.max,
        //   ttl: cacheConfig.ttl * 1000, // Convert to milliseconds
        // }) as KeyvStoreAdapter | KeyvOptions | Map<any, any>;
        const keyv = new Keyv(new KeyvRedis(redisUrl));
        keyv.on('error', (err) => console.error('Keyv connection error:', err));
        // const redis = new KeyvRedis(redisUrl);

        return {
          stores: [keyv],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  controllers: [CacheController],
  providers: [CacheService, CacheHealthService],
  exports: [CacheService, CacheHealthService],
})
export class CacheConfigModule {}
