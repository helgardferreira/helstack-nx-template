import type { IncomingMessage } from 'http';

import { Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  type OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { WebSocket, WebSocketServer } from 'ws';

import {
  type ClientMessage,
  ClientMessageSchema,
} from '@helstack-nx-template/schemas';

import { WsExceptionFilter } from '../common/filters';
import { ZodWsPipe } from '../common/pipes';

import { EventsService } from './events.service';

// TODO: rename gateway
// TODO: move gateway example into `helstack-nx-template` repo (after creating all the relevant utilities)
// TODO: continue here...
@WebSocketGateway({ path: 'events' })
export class EventsGateway
  implements
    OnGatewayConnection<WebSocket>,
    OnGatewayDisconnect<WebSocket>,
    OnGatewayInit<WebSocketServer>
{
  constructor(private readonly eventsService: EventsService) {}

  // TODO: setup `@UseInterceptors(new ZodResponseInterceptor(ServerMessageSchema))`
  @SubscribeMessage('events')
  @UseFilters(new WsExceptionFilter())
  onEvent(
    @ConnectedSocket() _client: WebSocket,
    @MessageBody(new ZodWsPipe(ClientMessageSchema))
    payload: ClientMessage
  ) {
    console.log({ payload });

    Logger.log(`onEvent: ${JSON.stringify(payload)}`);

    this.eventsService.broadcast({
      event: 'events',
      data: 'Hello lobby!',
    });

    // TODO: make use of `ServerAckSchema` here
    return { event: 'events', data: 'Ack from server' };
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

  // TODO: either implement this or remove this
  afterInit(_server: WebSocketServer) {
    Logger.log('afterInit');
  }
}
