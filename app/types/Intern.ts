import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { User } from '~/types/User'
import type { Batch, Status } from '~/types/Batch'

export const AddInternSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  school: z.union([
    z.object({ label: z.string().min(1, 'School is required') }),
    z.string().min(1, 'School is required')
  ]),
  courseYear: z.string()
    .min(3, 'Course and Year are required')
    .refine(val => /\s*-\s*/.test(val), {
      message: 'Must include a hyphen between course and year (e.g., "BS in Computer Engineering - 3rd Year")',
  }),
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
  notes: z.string().optional(),
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
  notes: string | null;
  status: 'INCOMING' | 'ONGOING' | 'COMPLETED';
  internPicture: string | null;
  hoursCompleted: number | null;
  fullName: string;
  courseYear: string;
};

export const UpdateInternSchema = z.object({
  userId: z.string().uuid(),
  internId: z.string().min(1),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  contactNumber: z.string().optional(),
  emergencyContactPerson: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  school: z.string().min(1),
  courseYear: z.string().min(3),
  requiredHours: z.number().positive(),
  role: z.string().optional(),
  notes: z.string().nullable().transform(val => val === '' ? null : val),
});

export type UpdateInternDTO = z.infer<typeof UpdateInternSchema>;

export type Intern = {
	id: string;
	user_id: string;
	batch_id: string;
	school: string;
	required_hours: number;
	status: Status;
	course: string;
	year: string;
	contact_number: string;
	emergency_contact_person: string;
	emergency_contact_number: string;
	role: string;
	intern_picture: string | null;
	hours_completed: number | null;
	note: string | null;
};

export type InternWithDetails = Omit<Selectable<Intern>, 'hours_completed'> & {
	user: Pick<User, 'name' | 'email'>
	batch: Pick<Batch, 'batch_number'>
	completed_hours: number
	remaining_hours: number
}

export type ActiveInternRow = {
	id: Intern['id']
	user_id: Intern['user_id']
	batch_id: Intern['batch_id']
	required_hours: Intern['required_hours']
	intern_picture: Intern['intern_picture']
	status: Intern['status']
	name: User['name']
	email: User['email']
	batch_number: Batch['batch_number']
	completed_hours: number
}

export type InternSummary = {
	id: string
	user_id: string
	batch_id: string
	required_hours: number
	intern_picture: string | null
	status: Status

	user: {
		name: string | null
		email: string
	}
	batch: {
		batch_number: string
	}

	completed_hours: number
	remaining_hours: number
}
