import { z } from 'zod'
import { InternSchema } from '~/server/db/schema'

export const AddInternResponseSchema = z.object({
  id: InternSchema.shape.id,
  user_id: InternSchema.shape.user_id,
  batch_id: InternSchema.shape.batch_id,
  school: InternSchema.shape.school,
  course: InternSchema.shape.course,
  year: InternSchema.shape.year,
  required_hours: InternSchema.shape.required_hours,
  status: InternSchema.shape.status,
  role: InternSchema.shape.role,
  note: InternSchema.shape.note,
});

export type AddInternResponse = z.infer<typeof AddInternResponseSchema>;