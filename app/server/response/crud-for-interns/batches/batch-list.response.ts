import { z } from 'zod'

export const BatchListItemResponseSchema = z.object({
  id: z.string(),
  batchNumber: z.string(),
  status: z.enum(['INCOMING', 'ONGOING', 'COMPLETED']),
  supervisor: z.string(),
  internCount: z.number(),
});

export const BatchListResponseSchema = z.array(BatchListItemResponseSchema);
export type BatchListItemResponse = z.infer<typeof BatchListItemResponseSchema>;
export type BatchListResponse = z.infer<typeof BatchListResponseSchema>;