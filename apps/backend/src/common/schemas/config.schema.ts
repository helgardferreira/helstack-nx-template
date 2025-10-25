import { z } from 'zod';

import { persistenceSchema } from './persistence.schema';

/**
 * Schema for environment variables.
 *
 * This schema is used to validate the environment
 * variables used in the application.
 *
 * Example on how to extend schemas with zod:
 * ```ts
 * export const configSchema = persistenceSchema.extend(authSchema);
 * ```
 */
export const configSchema = persistenceSchema;

export type ConfigSchema = z.infer<typeof configSchema>;
