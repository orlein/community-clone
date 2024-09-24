import { Context, Effect, Layer } from 'effect';
import { pbkdf2, randomBytes } from 'node:crypto';

class GeneratingSaltError {
  readonly _tag = 'GeneratingSaltError';
  constructor(readonly error?: string) {}
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
    ) => Effect.Effect<Buffer, Error, never>;
  }
>() {
  static getRandomSalt = function (size = 16) {
    const bufferSalt = Effect.try({
      try: () => randomBytes(size),
      catch: (error) => new GeneratingSaltError(`Error generating salt`),
    });

    const program = Effect.gen(function* () {
      const salt = yield* bufferSalt;
      return salt.toString('hex');
    });

    return program;
  };

  static hashPassword = function (password: string, salt: string) {
    const bufferHash = Effect.async<Buffer, Error>((resume) => {
      pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          return resume(Effect.fail(err));
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
