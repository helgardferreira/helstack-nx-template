/**
 * Client -> Server messages (what the frontend sends).
 */
import * as z from 'zod';

import { CreateTodoSchema, UpdateTodoSchema } from '../../todos/todo.schema.js';
import { EnvelopeMetaSchema } from '../envelope-meta.schema.js';

const ClientTodosCreateSchema = z.object({
  type: z.literal('TODOS.CREATE'),
  payload: CreateTodoSchema,
});

const ClientTodosDeleteSchema = z.object({
  type: z.literal('TODOS.DELETE'),
  id: z.uuid(),
});

const ClientTodosSubscribeSchema = z.object({
  type: z.literal('TODOS.SUBSCRIBE'),
});

const ClientTodosToggleSchema = z.object({
  type: z.literal('TODOS.TOGGLE'),
  id: z.uuid(),
  completed: z.boolean(),
});

const ClientTodosUnsubscribeSchema = z.object({
  type: z.literal('TODOS.UNSUBSCRIBE'),
});

const ClientTodosUpdateSchema = z.object({
  type: z.literal('TODOS.UPDATE'),
  id: z.uuid(),
  patch: UpdateTodoSchema,
});

const ClientMessageSchema = z
  .object({ meta: EnvelopeMetaSchema.optional() })
  .and(
    z.discriminatedUnion('type', [
      ClientTodosCreateSchema,
      ClientTodosDeleteSchema,
      ClientTodosSubscribeSchema,
      ClientTodosToggleSchema,
      ClientTodosUnsubscribeSchema,
      ClientTodosUpdateSchema,
    ])
  );

export {
  ClientMessageSchema,
  ClientTodosCreateSchema,
  ClientTodosDeleteSchema,
  ClientTodosSubscribeSchema,
  ClientTodosToggleSchema,
  ClientTodosUnsubscribeSchema,
  ClientTodosUpdateSchema,
};

type ClientMessage = z.output<typeof ClientMessageSchema>;
type ClientTodosCreate = z.output<typeof ClientTodosCreateSchema>;
type ClientTodosDelete = z.output<typeof ClientTodosDeleteSchema>;
type ClientTodosSubscribe = z.output<typeof ClientTodosSubscribeSchema>;
type ClientTodosToggle = z.output<typeof ClientTodosToggleSchema>;
type ClientTodosUnsubscribe = z.output<typeof ClientTodosUnsubscribeSchema>;
type ClientTodosUpdate = z.output<typeof ClientTodosUpdateSchema>;

export type {
  ClientMessage,
  ClientTodosCreate,
  ClientTodosDelete,
  ClientTodosSubscribe,
  ClientTodosToggle,
  ClientTodosUnsubscribe,
  ClientTodosUpdate,
};
