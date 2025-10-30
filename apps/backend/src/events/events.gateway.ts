import type { IncomingMessage } from 'http';

import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { WebSocket } from 'ws';

import {
  type ClientMessage,
  ClientMessageSchema,
  type ServerMessage,
  ServerMessageSchema,
} from '@helstack-nx-template/schemas';

import { WsExceptionFilter } from '../common/filters';
import { ZodWsInterceptor } from '../common/interceptors';
import { ZodWsPipe } from '../common/pipes';

import { EventsService } from './events.service';

@WebSocketGateway({ path: 'events' })
export class EventsGateway
  implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket>
{
  constructor(private readonly eventsService: EventsService) {}

  @SubscribeMessage('events')
  @UseFilters(new WsExceptionFilter())
  @UseInterceptors(new ZodWsInterceptor(ServerMessageSchema))
  onEvent(
    @ConnectedSocket() _client: WebSocket,
    @MessageBody(new ZodWsPipe(ClientMessageSchema))
    payload: ClientMessage
  ): ServerMessage {
    console.log({ payload });

    Logger.log(`onEvent: ${JSON.stringify(payload)}`);

    this.eventsService.broadcast({
      event: 'events',
      data: 'Hello lobby!',
    });

    return {
      meta: { ts: new Date() },
      type: 'ACK',
      ok: true,
    };
  }

  handleConnection(
    @ConnectedSocket() client: WebSocket,
    _req: IncomingMessage | undefined
  ) {
    const clientId = this.eventsService.addClient(client);

    client.clientId = clientId;
  }

  handleDisconnect(@ConnectedSocket() client: WebSocket) {
    if (client.clientId) this.eventsService.removeClient(client.clientId);
  }
}
