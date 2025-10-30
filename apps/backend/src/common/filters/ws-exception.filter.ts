/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import type { WebSocket } from 'ws';

import {
  type ServerError,
  ServerErrorSchema,
  WsErrorSchema,
} from '@helstack-nx-template/schemas';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  override catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<WebSocket>();

    let response: ServerError;

    try {
      response = ServerErrorSchema.encode({
        type: 'error',
        error: WsErrorSchema.parse(exception.getError()),
      });
    } catch {
      response = {
        type: 'error',
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        },
      };
    }

    client.send(JSON.stringify(response));
  }
}
