import * as z from 'zod';
import {
  CompleteGroup,
  RelatedGroupModel,
  CompletePermission,
  RelatedPermissionModel,
} from './index';

export const RoleModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  groupId: z.string().nullish(),
  description: z.string().nullish(),
});

export interface CompleteRole extends z.infer<typeof RoleModel> {
  Group?: CompleteGroup | null;
  Permissions: CompletePermission[];
}

/**
 * RelatedRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoleModel: z.ZodSchema<CompleteRole> = z.lazy(() =>
  RoleModel.extend({
    Group: RelatedGroupModel.nullish(),
    Permissions: RelatedPermissionModel.array(),
  }),
);
