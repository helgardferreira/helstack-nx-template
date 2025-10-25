import { z } from 'zod';

export const epochMillisToDate = z.codec(
  z.union([z.string().regex(z.regexes.integer), z.int().min(0)]),
  z.date(),
  {
    decode: (millis) =>
      new Date(typeof millis === 'string' ? Number(millis) : millis),
    encode: (date) => date.getTime(),
  }
);
