import { BatchSchema, UserSchema } from '~/server/db/schema'
import {z} from 'zod'


export const RawBatchDataSchema = z.object({
    id: BatchSchema.shape.id,
    batch_number: BatchSchema.shape.batch_number,
    start_date: BatchSchema.shape.start_date,
    end_date: BatchSchema.shape.end_date.nullable(),
    status: BatchSchema.shape.status,
  supervisor_name: UserSchema.shape.name,
  supervisorId:UserSchema.shape.id,
  intern_count: z.number().int().nullable(),
});

export const BatchDetailsViewArraySchema = z.array(RawBatchDataSchema );
export type BatchDetailsView = z.infer<typeof RawBatchDataSchema >;

