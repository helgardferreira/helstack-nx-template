import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      return this.schema.decode(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException('Validation failed', {
          cause: error,
          description: z.prettifyError(error),
        });
      }

      throw new BadRequestException('Validation failed', { cause: error });
    }
  }
}
