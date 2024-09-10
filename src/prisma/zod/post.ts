import * as z from 'zod';
import {
  CompleteComment,
  RelatedCommentModel,
  CompleteProfile,
  RelatedProfileModel,
  CompleteCommunity,
  RelatedCommunityModel,
  CompleteVote,
  RelatedVoteModel,
  CompleteCategory,
  RelatedCategoryModel,
  CompleteTag,
  RelatedTagModel,
} from './index';

export const PostModel = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  isCommentable: z.boolean(),
  isVisible: z.boolean(),
  authorId: z.string(),
  communityId: z.string().nullish(),
  categoryId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  type: z.string(),
});

export interface CompletePost extends z.infer<typeof PostModel> {
  ChildrenComments: CompleteComment[];
  Author: CompleteProfile;
  Community?: CompleteCommunity | null;
  Vote: CompleteVote[];
  Categories: CompleteCategory[];
  Tags: CompleteTag[];
}

/**
 * RelatedPostModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPostModel: z.ZodSchema<CompletePost> = z.lazy(() =>
  PostModel.extend({
    ChildrenComments: RelatedCommentModel.array(),
    Author: RelatedProfileModel,
    Community: RelatedCommunityModel.nullish(),
    Vote: RelatedVoteModel.array(),
    Categories: RelatedCategoryModel.array(),
    Tags: RelatedTagModel.array(),
  }),
);
