import * as z from 'zod';
import {
  CompleteProfile,
  RelatedProfileModel,
  CompletePost,
  RelatedPostModel,
  CompleteVote,
  RelatedVoteModel,
  CompleteCategory,
  RelatedCategoryModel,
} from './index';

export const CommentModel = z.object({
  id: z.number().int(),
  content: z.string(),
  authorId: z.string(),
  isVisible: z.boolean(),
  postId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteComment extends z.infer<typeof CommentModel> {
  author: CompleteProfile;
  ParentPost?: CompletePost | null;
  Vote: CompleteVote[];
  Categories: CompleteCategory[];
}

/**
 * RelatedCommentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommentModel: z.ZodSchema<CompleteComment> = z.lazy(() =>
  CommentModel.extend({
    author: RelatedProfileModel,
    ParentPost: RelatedPostModel.nullish(),
    Vote: RelatedVoteModel.array(),
    Categories: RelatedCategoryModel.array(),
  }),
);
