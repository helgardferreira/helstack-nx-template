import type { Todo } from '@helstack-nx-template/schemas';

import type { TodoActorRef } from './actors/todo/todo.machine';

type TodosActorContext = {
  draftTodoActor: TodoActorRef | undefined;
  todoActors: TodoActorRef[];
};

type LoadSuccessEvent = {
  type: 'LOAD_SUCCESS';
  todos: Todo[];
};

type RemoveChildEvent = {
  type: 'REMOVE_CHILD';
  id: string;
};

type RetryEvent = {
  type: 'RETRY';
};

type SpawnChildEvent = {
  type: 'SPAWN_CHILD';
  todo: Todo;
};

type TodosActorEvent =
  | LoadSuccessEvent
  | RemoveChildEvent
  | RetryEvent
  | SpawnChildEvent;

export type {
  LoadSuccessEvent,
  RemoveChildEvent,
  RetryEvent,
  TodosActorContext,
  TodosActorEvent,
};
