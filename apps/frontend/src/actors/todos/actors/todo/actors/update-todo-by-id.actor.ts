import { from, map } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@helstack-nx-template/actors';
import { type UpdateTodo, updateTodoById } from '@helstack-nx-template/schemas';

import type { TodoActorEvent } from '../types';

type UpdateTodoByIdInput = {
  id: string;
  todo: UpdateTodo;
};

const fromUpdateTodoById: EventObservableCreator<
  TodoActorEvent,
  UpdateTodoByIdInput
> = ({ input }) =>
  from(updateTodoById(input.id, input.todo)).pipe(
    map((todo) => ({ type: 'UPDATE_SUCCESS', todo }))
  );

export const updateTodoByIdLogic = fromEventObservable(fromUpdateTodoById);

export type UpdateTodoByIdActorRef = ActorRefFrom<typeof updateTodoByIdLogic>;
