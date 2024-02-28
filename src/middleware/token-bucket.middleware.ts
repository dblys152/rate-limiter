import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { TokenBucketOptions } from "./token-bucket-options";
import { ApiResponseModel } from "../common/api-response-model";

@Injectable()
export class TokenBucketMiddleware implements NestMiddleware {
  private lastRefillTimestamp: number = Date.now();
  private tokens: number = 0;

  constructor(private readonly options: TokenBucketOptions) {
    this.tokens = this.options.maxTokens;
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.refillTokens();

    const isRequestAllowed = this.tokens >= 1;
    if (!isRequestAllowed) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).send(
        ApiResponseModel.success(HttpStatus.OK, 'Rate limit exceeded'));
      return;
    }

    this.tokens--;
    next();
  }

  private refillTokens(): void {
    const currentTime = Date.now();
    const timePassed = Math.max(currentTime - this.lastRefillTimestamp, 0);
    const millisecondsPerSecond: number = 1000;
    const tokensToAdd = timePassed * (this.options.refillRate / millisecondsPerSecond);
    this.tokens = Math.min(this.tokens + tokensToAdd, this.options.maxTokens);
    this.lastRefillTimestamp = currentTime;
  }
}