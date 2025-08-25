import { z } from 'zod'

export const SchoolListItemResponseSchema = z.object({
  school: z.string(),
});

export const SchoolListResponseSchema = z.array(SchoolListItemResponseSchema);
export type SchoolListItemResponse = z.infer<typeof SchoolListItemResponseSchema>;
export type SchoolListResponse = z.infer<typeof SchoolListResponseSchema>;