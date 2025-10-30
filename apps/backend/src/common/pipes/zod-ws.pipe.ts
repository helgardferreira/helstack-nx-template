import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as z from 'zod';

import { WsErrorSchema } from '@helstack-nx-template/schemas';

@Injectable()
export class ZodWsPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      return this.schema.decode(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new WsException(
          WsErrorSchema.encode({
            code: 'VALIDATION',
            message: z.prettifyError(error),
          })
        );
      }

      throw new WsException(
        WsErrorSchema.encode({
          code: 'VALIDATION',
          message: 'Validation failed',
        })
      );
    }
  }
}
