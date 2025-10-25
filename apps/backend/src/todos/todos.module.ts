import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { TodoEntity } from './entities';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [MikroOrmModule.forFeature([TodoEntity])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
