import * as z from 'zod';
import {
  CompleteComment,
  RelatedCommentModel,
  CompletePost,
  RelatedPostModel,
} from './index';

export const CategoryModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteCategory extends z.infer<typeof CategoryModel> {
  Comments: CompleteComment[];
  Posts: CompletePost[];
}

/**
 * RelatedCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategoryModel: z.ZodSchema<CompleteCategory> = z.lazy(() =>
  CategoryModel.extend({
    Comments: RelatedCommentModel.array(),
    Posts: RelatedPostModel.array(),
  }),
);
