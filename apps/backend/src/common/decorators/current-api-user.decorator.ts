import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export const CurrentApiUser = createParamDecorator(
  (
    _data: unknown,
    executionContext: ExecutionContext
  ): Record<string, unknown> | undefined => {
    const request = executionContext.switchToHttp().getRequest<Request>();

    return request.user;
  }
);
