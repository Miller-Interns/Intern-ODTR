import { z } from 'zod'

export const InternDetailsResponseSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  internId: z.string(),
  batchId: z.string(),
  contactNumber: z.string().nullable(),
  emergencyContactPerson: z.string().nullable(),
  emergencyContactNumber: z.string().nullable(),
  school: z.string(),
  course: z.string(),
  year: z.string(),
  requiredHours: z.number(),
  role: z.string(),
  notes: z.string().nullable(),
  status: z.enum(['INCOMING', 'ONGOING', 'COMPLETED']),
  internPicture: z.string().nullable(),
  hoursCompleted: z.number().nullable(),
  fullName: z.string(),
  courseYear: z.string(),
});

export type InternDetailsResponse = z.infer<typeof InternDetailsResponseSchema>;