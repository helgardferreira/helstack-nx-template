import { Module } from '@nestjs/common';

import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

// TODO: rename module
@Module({
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
