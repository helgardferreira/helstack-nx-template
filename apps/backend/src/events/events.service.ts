import { Injectable, Logger } from '@nestjs/common';
import type { WebSocket } from 'ws';

// TODO: maybe improve this later?
// TODO: maybe reimplement this with:
//       - rxjs
//       - xstate + rxjs (experiment with `ws` events on `WebSocket` instance and then implement child actor for managing FSM of client children)
@Injectable()
export class EventsService {
  private readonly clients = new Map<string, WebSocket>();

  addClient(client: WebSocket): string {
    const clientId = crypto.randomUUID();

    this.clients.set(clientId, client);

    // TODO: remove this after debugging
    Logger.log(`Client joined (${clientId}) (numClients=${this.clients.size})`);

    return clientId;
  }

  removeClient(clientId: string) {
    const client = this.clients.get(clientId);

    if (!client) return;

    this.clients.delete(clientId);

    // TODO: remove this after debugging
    Logger.log(
      `Client left (${clientId}) (numClients=${this.clients.size ?? 0})`
    );
  }

  // TODO: enhance this
  broadcast(payload: unknown) {
    const data = JSON.stringify(payload);

    for (const ws of this.clients.values()) {
      if (ws.readyState === ws.OPEN) ws.send(data);
    }
  }
}
