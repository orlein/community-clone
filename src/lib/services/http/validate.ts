import { Effect } from 'effect';
import { z } from 'zod';

class InvalidRequestDtoError {
  readonly _tag = 'InvalidRequestDtoError';
  constructor(readonly error?: string) {}
}

export function validateRequest<T extends any = unknown>(
  schema: z.ZodType<T, any>,
  request: Request,
): Effect.Effect<T, InvalidRequestDtoError, never> {
  const program = Effect.gen(function* () {
    const body = yield* Effect.tryPromise({
      try: async () => request.json() as Promise<T>,
      catch: (error) =>
        new InvalidRequestDtoError('Error parsing request body'),
    });

    const parsedBody = schema.safeParse(body);

    if (!parsedBody.success) {
      return yield* Effect.fail(
        new InvalidRequestDtoError(parsedBody.error.message),
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
      throw new Error(parsedBody.error.message);
    }

    return parsedBody.data;
  });

  return program;
}
