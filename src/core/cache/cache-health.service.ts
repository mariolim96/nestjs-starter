import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';

@Injectable()
export class CacheHealthService {
  constructor(private readonly cacheService: CacheService) {}

  async isHealthy(): Promise<boolean> {
    try {
      const testKey = 'health_check';
      const testValue = 'ok';

      await this.cacheService.set(testKey, testValue, 10);
      const result = await this.cacheService.get(testKey);
      await this.cacheService.del(testKey);

      return result === testValue;
    } catch {
      return false;
    }
  }

  async getConnectionStatus(): Promise<{
    isConnected: boolean;
    responseTime?: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      const isHealthy = await this.isHealthy();
      const responseTime = Date.now() - startTime;

      return {
        isConnected: isHealthy,
        responseTime,
      };
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getDetailedStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    checks: {
      connection: boolean;
      readWrite: boolean;
      responseTime: number;
    };
    error?: string;
  }> {
    const timestamp = new Date().toISOString();
    const startTime = Date.now();

    try {
      // Test connection and read/write operations
      const testKey = 'detailed_health_check';
      const testValue = { test: true, timestamp };

      // Test write
      await this.cacheService.set(testKey, testValue, 30);

      // Test read
      const result = await this.cacheService.get(testKey);

      // Test delete
      await this.cacheService.del(testKey);

      const responseTime = Date.now() - startTime;
      const readWriteSuccess =
        JSON.stringify(result) === JSON.stringify(testValue);

      return {
        status: readWriteSuccess ? 'healthy' : 'unhealthy',
        timestamp,
        checks: {
          connection: true,
          readWrite: readWriteSuccess,
          responseTime,
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        status: 'unhealthy',
        timestamp,
        checks: {
          connection: false,
          readWrite: false,
          responseTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
