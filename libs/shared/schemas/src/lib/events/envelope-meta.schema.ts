import * as z from 'zod';

import { epochMillisToDate } from '../utils/codecs/index.js';

export const EnvelopeMetaSchema = z.object({
  /**
   * Correlate request/response
   */
  corr: z.string().min(6).max(100).optional(),
  /**
   * Sent time on sender's clock—server can set on outbound
   */
  ts: epochMillisToDate.optional(),
});

export type EnvelopeMeta = z.output<typeof EnvelopeMetaSchema>;
