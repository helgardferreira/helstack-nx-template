import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  enqueueActions,
  sendTo,
  setup,
} from 'xstate';
import * as z from 'zod';

import type {
  CreateTodo,
  Todo,
  UpdateTodo,
} from '@helstack-nx-template/schemas';

import { toaster } from '../../../../toaster';

import { createTodoLogic } from './actors/create-todo.actor';
import { removeTodoByIdLogic } from './actors/remove-todo-by-id.actor';
import { updateTodoByIdLogic } from './actors/update-todo-by-id.actor';
import type { TodoActorContext, TodoActorEvent, TodoActorInput } from './types';

const todoMachine = setup({
  types: {
    context: {} as TodoActorContext,
    events: {} as TodoActorEvent,
    input: {} as TodoActorInput,
  },
  actors: {
    createTodo: createTodoLogic,
    removeTodoById: removeTodoByIdLogic,
    updateTodoById: updateTodoByIdLogic,
  },
  actions: {
    change: assign((_, todo: UpdateTodo) => ({ ...todo })),
    createSuccess: enqueueActions(
      ({ context, enqueue }, { todo }: { todo: Todo }) => {
        enqueue.assign({
          completed: false,
          createTodoError: undefined,
          createdAt: undefined,
          description: '',
          title: '',
          updatedAt: undefined,
        });

        enqueue.sendTo(context.parentActor, { type: 'SPAWN_CHILD', todo });
      }
    ),
    handleError: enqueueActions(
      (
        { enqueue },
        {
          error,
          method,
        }: { error: unknown; method: 'delete' | 'patch' | 'post' }
      ) => {
        switch (method) {
          case 'delete': {
            console.error(error);
            toaster.error({
              description: 'Failed to remove todo item',
              title: 'Remove Todo Error',
            });

            break;
          }
          case 'patch': {
            if (error instanceof z.ZodError) {
              enqueue.assign({
                updateTodoError: error as z.ZodError<UpdateTodo>,
              });
            } else {
              console.error(error);
              toaster.error({
                description: 'Failed to update todo item',
                title: 'Update Todo Error',
              });
            }

            break;
          }
          case 'post': {
            if (error instanceof z.ZodError) {
              enqueue.assign({
                createTodoError: error as z.ZodError<CreateTodo>,
              });
            } else {
              console.error(error);
              toaster.error({
                description: 'Failed to create new todo item',
                title: 'Create Todo Error',
              });
            }

            break;
          }
        }
      }
    ),
    removeFromParent: sendTo(
      ({ context }) => context.parentActor,
      ({ self }) => ({ type: 'REMOVE_CHILD', id: self.id })
    ),
    resetErrors: assign({
      createTodoError: undefined,
      updateTodoError: undefined,
    }),
    updateSuccess: assign((_, { todo }: { todo: Todo }) => ({
      ...todo,
      updateTodoError: undefined,
    })),
  },
  guards: {
    isCreated: ({ context }) => context.createdAt !== undefined,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FUDoCGBjZAlgG5iYEQA2YAxAMIASAggHIDiAogNoAMAuoqAAOqWAUKoAdgJAAPRAA55AVkwAWAGwBOTQHZlS9QEYATPIA0IAJ6IAzDpuZNqw5qXzjNg9yW6Avr4s0DBx8YlJyKmoAJXYAWQB5ADUuPmlhUXEpJFlEQ25DHUwlbh0dEx1VeW5VYyULawQjeUx1VR11JVVuZXlVTUN-QPQsPEISMkoaAGVGZJ5+bPSxAklpOQQ8gqKSsuMKqpq6q0Q29SLKnW7DG24bVSUKwZAgkdDxgCcwAFtUIgIJKDUDAScISIioADWpE+PxIABVhgAhSwASQg8zSImWq2y60M6g8mF2Ji6pn25mOCAMqkcyhsNhM6nU3FuNieLxCY2h31+-0BYHe71Q70wggo2GQADNhV9MDDfmAERhkWiMYssZk1rl8oViqVypVqrV6oglMYznYasZuMzrTbVOzhpywpgAK6CCASvnUAVCkViiXS96y92e5CKpGo9GpdUZFZZUB4-KaRyHeT4sryek2E0IGy9TB7M0VVodW6GB0BZ5O0Yu0NegHUACqAAUACKMOHsAD6UybtFo7CmUzVQg18a1G24eyKmg8xg8SkMhnTFIaphTLO8xRM2lLjuCEHe2ElyGoo5AS01uMQZTObX6y9Uz8uxkMub2NLut006h0xUOdQDywI8T2QCZIgYFgOAvK8JxvKlWjUZw7B0Wo9nkdoPx8TBemMbRl3pfFn2AzBQNPCDplmFIFjHOMcUTE4HkcdozScOdCPUXMXEKNol3uOw9nULMdFI8jwNwT4G35QVhVFcUpRlTBJLACUIwwWDxwYnI8xwxRnB49MWRqVQPzaTAbhtB5emffDbjE48KJU6S6BiTsez7AchxHGM6OxBMdM8FN9OXXQjKNUzKXpFMHi6fobFMPYCn8KsJHQOBpBeTF6IC9YAFpjEihoCsrIZglrEhsv8ycRLULQwqUAwTDXRBrUMFpSmE-o0IZJd5FIirwkmKrr0YhBNGqFofEOGwtD-bRczaGk3yZdx-zfZ9Surcq3m5WE+RG+CxpMfNMBtPItCUfNGs0XNOm4Qs7E0IjmUfAbdrdD1pMO7S8Q8ZpzptVxrp8XMGXa7x0xqP9qQmraOXEn7ctaorcjyTBDDNUxn0x5d5CcBywMopHJzcBx1BudwuiZaLUbzZkMYKMpYdfTRCacqTCABEmELQszjCJUp5GE8H3CXUj5RICAebGh5cwmlM2gZJlGv-bhtBS3wgA */
  id: 'todo',
  context: ({ input: { todo, parentActor } }) => ({
    completed: todo.completed ?? false,
    createdAt: todo.createdAt,
    description: todo.description ?? '',
    id: todo.id,
    parentActor,
    title: todo.title ?? '',
    updatedAt: todo.updatedAt,
  }),
  initial: 'draft',
  exit: 'removeFromParent',

  states: {
    active: {
      initial: 'idle',

      states: {
        idle: {
          on: {
            CHANGE: {
              actions: {
                params: ({ event: { type: _, ...todo } }) => todo,
                type: 'change',
              },
            },

            REMOVE: 'removing',

            SAVE: {
              actions: 'resetErrors',
              target: 'updating',
            },
          },
        },

        removing: {
          invoke: {
            id: 'removeTodoById',
            input: ({ context }) => {
              if (context.id === undefined) throw new Error();

              return { id: context.id };
            },
            onDone: '#todo.removed',
            onError: {
              actions: {
                params: ({ event }) => ({
                  error: event.error,
                  method: 'delete',
                }),
                type: 'handleError',
              },
              target: 'idle',
            },
            src: 'removeTodoById',
          },
        },

        updating: {
          invoke: {
            id: 'updateTodoById',
            input: ({ context }) => {
              if (context.id === undefined) throw new Error();

              const { completed, description, title } = context;

              return {
                id: context.id,
                todo: { completed, description, title },
              };
            },
            onError: {
              actions: {
                params: ({ event }) => ({
                  error: event.error,
                  method: 'patch',
                }),
                type: 'handleError',
              },
              target: 'idle',
            },
            src: 'updateTodoById',
          },
          on: {
            UPDATE_SUCCESS: {
              actions: {
                params: ({ event }) => ({ todo: event.todo }),
                type: 'updateSuccess',
              },
              target: 'idle',
            },
          },
        },
      },
    },

    draft: {
      always: {
        target: 'active',
        guard: 'isCreated',
      },

      states: {
        idle: {
          on: {
            CHANGE: {
              target: 'idle',
              actions: {
                params: ({ event: { type: _, ...todo } }) => todo,
                type: 'change',
              },
            },

            SAVE: {
              actions: 'resetErrors',
              target: 'creating',
            },
          },
        },

        creating: {
          invoke: {
            id: 'createTodo',

            input: ({ context }) => {
              const { description, title } = context;

              if (description === null) throw new Error();

              return { todo: { description, title } };
            },

            src: 'createTodo',

            onError: {
              actions: {
                params: ({ event }) => ({
                  error: event.error,
                  method: 'post',
                }),
                type: 'handleError',
              },
              target: 'idle',
            },
          },

          on: {
            CREATE_SUCCESS: {
              actions: {
                params: ({ event }) => ({ todo: event.todo }),
                type: 'createSuccess',
              },
              target: 'idle',
            },
          },
        },
      },

      initial: 'idle',
    },

    removed: {
      type: 'final',
    },
  },
});

type TodoActorRef = ActorRefFrom<typeof todoMachine>;
type TodoActorSnapshot = SnapshotFrom<typeof todoMachine>;

export { todoMachine };

export type { TodoActorRef, TodoActorSnapshot };
