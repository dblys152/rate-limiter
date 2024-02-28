import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { FixedWindowCounterOptions } from "./fixed-window-counter-options";
import { ApiResponseModel } from "../common/api-response-model";

@Injectable()
export class FixedWindowCounterMiddleware implements NestMiddleware {
  private windowStartTimestamp: number = Date.now();
  private requestCount: number = 0;

  constructor(private readonly options: FixedWindowCounterOptions) {}

  use(req: Request, res: Response, next: NextFunction) {
    const currentTime = Date.now();

    const windowExceeded = (currentTime - this.windowStartTimestamp) > this.options.windowSize;
    if (windowExceeded) {
      this.windowStartTimestamp = currentTime;
      this.requestCount = 0;
    }

    const withinRateLimit = this.requestCount < this.options.maxRequests;
    if (!withinRateLimit) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).send(
        ApiResponseModel.success(HttpStatus.OK, 'Rate limit exceeded'));
      return;
    }

    this.requestCount++;
    next();
  }
}