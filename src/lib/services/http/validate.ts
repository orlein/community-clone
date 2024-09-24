import { ErrorAbstract } from '@/lib/errorts';
import { Effect } from 'effect';
import { z } from 'zod';

class InvalidRequestDtoError extends ErrorAbstract {
  readonly _tag = 'InvalidRequestDtoError';
}

class InvalidResponseDtoError extends ErrorAbstract {
  readonly _tag = 'InvalidResponseDtoError';
}

export function validateRequest<T extends any = unknown>(
  schema: z.ZodType<T, any>,
  request: Request,
): Effect.Effect<T, InvalidRequestDtoError, never> {
  const program = Effect.gen(function* () {
    const body = yield* Effect.tryPromise({
      try: async () => request.json() as Promise<T>,
      catch: (error) =>
        new InvalidRequestDtoError('Error parsing request body', 400),
    });

    const parsedBody = schema.safeParse(body);

    if (!parsedBody.success) {
      return yield* Effect.fail(
        new InvalidRequestDtoError(parsedBody.error.message, 400),
      );
    }

    return parsedBody.data;
  });

  return program;
}

export function validateResponse<T extends any = unknown>(
  schema: z.ZodType<T, any>,
  body: any,
) {
  const program = Effect.gen(function* () {
    const parsedBody = schema.safeParse(body);

    if (!parsedBody.success) {
      return yield* Effect.fail(
        new InvalidResponseDtoError(parsedBody.error.message, 500),
      );
    }

    return parsedBody.data;
  });

  return program;
}
