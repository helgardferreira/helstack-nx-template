import type { ActorRef, Snapshot } from 'xstate';
import type { ZodError } from 'zod';

import type {
  CreateTodo,
  Todo,
  UpdateTodo,
} from '@helstack-nx-template/schemas';

type ParentActor = ActorRef<
  Snapshot<unknown>,
  { type: 'REMOVE_CHILD'; id: string } | { type: 'SPAWN_CHILD'; todo: Todo }
>;

type TodoActorContext = Omit<Todo, 'createdAt' | 'id' | 'updatedAt'> &
  Partial<Pick<Todo, 'createdAt' | 'id' | 'updatedAt'>> & {
    createTodoError?: ZodError<CreateTodo>;
    parentActor: ParentActor;
    updateTodoError?: ZodError<UpdateTodo>;
  };

type TodoActorInput = {
  parentActor: ParentActor;
  todo: Partial<Todo>;
};

type ChangeEvent = {
  type: 'CHANGE';
} & UpdateTodo;

type CreateSuccessEvent = {
  type: 'CREATE_SUCCESS';
  todo: Todo;
};

type RemoveEvent = {
  type: 'REMOVE';
};

type SaveEvent = {
  type: 'SAVE';
};

type UpdateSuccessEvent = {
  type: 'UPDATE_SUCCESS';
  todo: Todo;
};

type TodoActorEvent =
  | ChangeEvent
  | CreateSuccessEvent
  | RemoveEvent
  | SaveEvent
  | UpdateSuccessEvent;

export type {
  ChangeEvent,
  CreateSuccessEvent,
  RemoveEvent,
  SaveEvent,
  TodoActorContext,
  TodoActorEvent,
  TodoActorInput,
  UpdateSuccessEvent,
};
