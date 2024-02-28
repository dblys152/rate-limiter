import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LeakyBucketOptions } from "./leaky-bucket-options";
import { ApiResponseModel } from "../common/api-response-model";

@Injectable()
export class LeakyBucketMiddleware implements NestMiddleware {
  private lastLeakTimestamp: number = Date.now();
  private bucketLevel: number = 0;

  constructor(private options: LeakyBucketOptions) {
    this.bucketLevel = this.options.bucketSize;
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.refillBucket();

    const isRequestAllowed = this.bucketLevel >= 1;
    if (!isRequestAllowed) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).send(
        ApiResponseModel.success(HttpStatus.OK, 'Rate limit exceeded'));
      return;
    }

    this.bucketLevel--;
    next();
  }

  private refillBucket(): void {
    const currentTime = Date.now();
    const timePassed = Math.max(currentTime - this.lastLeakTimestamp, 0);
    const millisecondsPerSecond: number = 1000;
    const leakAmount = timePassed * (this.options.leakRate / millisecondsPerSecond);
    this.bucketLevel = Math.min(this.bucketLevel + leakAmount, this.options.bucketSize);
    this.lastLeakTimestamp = currentTime;
  }
}