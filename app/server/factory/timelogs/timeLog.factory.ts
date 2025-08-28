import { z } from 'zod'
import type { TimeLogWithInternDetails } from '~/server/service/timelogs/timeLog.service'

const TimeLogResponseSchema = z.object({
	id: z.string(),
	intern_id: z.string(),
	time_in: z.string(), 
	time_out: z.string().nullable(),
	total_hours: z.number(),
	admin_remarks: z.string().nullable(),
	intern_notes: z.string().nullable(),
	status: z.boolean(),
	admin_id: z.string().nullable(),
	intern: z.object({
		id: z.string(), 
		name: z.string(),
		role: z.string().nullable(),
		intern_picture: z.string().nullable(),
	}),
})

export type TimeLogResponse = z.infer<typeof TimeLogResponseSchema>

function toTimeLogResponse(log: TimeLogWithInternDetails): TimeLogResponse {
	const viewModel = {
		...log,
		time_in: new Date(log.time_in as any).toISOString(),
		time_out: log.time_out ? new Date(log.time_out as any).toISOString() : null,
		intern: {
			id: log.intern_id,
			name: log.intern_name || 'Unknown Intern',
			role: log.intern_role,
			intern_picture: log.intern_picture,
		},
	}
	return TimeLogResponseSchema.parse(viewModel)
}

function toTimeLogListResponse(logs: TimeLogWithInternDetails[]): TimeLogResponse[] {
	return logs.map(toTimeLogResponse)
}

export const timeLogFactory = {
	toTimeLogListResponse,
}