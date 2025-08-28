import { z } from 'zod'

export const InternLogResponseSchema = z.object({
	id: z.string(),
	intern_id: z.string(),
	time_in: z.string(), // Dates are converted to strings for JSON transport
	time_out: z.string().nullable(),
	total_hours: z.number(),
	admin_remarks: z.string().nullable(),
	intern_notes: z.string().nullable(),
	status: z.boolean(),
	admin_id: z.string().nullable(),
})

export type InternLogResponse = z.infer<typeof InternLogResponseSchema>