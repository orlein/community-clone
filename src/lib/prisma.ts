import { PrismaClient } from '@prisma/client';
import { Context, Effect, Layer } from 'effect';

declare global {
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;

export class PrismaService extends Context.Tag('PrismaService')<
  PrismaService,
  PrismaClient
>() {}

export const PrismaLive = Layer.effect(
  PrismaService,
  Effect.sync(() => {
    if (global.prisma) {
      return global.prisma;
    }
    const client = new PrismaClient();
    return client;
  }),
);
