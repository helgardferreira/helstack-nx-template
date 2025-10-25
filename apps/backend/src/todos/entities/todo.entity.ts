import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/better-sqlite';
import { v4 } from 'uuid';

import type { CreateTodo, Todo } from '@helstack-nx-template/schemas';

@Entity({ tableName: 'todo' })
export class TodoEntity implements Todo {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ type: 'boolean' })
  completed: boolean & Opt = false;

  @Property({ nullable: true })
  description: string | null;

  @Property()
  title: string;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date().getTime() })
  updatedAt: Date & Opt = new Date();

  constructor(data: CreateTodo) {
    const { description, title } = data;

    this.description = description ?? null;
    this.title = title;
  }
}
