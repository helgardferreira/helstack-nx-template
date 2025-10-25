import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configSchema } from './common/schemas';
import { PersistenceModule } from './persistence/persistence.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: (config: Record<string, unknown>) => configSchema.parse(config),
    }),
    PersistenceModule.register(),

    TodosModule,
  ],
  providers: [],
})
export class AppModule {}
