import type { EntityManager } from '@mikro-orm/better-sqlite';
import { Seeder } from '@mikro-orm/seeder';

import { TodoSeeder } from './todo.seeder';
import { SeederContext } from './types/seeder-context';

export class SqliteSeeder extends Seeder<SeederContext> {
  run(em: EntityManager): Promise<void> {
    return this.call(em, [TodoSeeder.withCount(10)]);
  }
}
