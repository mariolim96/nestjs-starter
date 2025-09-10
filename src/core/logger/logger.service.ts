import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import chalk from 'chalk';

@Injectable()
export class LoggerService implements NestLogger {
  private readonly logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const { combine, timestamp, printf, json } = winston.format;

    // Determine if the application is running in development mode
    const isDevelopment = true;
    //   this.configService.get('environment') === 'development';

    // Custom color scheme
    const colors = {
      info: chalk.green,
      error: chalk.red.bold,
      warn: chalk.yellow,
      debug: chalk.blue,
      verbose: chalk.magenta,
      timestamp: chalk.gray,
      context: chalk.cyan.bold,
      message: chalk.white,
      meta: chalk.gray.italic,
    };

    // Choose a format based on the environment
    const logFormat = isDevelopment
      ? combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          printf(({ level, message, timestamp, context, meta, trace }) => {
            // Remove Winston's default colorization to apply our custom colors
            // eslint-disable-next-line no-control-regex
            const cleanLevel = level.replace(/\u001b\[[0-9;]*m/g, '');

            let logMessage = `${colors.timestamp(timestamp as string)} `;

            // Apply colors based on log level
            switch (cleanLevel) {
              case 'info':
                logMessage += colors.info('●');
                break;
              case 'error':
                logMessage += colors.error('✖');
                break;
              case 'warn':
                logMessage += colors.warn('⚠');
                break;
              case 'debug':
                logMessage += colors.debug('◐');
                break;
              case 'verbose':
                logMessage += colors.verbose('◑');
                break;
              default:
                logMessage += '○';
            }

            if (context) {
              logMessage += ` ${colors.context(`[${context as string}]`)}`;
            }

            logMessage += ` ${colors.message(message as string)}`;

            if (meta) {
              const metaString =
                typeof meta === 'object' && meta !== null
                  ? JSON.stringify(meta, null, 2)
                  : JSON.stringify(meta);
              logMessage += `\n${colors.meta(metaString)}`;
            }

            if (trace) {
              logMessage += `\n${colors.error(trace as string)}`;
            }

            return logMessage;
          }),
        )
      : combine(timestamp(), json());

    this.logger = winston.createLogger({
      level: this.configService.get<string>('LOG_LEVEL') || 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console(),
        // File transport for production logs
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: combine(timestamp(), json()),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: combine(timestamp(), json()),
        }),
      ],
    });
  }

  log(message: string, context?: string, meta?: unknown) {
    this.logger.info(message, {
      context,
      meta,
    });
  }

  error(message: string, trace?: string, context?: string, meta?: unknown) {
    this.logger.error(message, {
      context,
      trace,
      meta,
    });
  }

  warn(message: string, context?: string, meta?: unknown) {
    this.logger.warn(message, {
      context,
      meta,
    });
  }

  debug(message: string, context?: string, meta?: unknown) {
    this.logger.debug(message, {
      context,
      meta,
    });
  }

  verbose(message: string, context?: string, meta?: unknown) {
    this.logger.verbose(message, {
      context,
      meta,
    });
  }

  // Enhanced utility methods with better visual formatting
  logWithDetails(
    level: string,
    message: string,
    details: unknown,
    context?: string,
  ) {
    this.logger.log(level, message, {
      context,
      meta: details,
    });
  }

  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
  ) {
    const statusColor =
      statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'info';
    this.logger.log(
      statusColor,
      `${method} ${url} ${statusCode} - ${responseTime}ms`,
      {
        context: 'HTTP',
        meta: { method, url, statusCode, responseTime },
      },
    );
  }

  // Additional colorful logging methods
  success(message: string, context?: string, meta?: any) {
    this.log(`✅ ${message}`, context, meta);
  }

  fail(message: string, context?: string, meta?: any) {
    this.error(`❌ ${message}`, undefined, context, meta);
  }

  highlight(message: string, context?: string, meta?: any) {
    this.log(`🔸 ${message}`, context, meta);
  }
}
