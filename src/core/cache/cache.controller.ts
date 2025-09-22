import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheHealthService } from './cache-health.service';

interface SetCacheDto {
  key: string;
  value: unknown;
  ttl?: number;
}

interface WrapTestDto {
  key: string;
  data: unknown;
  ttl?: number;
  delay?: number; // Simulate async operation delay
}

@Controller('cache')
export class CacheController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly cacheHealthService: CacheHealthService,
  ) {}

  @Get('health')
  async getHealthStatus() {
    return this.cacheHealthService.getDetailedStatus();
  }

  @Get('health/simple')
  async getSimpleHealth() {
    const isHealthy = await this.cacheHealthService.isHealthy();
    return { healthy: isHealthy };
  }

  @Get('health/connection')
  async getConnectionStatus() {
    return this.cacheHealthService.getConnectionStatus();
  }

  @Get(':key')
  async getValue(@Param('key') key: string) {
    const value = await this.cacheService.get(key);
    return {
      key,
      value,
      found: value !== undefined,
    };
  }

  @Post('set')
  @HttpCode(HttpStatus.CREATED)
  async setValue(@Body() dto: SetCacheDto) {
    await this.cacheService.set(dto.key, dto.value, dto.ttl);
    return {
      message: 'Value set successfully',
      key: dto.key,
      ttl: dto.ttl,
    };
  }

  @Delete(':key')
  async deleteValue(@Param('key') key: string) {
    await this.cacheService.del(key);
    return {
      message: 'Value deleted successfully',
      key,
    };
  }

  @Delete()
  async clearCache() {
    await this.cacheService.reset();
    return {
      message: 'Cache cleared successfully',
    };
  }

  @Post('wrap')
  async testWrap(@Body() dto: WrapTestDto) {
    const result = await this.cacheService.wrap(
      dto.key,
      async () => {
        // Simulate some async operation
        if (dto.delay) {
          await new Promise((resolve) => setTimeout(resolve, dto.delay));
        }
        return dto.data;
      },
      dto.ttl,
    );

    return {
      message: 'Wrap operation completed',
      key: dto.key,
      result,
      ttl: dto.ttl,
    };
  }

  @Get('keys/generate')
  generateKey(@Query('prefix') prefix: string, @Query('parts') parts?: string) {
    const keyParts = parts ? parts.split(',') : [];
    const generatedKey = this.cacheService.generateKey(prefix, ...keyParts);

    return {
      prefix,
      parts: keyParts,
      generatedKey,
    };
  }

  @Get('test/bulk')
  async bulkTest() {
    const testData = [
      { key: 'test:1', value: 'Hello World', ttl: 60 },
      {
        key: 'test:2',
        value: { message: 'Object test', number: 42 },
        ttl: 120,
      },
      { key: 'test:3', value: [1, 2, 3, 4, 5], ttl: 180 },
    ];

    const results = [];

    for (const item of testData) {
      // Set value
      await this.cacheService.set(item.key, item.value, item.ttl);

      // Get value back
      const retrieved = await this.cacheService.get(item.key);

      results.push({
        key: item.key,
        original: item.value,
        retrieved,
        match: JSON.stringify(item.value) === JSON.stringify(retrieved),
        ttl: item.ttl,
      });
    }

    return {
      message: 'Bulk test completed',
      results,
    };
  }

  @Post('test/performance')
  async performanceTest(
    @Body() body: { operations?: number; keyPrefix?: string },
  ) {
    const operations = body.operations || 100;
    const keyPrefix = body.keyPrefix || 'perf_test';

    const startTime = Date.now();
    const results = {
      setOperations: 0,
      getOperations: 0,
      deleteOperations: 0,
      errors: 0,
    };

    // Set operations
    for (let i = 0; i < operations; i++) {
      try {
        await this.cacheService.set(
          `${keyPrefix}:${i}`,
          { index: i, timestamp: Date.now() },
          300,
        );
        results.setOperations++;
      } catch {
        results.errors++;
      }
    }

    // Get operations
    for (let i = 0; i < operations; i++) {
      try {
        await this.cacheService.get(`${keyPrefix}:${i}`);
        results.getOperations++;
      } catch {
        results.errors++;
      }
    }

    // Delete operations
    for (let i = 0; i < operations; i++) {
      try {
        await this.cacheService.del(`${keyPrefix}:${i}`);
        results.deleteOperations++;
      } catch {
        results.errors++;
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    return {
      message: 'Performance test completed',
      operations,
      totalTime,
      averageTimePerOperation: totalTime / (operations * 3),
      results,
    };
  }

  //   @Get('debug/keys')
  //   async getDebugKeys() {
  //     const keys = await this.cacheService.getAllKeys();
  //     return {
  //       message: 'Debug: All keys in cache',
  //       keys,
  //       count: keys.length,
  //     };
  //   }
}
