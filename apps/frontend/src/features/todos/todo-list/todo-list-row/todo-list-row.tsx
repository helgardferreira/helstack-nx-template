import { SaveIcon, Trash2Icon } from 'lucide-solid';
import { type Component, Show } from 'solid-js';

import type { TodoActorRef } from '../../../../actors';
import { TooltipErrors } from '../../../../components';

import { useTodoListRow } from './use-todo-list-row';

type TodoListRowProps = {
  todoActor: TodoActorRef;
};

export const TodoListRow: Component<TodoListRowProps> = (props) => {
  const {
    completed,
    createTodoErrors,
    description,
    formattedCreatedAt,
    handleCompleteChange,
    handleDescriptionChange,
    handleTitleChange,
    isCreating,
    isDisabled,
    isDraft,
    isRemoving,
    isUpdating,
    remove,
    save,
    title,
    updateTodoErrors,
    // eslint-disable-next-line solid/reactivity
  } = useTodoListRow(props.todoActor);

  return (
    <li class="list-row">
      <Show when={!isDraft()} fallback={<div class="size-5" />}>
        <Show
          when={!isUpdating()}
          fallback={
            <div class="skeleton border-primary size-5 self-center rounded-lg border" />
          }
        >
          <TooltipErrors
            class="self-center"
            errors={updateTodoErrors().completed}
          >
            <input
              checked={completed()}
              class="checkbox checkbox-sm checkbox-primary"
              classList={{ 'border-error': !!updateTodoErrors().completed }}
              disabled={isDisabled()}
              name="completed"
              onChange={handleCompleteChange}
              type="checkbox"
            />
          </TooltipErrors>
        </Show>
      </Show>

      <div class="list-col-grow flex h-11 flex-col justify-between">
        <TooltipErrors
          errors={createTodoErrors().title || updateTodoErrors().title}
        >
          <input
            class="input input-md input-ghost h-fit w-full p-0"
            classList={{
              'border-error':
                !!createTodoErrors().title || !!updateTodoErrors().title,
            }}
            disabled={isDisabled()}
            name="title"
            onChange={handleTitleChange}
            placeholder="New todo"
            type="text"
            value={title()}
          />
        </TooltipErrors>

        <Show when={!isDraft()}>
          <div class="pl-px text-xs font-semibold opacity-60">
            {formattedCreatedAt()}
          </div>
        </Show>
      </div>

      <TooltipErrors
        class="list-col-wrap"
        errors={
          createTodoErrors().description || updateTodoErrors().description
        }
      >
        <textarea
          class="textarea textarea-ghost textarea-sm w-full resize-none p-0"
          classList={{
            'border-error':
              !!createTodoErrors().description ||
              !!updateTodoErrors().description,
          }}
          disabled={isDisabled()}
          name="description"
          onChange={handleDescriptionChange}
          placeholder="Todo description"
          value={description()}
        />
      </TooltipErrors>

      <div class="flex space-x-2">
        <Show
          when={!isDraft()}
          fallback={
            <button
              class="btn btn-square btn-ghost self-center"
              disabled={isDisabled()}
              onClick={save}
            >
              <Show
                when={!isCreating()}
                fallback={<span class="loading loading-spinner size-4" />}
              >
                <SaveIcon class="size-4" />
              </Show>
            </button>
          }
        >
          <button
            class="btn btn-square btn-ghost self-center"
            disabled={isDisabled()}
            onClick={save}
          >
            <Show
              when={!isUpdating()}
              fallback={<span class="loading loading-spinner size-4" />}
            >
              <SaveIcon class="size-4" />
            </Show>
          </button>

          <button
            class="btn btn-square btn-ghost self-center"
            disabled={isDisabled()}
            onClick={remove}
          >
            <Show when={isRemoving()} fallback={<Trash2Icon class="size-4" />}>
              <span class="loading loading-spinner size-4" />
            </Show>
          </button>
        </Show>
      </div>
    </li>
  );
};
