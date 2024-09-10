import * as z from 'zod';

export const FileModel = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  path: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});
