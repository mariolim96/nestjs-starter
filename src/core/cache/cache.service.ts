import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: LoggerService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) {
        this.logger.debug(`Cache hit for key: ${key}`, 'CacheService');
      } else {
        this.logger.debug(`Cache miss for key: ${key}`, 'CacheService');
      }
      return value;
    } catch (error) {
      this.logger.error(
        `Cache get error for key ${key}:`,
        error as string,
        'CacheService',
      );
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
      this.logger.debug(`Cache set for key: ${key}`, 'CacheService');
    } catch (error) {
      this.logger.error(
        `Cache set error for key ${key}:`,
        error as string,
        'CacheService',
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache deleted for key: ${key}`, 'CacheService');
    } catch (error) {
      this.logger.error(
        `Cache delete error for key ${key}:`,
        error as string,
        'CacheService',
      );
    }
  }

  async reset(): Promise<void> {
    try {
      await this.cacheManager.clear();
      this.logger.log('Cache cleared', 'CacheService');
    } catch (error) {
      this.logger.error('Cache reset error:', error as string, 'CacheService');
    }
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    try {
      return await this.cacheManager.wrap(
        key,
        fn,
        ttl ? ttl * 1000 : undefined,
      );
    } catch (error) {
      this.logger.error(
        `Cache wrap error for key ${key}:`,
        error as string,
        'CacheService',
      );
      // Fallback to direct function call if cache fails
      return await fn();
    }
  }

  generateKey(prefix: string, ...parts: string[]): string {
    return [prefix, ...parts].filter(Boolean).join(':');
  }
}
