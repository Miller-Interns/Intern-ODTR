import { z } from 'zod'

export const BatchSchema = z.object({
	id: z.string(),
	batch_number: z.string(),
	start_date: z.date(),
	end_date: z.date(),
	status: z.boolean(),
})

export const InternSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  batch_id: z.string(),
  first_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
  school: z.string(),
  course: z.string(),
  year: z.string(),
  contact_number: z.string(),
  emergency_contact_person: z.string(),
  emergency_contact_number: z.string(),
  required_hours: z.number(),
  status: z.enum(['INCOMING', 'ONGOING', 'COMPLETED']),
  role: z.string(),
  intern_picture: z.string(),
  hours_completed: z.number(),
  notes: z.string(),
})

export const TimeLogSchema = z.object({
	id: z.string(),
	intern_id: z.string(),
	time_in: z.date(),
	time_out: z.date(),
	overtime: z.number().nullable(),
	total_hours: z.number(),
	remarks: z.string().nullable(),
	status: z.boolean(),
	admin_id: z.string(),
})

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string().nullable(),
	password: z.string().nullable(),
	isAdmin: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
