import { Request, Response } from 'express';
import { LeakyBucketMiddleware } from './leaky-bucket.middleware';
import { LeakyBucketOptions } from './leaky-bucket-options';
import { HttpStatus, NestMiddleware } from '@nestjs/common';

describe('LeakyBucketMiddleware', () => {
  const BUCKET_SIZE = 10;
  const LEAK_RATE = 1;
  let middleware: NestMiddleware;

  beforeEach(() => {
    const options: LeakyBucketOptions = { bucketSize: BUCKET_SIZE, leakRate: LEAK_RATE };
    middleware = new LeakyBucketMiddleware(options);
  });

  it('제한 내에서 요청을 처리한다', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockNext: jest.Mock = jest.fn();

    for (let i = 0; i < BUCKET_SIZE; i++) {
      middleware.use(mockRequest, mockResponse, mockNext);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(mockNext).toHaveBeenCalledTimes(BUCKET_SIZE);
  });

  it('제한을 초과하는 요청은 429로 응답한다', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockNext: jest.Mock = jest.fn();

    for (let i = 0; i < BUCKET_SIZE + 1; i++) {
      middleware.use(mockRequest, mockResponse, mockNext);
    }

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(mockNext).toHaveBeenCalledTimes(BUCKET_SIZE);
  });
});
