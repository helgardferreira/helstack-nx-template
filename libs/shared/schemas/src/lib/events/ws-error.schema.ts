import * as z from 'zod';

// TODO: try to implement this in gateway
export const WsErrorSchema = z.object({
  code: z.string().min(1), // e.g. 'VALIDATION', 'NOT_FOUND', etc.
  message: z.string().min(1),
});

export type WsError = z.output<typeof WsErrorSchema>;
