import { z } from 'zod'
import { InternSchema } from '~/server/db/schema'

export const AddInternResponseSchema = z.object({
  id: InternSchema.shape.id,
  user_id: InternSchema.shape.user_id,
  batch_id: InternSchema.shape.batch_id,
  first_name: InternSchema.shape.first_name,
  middle_name: InternSchema.shape.middle_name,
  last_name: InternSchema.shape.last_name,
  school: InternSchema.shape.school,
  course: InternSchema.shape.course,
  year: InternSchema.shape.year,
  required_hours: InternSchema.shape.required_hours,
  status: InternSchema.shape.status,
  role: InternSchema.shape.role,
  notes: InternSchema.shape.notes,
});

export type AddInternResponse = z.infer<typeof AddInternResponseSchema>;  