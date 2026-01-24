// ! src/utils/validate.request.ts

import Joi from 'joi';
import type{ Request } from 'express';
import { ApiError } from './ApiError';
import { HTTP_STATUS } from '../common/http-status';

type Source = 'body' | 'params' | 'query';

export function validate<T = unknown>(
  schema: Joi.ObjectSchema,
  req: Request,
  sources: Source[] = ['body'],           // default to body only
  options: Joi.ValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
    errors: { label: 'key' },
  }
): T {
  // ! Merge data from requested sources
  const data = sources.reduce((acc, source) => {
    return { ...acc, ...req[source] };
  }, {} as Record<string, any>);

  const { error, value } = schema.validate(data, options);

  if (error) {
    const message = error.details
      .map(d => d.message)
      .join(', ') || 'Validation failed';

    throw new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  return value as T;
}