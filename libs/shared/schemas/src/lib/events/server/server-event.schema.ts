/**
 * Server -> Client messages (what the backend sends)
 */
import * as z from 'zod';

import { TodoSchema, UpdateTodoSchema } from '../../todos/todo.schema.js';
import { epochMillisToDate } from '../../utils/codecs/index.js';
import { EnvelopeMetaSchema } from '../envelope-meta.schema.js';
import { WsErrorSchema } from '../ws-error.schema.js';

// TODO: use this in return statement for `@SubscribeMessage` in `EventsGateway`
const ServerAckSchema = z.object({
  type: z.literal('ack'),
  id: z.uuid(),
  corr: z.string().min(6).max(100).optional(),
  ok: z.literal(true),
});

const ServerErrorSchema = z.object({
  type: z.literal('error'),
  error: WsErrorSchema,
  // TODO: maybe remove this?
  // corr: z.string().min(6).max(100).optional(),
});

const ServerTodosCreatedSchema = z.object({
  type: z.literal('todos.created'),
  item: TodoSchema,
});

const ServerTodosDeletedSchema = z.object({
  type: z.literal('todos.deleted'),
  id: z.uuid(),
});

const ServerTodosPatchedSchema = z.object({
  type: z.literal('todos.patched'),
  id: z.uuid(),
  changes: UpdateTodoSchema,
  updatedAt: epochMillisToDate,
});

// TODO: implement this as initial state when (re)subscribing
const ServerTodosSnapshotSchema = z.object({
  type: z.literal('todos.snapshot'),
  items: z.array(TodoSchema),
});

const ServerMessageSchema = z
  .object({ meta: EnvelopeMetaSchema.optional() })
  .and(
    z.discriminatedUnion('type', [
      ServerAckSchema,
      ServerErrorSchema,
      ServerTodosCreatedSchema,
      ServerTodosDeletedSchema,
      ServerTodosPatchedSchema,
      ServerTodosSnapshotSchema,
    ])
  );

export {
  ServerAckSchema,
  ServerErrorSchema,
  ServerMessageSchema,
  ServerTodosCreatedSchema,
  ServerTodosDeletedSchema,
  ServerTodosPatchedSchema,
  ServerTodosSnapshotSchema,
};

type ServerAck = z.output<typeof ServerAckSchema>;
type ServerError = z.output<typeof ServerErrorSchema>;
type ServerMessage = z.output<typeof ServerMessageSchema>;
type ServerTodosCreated = z.output<typeof ServerTodosCreatedSchema>;
type ServerTodosDeleted = z.output<typeof ServerTodosDeletedSchema>;
type ServerTodosPatched = z.output<typeof ServerTodosPatchedSchema>;
type ServerTodosSnapshot = z.output<typeof ServerTodosSnapshotSchema>;

export type {
  ServerAck,
  ServerError,
  ServerMessage,
  ServerTodosCreated,
  ServerTodosDeleted,
  ServerTodosPatched,
  ServerTodosSnapshot,
};
