import * as z from 'zod';
import {
  CompleteCommunity,
  RelatedCommunityModel,
  CompletePost,
  RelatedPostModel,
} from './index';

export const TagModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteTag extends z.infer<typeof TagModel> {
  Communities: CompleteCommunity[];
  Posts: CompletePost[];
}

/**
 * RelatedTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagModel: z.ZodSchema<CompleteTag> = z.lazy(() =>
  TagModel.extend({
    Communities: RelatedCommunityModel.array(),
    Posts: RelatedPostModel.array(),
  }),
);
