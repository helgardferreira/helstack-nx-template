import type { Component } from 'solid-js';

import { TodosProvider } from '../../actors';
import { Toaster } from '../../components';
import { toaster } from '../../toaster';

import { TodoList } from './todo-list/todo-list';

export const Todos: Component = () => {
  return (
    <>
      <TodosProvider>
        <div class="preview grid h-screen w-screen place-items-center overflow-y-auto p-8">
          <div class="card bg-base-100 container shadow-lg">
            <div class="card-body">
              <TodoList />
            </div>
          </div>
        </div>
      </TodosProvider>

      <Toaster toaster={toaster} />
    </>
  );
};
