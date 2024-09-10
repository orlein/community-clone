import * as z from 'zod';
import { CompleteRole, RelatedRoleModel } from './index';

export const PermissionModel = z.object({
  id: z.string(),
  targetUri: z.string(),
  create: z.boolean(),
  read: z.boolean(),
  update: z.boolean(),
  delete: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompletePermission extends z.infer<typeof PermissionModel> {
  Roles: CompleteRole[];
}

/**
 * RelatedPermissionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPermissionModel: z.ZodSchema<CompletePermission> = z.lazy(
  () =>
    PermissionModel.extend({
      Roles: RelatedRoleModel.array(),
    }),
);
