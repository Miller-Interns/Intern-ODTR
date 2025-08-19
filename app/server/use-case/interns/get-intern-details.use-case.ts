import z from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import type { RequestContext } from '~/server/types/RequestContext'
import { internService } from '~/server/service/intern.service'
import { timeLogService } from '~/server/service/time-logs.service'
import type { InternDetailsResponse } from '~/server/response/intern-details.response'
import { createError } from 'h3'

const dtoSchema = z.object({
	internId: z.string().uuid('Invalid Intern ID format.'),
})

const validateDTO = createSchemaValidator(dtoSchema)
export type GetInternDetailsDTO = z.infer<typeof dtoSchema>

export async function getInternDetails(dto: GetInternDetailsDTO, context: RequestContext): Promise<InternDetailsResponse> {
	const { internId } = await validateDTO(dto)

	const [internResult, timeLogsResult] = await Promise.all([
		internService.getInternDetailsById(internId, context),
		timeLogService.getTimeLogsByInternId(internId, context),
	])

	if (!internResult) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Intern not found.',
		})
	}

	const completedHours = timeLogsResult.filter((log) => log.status === true).reduce((sum, log) => sum + (log.total_hours || 0), 0)

	const remainingHours = internResult.required_hours - completedHours
	const { name, email, batch_number, ...internBase } = internResult
	const intern: InternDetailsResponse['intern'] = {
		...internBase,
		user: { name, email },
		batch: { batch_number: batch_number || 'N/A' },
		completed_hours: Math.round(completedHours * 100) / 100,
		remaining_hours: Math.round(remainingHours * 100) / 100,
	}

	const timeLogs: InternDetailsResponse['timeLogs'] = timeLogsResult.map((log) => ({
		...log,
		time_in: log.time_in.toISOString(),
		time_out: log.time_out.toISOString(),
		total_hours: Math.round((log.total_hours || 0) * 100) / 100,
		intern: {
			id: internResult.id,
			name: internResult.name ?? 'Unnamed Intern',
			role: internResult.role ?? 'intern',
			intern_picture: internResult.intern_picture ?? null,
		},
	}))

	return {
		intern,
		timeLogs,
	}
}
