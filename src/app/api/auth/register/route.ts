import { PrismaLive, PrismaService } from '@/lib/prisma';
import { CryptoLive, CryptoService } from '@/lib/services/account/crypto';
import {
  validateRequest,
  validateResponse,
} from '@/lib/services/http/validate';
import { Effect, Layer } from 'effect';
import { RegisterRequestDto, RegisterResponseDto } from './register.dto';
import { NextResponse } from 'next/server';
import { ErrorAbstract } from '@/lib/errorts';
import { transformResponse } from '@/lib/services/http/transform';

class RegisterError extends ErrorAbstract {
  readonly _tag = 'RegisterError';
}

export async function POST(request: Request) {
  const program = Effect.gen(function* () {
    const prismaService = yield* PrismaService;
    const cryptoService = yield* CryptoService;
    const body = yield* validateRequest(RegisterRequestDto, request);

    const newSalt = yield* cryptoService.getRandomSalt(16);
    const passwordBuffer = yield* cryptoService.hashPassword(
      body.password,
      newSalt,
    );
    const hashedPassword = passwordBuffer.toString('hex');

    const newAccount = yield* Effect.tryPromise({
      try: () =>
        prismaService.account.create({
          data: {
            plainEmail: body.email,
            passwordHash: hashedPassword,
            passwordSalt: newSalt,
          },
        }),
      catch: (error) => {
        return new RegisterError('Error creating account', 409);
      },
    });

    const responseBody = yield* validateResponse(
      RegisterResponseDto,
      newAccount,
    );

    return transformResponse(responseBody);
  });

  const runnable = Effect.provide(
    program,
    Layer.merge(PrismaLive, CryptoLive),
  ).pipe(
    Effect.catchAll((error) =>
      Effect.succeed(
        transformResponse({
          error: error.errorMessage,
          status: error.status,
        }),
      ),
    ),
  );

  const response = await Effect.runPromise(runnable);
  return response;
}
