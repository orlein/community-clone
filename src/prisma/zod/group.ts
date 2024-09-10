import * as z from 'zod';
import {
  CompleteCommunity,
  RelatedCommunityModel,
  CompleteRole,
  RelatedRoleModel,
  CompleteProfile,
  RelatedProfileModel,
} from './index';

export const GroupModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  communityId: z.string().nullish(),
  isSystem: z.boolean(),
});

export interface CompleteGroup extends z.infer<typeof GroupModel> {
  Community?: CompleteCommunity | null;
  Roles: CompleteRole[];
  Profiles: CompleteProfile[];
}

/**
 * RelatedGroupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGroupModel: z.ZodSchema<CompleteGroup> = z.lazy(() =>
  GroupModel.extend({
    Community: RelatedCommunityModel.nullish(),
    Roles: RelatedRoleModel.array(),
    Profiles: RelatedProfileModel.array(),
  }),
);
