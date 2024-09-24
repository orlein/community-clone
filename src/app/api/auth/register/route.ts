import { PrismaLive, PrismaService } from '@/lib/prisma';
import { CryptoLive, CryptoService } from '@/lib/services/account/crypto';
import {
  validateRequest,
  validateResponse,
} from '@/lib/services/http/validate';
import { Effect, Layer } from 'effect';
import { RegisterRequestDto, RegisterResponseDto } from './register.dto';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
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

      const newAccount = yield* Effect.tryPromise(() =>
        prismaService.account.create({
          data: {
            plainEmail: body.email,
            passwordHash: hashedPassword,
            passwordSalt: newSalt,
          },
        }),
      );

      const responseBody = yield* validateResponse(
        RegisterResponseDto,
        newAccount,
      );

      return responseBody;
    });

    const runnable = Effect.provide(
      program,
      Layer.merge(PrismaLive, CryptoLive),
    );

    const body = await Effect.runPromise(runnable);
    return NextResponse.json(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    return NextResponse.json(e, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
