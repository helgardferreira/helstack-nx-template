import type { Component } from 'solid-js';

export const TodoListRowSkeleton: Component = () => {
  return (
    <li class="list-row">
      <div class="skeleton border-primary size-5 self-center rounded-lg border" />

      <div class="list-col-grow flex h-11 flex-col justify-between">
        <div class="skeleton h-5.75 w-full rounded-md" />

        <div class="skeleton h-4 w-25 rounded-sm" />
      </div>

      <div class="list-col-wrap skeleton h-20 w-full resize-none rounded-md p-0" />

      <button class="btn btn-square btn-ghost self-center" disabled>
        <span class="loading loading-spinner size-4" />
      </button>
    </li>
  );
};
