import { ErrorAbstract } from '@/lib/errorts';
import { Context, Effect, Layer } from 'effect';
import { pbkdf2, randomBytes } from 'node:crypto';

class GeneratingSaltError extends ErrorAbstract {
  readonly _tag = 'GeneratingSaltError';
}

class HashingError extends ErrorAbstract {
  readonly _tag = 'HashingError';
}

export class CryptoService extends Context.Tag('CryptoService')<
  CryptoService,
  {
    getRandomSalt: (
      size: number,
    ) => Effect.Effect<string, GeneratingSaltError, never>;
    hashPassword: (
      password: string,
      salt: string,
    ) => Effect.Effect<Buffer, HashingError, never>;
  }
>() {
  static getRandomSalt = function (size = 16) {
    const bufferSalt = Effect.try({
      try: () => randomBytes(size),
      catch: (error) => new GeneratingSaltError(`Error generating salt`, 500),
    });

    const program = Effect.gen(function* () {
      const salt = yield* bufferSalt;
      return salt.toString('hex');
    });

    return program;
  };

  static hashPassword = function (password: string, salt: string) {
    const bufferHash = Effect.async<Buffer, HashingError>((resume) => {
      pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          return resume(
            Effect.fail(new HashingError(`Error hashing password`, 500)),
          );
        }

        resume(Effect.succeed(derivedKey));
      });
    });

    const program = Effect.gen(function* () {
      const hash = yield* bufferHash;
      return hash;
    });

    return program;
  };
}

export const CryptoLive = Layer.effect(
  CryptoService,
  Effect.sync(() => ({
    getRandomSalt: CryptoService.getRandomSalt,
    hashPassword: CryptoService.hashPassword,
  })),
);
