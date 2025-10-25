import { RotateCcwIcon } from 'lucide-solid';
import type { Component } from 'solid-js';

import { useTodos } from '../../../actors';

export const TodoListError: Component = () => {
  const { retry } = useTodos();

  return (
    <div class="bg-base-200 text-error relative m-4 grid h-35 place-content-center place-items-center rounded-md outline-2 outline-offset-2 outline-red-500 outline-dashed">
      <h1 class="font-mono text-2xl leading-loose font-medium tracking-wider">
        Find All Todos Error
      </h1>
      <p class="font-mono">Failed to find all todo items</p>

      <button
        class="btn btn-circle btn-sm btn-error absolute top-4 right-4"
        onClick={retry}
      >
        <RotateCcwIcon class="size-4" />
      </button>
    </div>
  );
};
