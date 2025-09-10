import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
import * as crypto from 'crypto';

interface RequestWithId extends Request {
  requestId?: string;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly sensitiveHeaders = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
    'x-access-token',
  ];

  private readonly sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'credentials',
  ];

  constructor(private readonly logger: LoggerService) {}

  use(req: RequestWithId, res: Response, next: NextFunction) {
    const start = Date.now();
    const requestId = this.generateRequestId();

    // Add request ID to request object for tracking
    req.requestId = requestId;

    // Add request ID to response headers for client tracking
    res.setHeader('X-Request-ID', requestId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, ip, headers, query, body } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const contentLength = headers['content-length'] || '0';

    // Log incoming request
    this.logger.log(`🚀 Incoming ${method} ${url}`, 'HTTP-IN', {
      requestId,
      method,
      url,
      ip,
      userAgent,
      contentLength,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: this.filterSensitiveData(headers, this.sensitiveHeaders),
      query: Object.keys(query).length > 0 ? query : undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: this.shouldLogBody(method, body)
        ? this.filterSensitiveData(body, this.sensitiveFields)
        : undefined,
      timestamp: new Date().toISOString(),
    });

    // Handle response logging
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const statusCode = res.statusCode;
      const contentLength = res.get('content-length') || '0';

      const message = this.formatResponseMessage(
        method,
        url,
        statusCode,
        responseTime,
      );
      const logData = {
        requestId,
        method,
        url,
        statusCode,
        responseTime,
        contentLength,
        ip: this.getClientIp(req),
        userAgent,
        performanceCategory: this.categorizePerformance(responseTime),
      };

      // Enhanced status-based logging
      if (statusCode >= 500) {
        this.logger.error(`💥 ${message}`, undefined, 'HTTP-OUT', logData);
      } else if (statusCode >= 400) {
        this.logger.warn(`⚠️ ${message}`, 'HTTP-OUT', logData);
      } else if (statusCode >= 300) {
        this.logger.log(`🔄 ${message}`, 'HTTP-OUT', logData);
      } else {
        this.logger.success(`✅ ${message}`, 'HTTP-OUT', logData);
      }

      // Performance warnings
      if (responseTime > 1000) {
        this.logger.warn(
          `🐌 Slow response detected: ${responseTime}ms for ${method} ${url}`,
          'PERFORMANCE',
          { requestId, responseTime, threshold: 1000 },
        );
      }
    });

    // Handle request errors
    res.on('error', (error) => {
      const responseTime = Date.now() - start;
      this.logger.error(
        `💥 Request error: ${method} ${url}`,
        error.stack,
        'HTTP-ERROR',
        {
          requestId,
          method,
          url,
          responseTime,
          error: error.message,
          ip: this.getClientIp(req),
        },
      );
    });

    next();
  }

  private generateRequestId(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'Unknown'
    );
  }

  private formatResponseMessage(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
  ): string {
    const performanceEmoji = this.getPerformanceEmoji(responseTime);
    return `${performanceEmoji} ${method} ${url} ${statusCode} ${responseTime}ms`;
  }

  private getPerformanceEmoji(responseTime: number): string {
    if (responseTime > 2000) return '🐌';
    if (responseTime > 1000) return '⏱️';
    if (responseTime < 100) return '⚡';
    return '';
  }

  private categorizePerformance(responseTime: number): string {
    if (responseTime < 100) return 'excellent';
    if (responseTime < 300) return 'good';
    if (responseTime < 1000) return 'acceptable';
    if (responseTime < 2000) return 'slow';
    return 'very_slow';
  }

  private shouldLogBody(method: string, body: any): boolean {
    // Only log body for POST, PUT, PATCH requests and if body exists
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      methodsWithBody.includes(method.toUpperCase()) &&
      body &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.keys(body).length > 0
    );
  }

  private filterSensitiveData(data: any, sensitiveFields: string[]): any {
    if (!data || typeof data !== 'object') return data;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const filtered = { ...data };

    for (const field of sensitiveFields) {
      for (const key in filtered) {
        if (key.toLowerCase().includes(field.toLowerCase())) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          filtered[key] = '[REDACTED]';
        }
      }
    }

    return filtered;
  }
}
