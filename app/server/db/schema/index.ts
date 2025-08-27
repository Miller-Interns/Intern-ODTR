import { z } from 'zod'
import type { Status } from '~/server/db/types.d.ts'

export const StatusSchema = z.enum(['INCOMING', 'ONGOING', 'COMPLETED'])

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _statusCheck: Status = '' as z.infer<typeof StatusSchema>

export const BatchSchema = z.object({
	id: z.string(),
	batch_number: z.string(),
	start_date: z.date(),
	end_date: z.date().nullable(),
	status: StatusSchema,
	supervisorId: z.string(),
})

export const InternSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	batch_id: z.string(),
	first_name: z.string(),
	middle_name: z.string().nullable(),
	last_name: z.string(),
	school: z.string(),
	course: z.string().nullable(),
	year: z.string().nullable(),
	contact_number: z.string().nullable(),
	emergency_contact_person: z.string().nullable(),
	emergency_contact_number: z.string().nullable(),
	required_hours: z.number(),
	status: StatusSchema,
	hours_completed: z.number().nullable(),
	intern_picture: z.string().nullable(),
	role: z.string().nullable(),
	notes: z.string().nullable(),
})

export const TimeLogSchema = z.object({
	id: z.string(),
	intern_id: z.string(),
	time_in: z.date(),
	time_out: z.date().nullable(),
	total_hours: z.number(),
	admin_remarks: z.string().nullable(),
	intern_notes: z.string().nullable(),
	status: z.boolean(),
	admin_id: z.string().nullable(),
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
