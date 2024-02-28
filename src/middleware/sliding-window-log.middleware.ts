import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SlidingWindowLogOptions } from "./sliding-window-log-options";
import { ApiResponseModel } from "../common/api-response-model";

@Injectable()
export class SlidingWindowLogMiddleware implements NestMiddleware {
  private log: { timestamp: number }[] = [];

  constructor(private readonly options: SlidingWindowLogOptions) {}

  use(req: Request, res: Response, next: NextFunction) {
    const currentTime = Date.now();
    this.clearOutdatedEntries(currentTime);

    const isRequestAllowed = this.log.length < this.options.maxRequests;
    if (!isRequestAllowed) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).send(
        ApiResponseModel.success(HttpStatus.OK, 'Rate limit exceeded'));
      return;
    }

    this.log.push({ timestamp: currentTime });
    next();
  }

  private clearOutdatedEntries(currentTime: number): void {
    const windowStart = currentTime - this.options.windowSize;
    this.log = this.log.filter(t => t.timestamp > windowStart);
  }
}