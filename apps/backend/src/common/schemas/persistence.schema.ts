import { z } from 'zod';

/**
 * Schema for the persistence configuration.
 *
 * This schema is used to validate the persistence
 * configuration used in the application.
 */
export const persistenceSchema = z.object({});

export type PersistenceSchema = z.infer<typeof persistenceSchema>;
