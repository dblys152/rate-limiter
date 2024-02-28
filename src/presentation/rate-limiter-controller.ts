import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiResponseModel } from "src/common/api-response-model";

@Controller('/api/limiters')
export class RateLimiterController {
  @Get('/leaky-bucket')
  limitLeakyBucket(@Res() res: Response): void {
    res.status(HttpStatus.OK).send(
      ApiResponseModel.success(HttpStatus.OK, 'Success leaky bucket'));
  }

  @Get('/token-bucket')
  limitTokenBucket(@Res() res: Response): void {
    res.status(HttpStatus.OK).send(
      ApiResponseModel.success(HttpStatus.OK, 'Success token Bucket'));
  }

  @Get('/fixed-window-counter')
  limitFixedWindowCounter(@Res() res: Response): void {
    res.status(HttpStatus.OK).send(
      ApiResponseModel.success(HttpStatus.OK, 'Success fixed window counter'));
  }

  @Get('/sliding-window-log')
  limitSlidingWindowLog(@Res() res: Response): void {
    res.status(HttpStatus.OK).send(
      ApiResponseModel.success(HttpStatus.OK, 'Success sliding window log'));
  }
}