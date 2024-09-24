import { AccountModel } from '@/prisma/zod';
import { z } from 'zod';

export const RegisterRequestDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterResponseDto = AccountModel.pick({
  id: true,
  plainEmail: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isToBeReset: true,
});
