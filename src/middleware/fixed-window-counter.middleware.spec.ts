import { Request, Response, NextFunction } from 'express';
import { FixedWindowCounterOptions } from './fixed-window-counter-options';
import { FixedWindowCounterMiddleware } from './fixed-window-counter.middleware';
import { HttpStatus, NestMiddleware } from '@nestjs/common';

describe('FixedWindowCounterMiddleware', () => {
  const WINDOW_SIZE: number = 10000;
  const MAX_REQUESTS: number = 3;
  let middleware: NestMiddleware;

  beforeEach(() => {
    const options: FixedWindowCounterOptions = { windowSize: WINDOW_SIZE, maxRequests: MAX_REQUESTS };
    middleware = new FixedWindowCounterMiddleware(options);
  });

  it('제한 내에서 요청을 처리한다', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockNext: NextFunction = jest.fn();

    for (let i = 0; i < MAX_REQUESTS; i++) {
      middleware.use(mockRequest, mockResponse, mockNext);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(mockNext).toHaveBeenCalledTimes(3);
  });

  it('제한을 초과하는 요청은 429로 응답한다', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockNext: NextFunction = jest.fn();

    for (let i = 0; i < MAX_REQUESTS + 1; i++) {
      middleware.use(mockRequest, mockResponse, mockNext);
    }

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(mockResponse.send).toHaveBeenCalledWith(expect.anything());
    expect(mockNext).toHaveBeenCalledTimes(3);
  });
});
