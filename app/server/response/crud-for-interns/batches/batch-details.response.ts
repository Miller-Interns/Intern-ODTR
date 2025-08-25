import { z } from 'zod'

const InternInBatchSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  internPicture: z.string().nullable(),
  hoursCompleted: z.number().nullable(),
  requiredHours: z.number(),
});

const BatchDetailsSchema = z.object({
  id: z.string(),
  batchNumber: z.string(),
  statusText: z.enum(['INCOMING', 'ONGOING', 'COMPLETED']),
  internCount: z.number(),
  startDate: z.string(),
  supervisorName: z.string(),
});

export const BatchDetailsResponseSchema = z.object({
  details: BatchDetailsSchema,
  interns: z.array(InternInBatchSchema),
});

export type BatchDetailsResponse = z.infer<typeof BatchDetailsResponseSchema>;