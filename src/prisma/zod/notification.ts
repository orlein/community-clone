import * as z from 'zod';
import { CompleteProfile, RelatedProfileModel } from './index';

export const NotificationModel = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  href: z.string(),
  isRead: z.boolean(),
  isPinned: z.boolean(),
  senderNameAlias: z.string().nullish(),
  senderId: z.string(),
  recipientId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteNotification
  extends z.infer<typeof NotificationModel> {
  recipient: CompleteProfile;
  sender: CompleteProfile;
}

/**
 * RelatedNotificationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNotificationModel: z.ZodSchema<CompleteNotification> =
  z.lazy(() =>
    NotificationModel.extend({
      recipient: RelatedProfileModel,
      sender: RelatedProfileModel,
    }),
  );
