import * as z from 'zod';
import {
  CompleteComment,
  RelatedCommentModel,
  CompletePost,
  RelatedPostModel,
  CompleteProfile,
  RelatedProfileModel,
} from './index';

export const VoteModel = z.object({
  id: z.string(),
  isUpvote: z.boolean(),
  profileId: z.string(),
  targetPostId: z.string(),
  targetCommentId: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteVote extends z.infer<typeof VoteModel> {
  TargetComment?: CompleteComment | null;
  TargetPost?: CompletePost | null;
  Voter: CompleteProfile;
}

/**
 * RelatedVoteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedVoteModel: z.ZodSchema<CompleteVote> = z.lazy(() =>
  VoteModel.extend({
    TargetComment: RelatedCommentModel.nullish(),
    TargetPost: RelatedPostModel.nullish(),
    Voter: RelatedProfileModel,
  }),
);
