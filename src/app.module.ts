import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimiterModule } from './presentation/rate-limiter-module';

@Module({
  imports: [RateLimiterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
