import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigSchema } from './common/schemas';
import { EventsModule } from './events/events.module';
import { PersistenceModule } from './persistence/persistence.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: (config: Record<string, unknown>) => ConfigSchema.parse(config),
    }),
    PersistenceModule.register(),

    EventsModule,
    TodosModule,
  ],
  providers: [],
})
export class AppModule {}
