import { type Accessor, createMemo } from 'solid-js';
import * as z from 'zod';

type FieldErrors<T> = {
  [P in keyof T]?: string[];
};

export const useZodFieldErrors = <T>(
  zodError: Accessor<z.ZodError<T> | undefined>
): Accessor<FieldErrors<T>> => {
  const fieldErrors = createMemo(() => {
    const error = zodError();

    if (!error) return {};

    return z.flattenError<T>(error).fieldErrors;
  });

  return fieldErrors;
};
