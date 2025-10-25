import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { z } from 'zod';

import {
  type CreateTodo,
  CreateTodoSchema,
  type Todo,
  TodoSchema,
  type UpdateTodo,
  UpdateTodoSchema,
} from '@helstack-nx-template/schemas';

import { ZodResponseInterceptor } from '../common/interceptors';
import { ZodValidationPipe } from '../common/pipes';

import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly service: TodosService) {}

  @Post()
  @UseInterceptors(new ZodResponseInterceptor(TodoSchema))
  createTodo(
    @Body(new ZodValidationPipe(CreateTodoSchema)) body: CreateTodo
  ): Promise<Todo> {
    return this.service.create(body);
  }

  @Get()
  @UseInterceptors(new ZodResponseInterceptor(TodoSchema))
  findAllTodos(): Promise<Todo[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @UseInterceptors(new ZodResponseInterceptor(TodoSchema))
  findTodoById(
    @Param('id', new ZodValidationPipe(z.uuid())) id: string
  ): Promise<Todo> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(new ZodResponseInterceptor(TodoSchema))
  updateTodoById(
    @Param('id', new ZodValidationPipe(z.uuid())) id: string,
    @Body(new ZodValidationPipe(UpdateTodoSchema)) body: UpdateTodo
  ): Promise<Todo> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  removeTodoById(
    @Param('id', new ZodValidationPipe(z.uuid())) id: string
  ): Promise<void> {
    return this.service.remove(id);
  }
}
