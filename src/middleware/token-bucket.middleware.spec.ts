import { Request, Response, NextFunction } from 'express';
import { TokenBucketOptions } from './token-bucket-options';
import { TokenBucketMiddleware } from './token-bucket.middleware';
import { HttpStatus, NestMiddleware } from '@nestjs/common';

describe('TokenBucketMiddleware', () => {
  const MAX_TOKENS = 10;
  const REFILL_RATE = 2;
  let middleware: NestMiddleware;

  beforeEach(() => {
    const options: TokenBucketOptions = { maxTokens: MAX_TOKENS, refillRate: REFILL_RATE };
    middleware = new TokenBucketMiddleware(options);

    jest.useFakeTimers();
  });

  it('제한 내에서 요청을 처리한다', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockNext: NextFunction = jest.fn();

    for (let i = 0; i < MAX_TOKENS; i++) {
      middleware.use(mockRequest, mockResponse, mockNext);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(mockNext).toHaveBeenCalledTimes(MAX_TOKENS);
  });

  it('제한을 초과하는 요청은 429로 응답한다', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockNext: NextFunction = jest.fn();

    for (let i = 0; i < MAX_TOKENS + 1; i++) {
      middleware.use(mockRequest, mockResponse, mockNext);
    }

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(mockNext).toHaveBeenCalledTimes(MAX_TOKENS);
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
