import { Injectable, Logger } from '@nestjs/common';
import type { WebSocket } from 'ws';

@Injectable()
export class EventsService {
  private readonly clients = new Map<string, WebSocket>();

  addClient(client: WebSocket): string {
    const clientId = crypto.randomUUID();

    this.clients.set(clientId, client);

    Logger.log(`Client joined (${clientId}) (numClients=${this.clients.size})`);

    return clientId;
  }

  removeClient(clientId: string) {
    const client = this.clients.get(clientId);

    if (!client) return;

    this.clients.delete(clientId);

    Logger.log(
      `Client left (${clientId}) (numClients=${this.clients.size ?? 0})`
    );
  }

  broadcast(payload: unknown) {
    const data = JSON.stringify(payload);

    for (const ws of this.clients.values()) {
      if (ws.readyState === ws.OPEN) ws.send(data);
    }
  }
}
