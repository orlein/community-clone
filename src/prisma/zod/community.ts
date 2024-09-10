import * as z from 'zod';
import {
  CompleteGroup,
  RelatedGroupModel,
  CompletePost,
  RelatedPostModel,
  CompleteTag,
  RelatedTagModel,
} from './index';

export const CommunityModel = z.object({
  id: z.string(),
  name: z.string(),
  coverImgUrl: z.string().nullish(),
  description: z.string().nullish(),
  announcement: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteCommunity extends z.infer<typeof CommunityModel> {
  Groups: CompleteGroup[];
  Posts: CompletePost[];
  Tags: CompleteTag[];
}

/**
 * RelatedCommunityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommunityModel: z.ZodSchema<CompleteCommunity> = z.lazy(
  () =>
    CommunityModel.extend({
      Groups: RelatedGroupModel.array(),
      Posts: RelatedPostModel.array(),
      Tags: RelatedTagModel.array(),
    }),
);
