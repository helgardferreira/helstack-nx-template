import {
  type Accessor,
  type Component,
  type ParentProps,
  createContext,
} from 'solid-js';

import {
  useActor,
  useMatches,
  useSelector,
} from '@helstack-nx-template/solid-xstate';

import type { TodoActorRef } from './actors/todo/todo.machine';
import { type TodosActorRef, todosMachine } from './todos.machine';

export type TodosContextValue = {
  draftTodoActor: Accessor<TodoActorRef | undefined>;
  isError: Accessor<boolean>;
  isLoading: Accessor<boolean>;
  retry: () => void;
  todoActors: Accessor<TodoActorRef[]>;
  todosActor: TodosActorRef;
};

export const TodosContext = createContext<TodosContextValue>();

export const TodosProvider: Component<ParentProps> = (props) => {
  const todosActor = useActor(todosMachine);

  const draftTodoActor = useSelector(
    todosActor,
    ({ context }) => context.draftTodoActor
  );
  const todoActors = useSelector(
    todosActor,
    ({ context }) => context.todoActors
  );

  const isError = useMatches(todosActor, 'error');
  const isLoading = useMatches(todosActor, 'loading');

  const retry = () => todosActor.send({ type: 'RETRY' });

  return (
    <TodosContext.Provider
      value={{
        draftTodoActor,
        isError,
        isLoading,
        retry,
        todoActors,
        todosActor,
      }}
    >
      {props.children}
    </TodosContext.Provider>
  );
};
