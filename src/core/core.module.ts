import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { TransformResponseInterceptor } from './interceptors/transform-response/transform-response.interceptor';
import { LoggerService } from './logger/logger.service';
import { LoggerMiddleware } from './logger/logger.middleware';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformResponseInterceptor,
    },
    LoggerService,
  ],
  exports: [LoggerService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

// import {
//   Global,
//   MiddlewareConsumer,
//   Module,
//   RequestMethod,
//   NestModule
// } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import config from '../config';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { TransformResponseInterceptor } from './interceptors/transform-response/transform-response.interceptor';
// import { LoggerService } from './logger/logger.service';
// import { LoggerMiddleware } from './logger/logger.middleware';

// @Global()
// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       load: [config],
//     }),
//   ],
//   providers: [
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: TransformResponseInterceptor,
//     },
//     LoggerService, // <-- Add provider
//   ],
//   exports: [LoggerService], // <-- Add export
// })
