import { format } from 'date-fns';
import { type Component, For, Show, createMemo } from 'solid-js';

import { type TodoActorRef, useTodos } from '../../../actors';

import { TodoListError } from './todo-list-error';
import { TodoListRow } from './todo-list-row/todo-list-row';
import { TodoListRowSkeleton } from './todo-list-row/todo-list-row.skeleton';

export const TodoList: Component = () => {
  const { draftTodoActor, isError, isLoading, todoActors } = useTodos();

  const formattedDate = createMemo(() =>
    format(new Date(), 'EEEE, dd MMMM yyyy (yyyy-MM-dd)')
  );

  return (
    <ul class="list bg-base-100 rounded-box">
      <li class="p-4 pb-2 text-xs tracking-wide opacity-60">
        {formattedDate()}
      </li>

      <Show when={!isLoading()} fallback={<TodoListRowSkeleton />}>
        <Show when={!isError()} fallback={<TodoListError />}>
          <Show when={!!draftTodoActor()}>
            <TodoListRow todoActor={draftTodoActor() as TodoActorRef} />
          </Show>
          <For each={todoActors()}>
            {(todo) => <TodoListRow todoActor={todo} />}
          </For>
        </Show>
      </Show>
    </ul>
  );
};
