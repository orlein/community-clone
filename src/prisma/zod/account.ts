import * as z from 'zod';
import { CompleteProfile, RelatedProfileModel } from './index';

export const AccountModel = z.object({
  id: z.string(),
  plainEmail: z.string(),
  passwordHash: z.string(),
  passwordSalt: z.string(),
  description: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  isToBeReset: z.boolean(),
});

export interface CompleteAccount extends z.infer<typeof AccountModel> {
  Profiles: CompleteProfile[];
}

/**
 * RelatedAccountModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAccountModel: z.ZodSchema<CompleteAccount> = z.lazy(() =>
  AccountModel.extend({
    Profiles: RelatedProfileModel.array(),
  }),
);
