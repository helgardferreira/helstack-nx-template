import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  enqueueActions,
  setup,
} from 'xstate';

import type { Todo } from '@helstack-nx-template/schemas';

import { toaster } from '../../toaster';

import { findAllTodosLogic } from './actors/find-all-todos.actor';
import { todoMachine } from './actors/todo/todo.machine';
import type { TodosActorContext, TodosActorEvent } from './types';

const todosMachine = setup({
  types: {
    context: {} as TodosActorContext,
    events: {} as TodosActorEvent,
  },
  actors: {
    findAllTodos: findAllTodosLogic,
    todoActor: todoMachine,
  },
  actions: {
    loadTodos: assign(({ self, spawn }, { todos }: { todos: Todo[] }) => ({
      todoActors: todos.map((todo) =>
        spawn('todoActor', {
          id: todo.id,
          input: { parentActor: self, todo },
        })
      ),
    })),
    handleError: enqueueActions((_, { error }: { error: unknown }) => {
      console.error(error);
      toaster.error({
        description: 'Failed to find all todo items',
        title: 'Find All Todos Error',
      });
    }),
    removeChildTodo: enqueueActions(
      ({ context, enqueue }, { id }: { id: string }) => {
        enqueue.stopChild(id);
        enqueue.assign({
          todoActors: context.todoActors.filter((todo) => todo.id !== id),
        });
      }
    ),
    spawnChildTodo: assign(
      ({ context, self, spawn }, { todo }: { todo: Todo }) => ({
        todoActors: [
          spawn('todoActor', {
            id: todo.id,
            input: { parentActor: self, todo },
          }),
        ].concat(context.todoActors),
      })
    ),
    spawnDraftTodo: assign(({ self, spawn }) => ({
      draftTodoActor: spawn('todoActor', {
        id: 'draftTodo',
        input: { parentActor: self, todo: {} },
      }),
    })),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FWwMQGUAKAggOoByA+gMIASAkgDIAiA2gAwC6ioADpgJbK9UAO04gAHogBMANmkA6AIwKALAFZpADgCcy5Sw1KANCACeiBSwDscyZeWWAzJdVPlDrRoC+n42gzYAJQBRAFkAeQA1IMpaRlYOJBAeWH5BEUSJBBkHOVkHd21pfVVVDQdjMwQFSW9fdEw5ABtUAEMIXiEoLDAAJx7UHrkuRpbkADMBgFs5MY6IAkbGgBV62HjRZNThUUyHUrktFRZXBS1LQ61VCsRlTTkNFkljhVVJEpkvHxA-Bua2jq6dDCBAYZBwAFUKBQgjgcOtEpsBNsMog9hoDkcTmcLldTKjJDlLCwFA8tA5bAppApnLVvqs5L1+j0sMElgEAJrw7h8JHpUCZNwKXIsMmlSRkrQU8p4hDKEkHSzSVS3DTSW7E6TeL5CdBwUQ-eAInlpHaIAC0CmuVW0cmVOmcVmUGnOmq+BoZfQGG2NyP5iGVkltHjJLCdkj0lkkVuUthsMgsIssLw0knDtPdf3anW9KV5ptllitDjUcmcOl0ioe2hqbvpsAArgBjRtwQ3c3MmlEIANB7QOUMpiNRmXF+SqHQOFO2XQaNQOLWeIA */
  id: 'todos',

  context: {
    draftTodoActor: undefined,
    todoActors: [],
  },
  entry: 'spawnDraftTodo',
  initial: 'loading',
  on: {
    SPAWN_CHILD: {
      actions: {
        params: ({ event }) => ({ todo: event.todo }),
        type: 'spawnChildTodo',
      },
    },

    REMOVE_CHILD: {
      actions: {
        params: ({ event }) => ({ id: event.id }),
        type: 'removeChildTodo',
      },
    },
  },

  states: {
    error: {
      on: {
        RETRY: 'loading',
      },
    },

    loading: {
      invoke: {
        id: 'findAllTodos',
        src: 'findAllTodos',
        onError: {
          actions: {
            params: ({ event }) => ({ error: event.error }),
            type: 'handleError',
          },
          target: 'error',
        },
      },
      on: {
        LOAD_SUCCESS: {
          actions: {
            params: ({ event }) => ({ todos: event.todos }),
            type: 'loadTodos',
          },
          target: 'success',
        },
      },
    },

    success: {},
  },
});

type TodosActorRef = ActorRefFrom<typeof todosMachine>;
type TodosActorSnapshot = SnapshotFrom<typeof todosMachine>;

export { todosMachine };

export type { TodosActorRef, TodosActorSnapshot };
