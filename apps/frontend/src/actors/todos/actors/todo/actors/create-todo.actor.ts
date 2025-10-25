import { from, map } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@helstack-nx-template/actors';
import { type CreateTodo, createTodo } from '@helstack-nx-template/schemas';

import type { TodoActorEvent } from '../types';

type CreateTodoInput = {
  todo: CreateTodo;
};

const fromCreateTodo: EventObservableCreator<
  TodoActorEvent,
  CreateTodoInput
> = ({ input }) =>
  from(createTodo(input.todo)).pipe(
    map((todo) => ({ type: 'CREATE_SUCCESS', todo }))
  );

export const createTodoLogic = fromEventObservable(fromCreateTodo);

export type CreateTodoActorRef = ActorRefFrom<typeof createTodoLogic>;
