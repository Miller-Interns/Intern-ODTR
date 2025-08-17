import { z } from 'zod'

export const AddInternSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
  school: z.union([
    z.object({ label: z.string().min(1, 'School is required') }),
    z.string().min(1, 'School is required')
  ]),
  courseYear: z.string().min(3, 'Course and Year are required'),
  requiredHours: z.coerce.number()
    .refine(val => val !== null && val !== undefined && !isNaN(val), {
      message: "Required hours is required."
    })
    .refine(val => val > 0, {
      message: "Hours must be a positive number"
    }),
  
  middleName: z.string().optional(),
  contactNumber: z.string().optional(),
  emergencyContactPerson: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  role: z.string().optional(),
  note: z.string().optional(),
})

export type AddInternDTO = z.infer<typeof AddInternSchema>

export type InternDetails = {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  internId: string;
  batchId: string;
  contactNumber: string | null;
  emergencyContactPerson: string | null;
  emergencyContactNumber: string | null;
  school: string;
  course: string;
  year: string;
  requiredHours: number;
  role: string;
  note: string | null;
  status: 'INCOMING' | 'ONGOING' | 'COMPLETED';
  internPicture: string | null;
  hoursCompleted: number | null;
  fullName: string;
  courseYear: string;
};