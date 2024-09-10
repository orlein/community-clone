import * as z from 'zod';
import {
  CompleteComment,
  RelatedCommentModel,
  CompleteNotification,
  RelatedNotificationModel,
  CompletePost,
  RelatedPostModel,
  CompleteAccount,
  RelatedAccountModel,
  CompleteVote,
  RelatedVoteModel,
  CompleteGroup,
  RelatedGroupModel,
} from './index';

export const ProfileModel = z.object({
  id: z.string(),
  accountId: z.string(),
  name: z.string().nullish(),
  phone: z.string().nullish(),
  avatar: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteProfile extends z.infer<typeof ProfileModel> {
  WrittenComments: CompleteComment[];
  ReceivedNotifications: CompleteNotification[];
  SentNotifications: CompleteNotification[];
  WrittenPosts: CompletePost[];
  account: CompleteAccount;
  Vote: CompleteVote[];
  Groups: CompleteGroup[];
}

/**
 * RelatedProfileModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProfileModel: z.ZodSchema<CompleteProfile> = z.lazy(() =>
  ProfileModel.extend({
    WrittenComments: RelatedCommentModel.array(),
    ReceivedNotifications: RelatedNotificationModel.array(),
    SentNotifications: RelatedNotificationModel.array(),
    WrittenPosts: RelatedPostModel.array(),
    account: RelatedAccountModel,
    Vote: RelatedVoteModel.array(),
    Groups: RelatedGroupModel.array(),
  }),
);
