import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RateLimiterController } from "./rate-limiter-controller";
import { TokenBucketMiddleware } from "src/middleware/token-bucket.middleware";
import { LeakyBucketMiddleware } from "src/middleware/leaky-bucket.middleware";
import { FixedWindowCounterMiddleware } from "src/middleware/fixed-window-counter.middleware";
import { SlidingWindowLogMiddleware } from "src/middleware/sliding-window-log.middleware";
import { LeakyBucketOptions } from "src/middleware/leaky-bucket-options";
import { TokenBucketOptions } from "src/middleware/token-bucket-options";
import { FixedWindowCounterOptions } from "src/middleware/fixed-window-counter-options";
import { SlidingWindowLogOptions } from "src/middleware/sliding-window-log-options";


@Module({
  controllers: [RateLimiterController],
  providers: [
    {
      provide: LeakyBucketOptions,
      useValue: {
        bucketSize: 10,
        leakRate: 2,
      },
    },
    {
      provide: TokenBucketOptions,
      useValue: {
        maxTokens: 10,
        refillRate: 2,
      },
    },
    {
      provide: FixedWindowCounterOptions,
      useValue: {
        windowSize: 10000,
        maxRequests: 5,
      },
    },
    {
      provide: SlidingWindowLogOptions,
      useValue: {
        windowSize: 10000,
        maxRequests: 5,
      },
    },
  ],
})
export class RateLimiterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LeakyBucketMiddleware)
      .forRoutes('/api/limiters/leaky-bucket');

    consumer
      .apply(TokenBucketMiddleware)
      .forRoutes('/api/limiters/token-bucket');

    consumer
      .apply(FixedWindowCounterMiddleware)
      .forRoutes('/api/limiters/fixed-window-counter');

    consumer
      .apply(SlidingWindowLogMiddleware)
      .forRoutes('/api/limiters/sliding-window-log');
  }
}