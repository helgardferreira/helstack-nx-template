import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import type {
  CreateTodo,
  Todo,
  UpdateTodo,
} from '@helstack-nx-template/schemas';

import { TodoEntity } from './entities';

@Injectable()
export class TodosService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(TodoEntity)
    private readonly todoRepository: EntityRepository<TodoEntity>
  ) {}

  async create(data: CreateTodo): Promise<Todo> {
    const todo = this.todoRepository.create(data);
    await this.em.flush();

    return todo;
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.todoRepository.findAll();

    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id);

    if (!todo) throw new NotFoundException('Todo not found');

    return todo;
  }

  async update(id: string, data: UpdateTodo): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id);

    if (!todo) throw new NotFoundException('Todo not found');

    wrap(todo).assign(data);
    await this.em.flush();

    return todo;
  }

  async remove(id: string): Promise<void> {
    const count = await this.todoRepository.nativeDelete(id);

    if (count === 0) throw new NotFoundException('Todo not found');
  }
}
