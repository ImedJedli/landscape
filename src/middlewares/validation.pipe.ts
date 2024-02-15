import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationPipeWithErrors extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof Array) {
        const validationErrors = error.reduce(
          (acc: any, err: ValidationError) => ({
            ...acc,
            [err.property]: Object.values(err.constraints),
          }),
          {},
        );
        throw new BadRequestException(validationErrors);
      } else {
        console.log(error)
        throw error;
      }
    }
  }
}
