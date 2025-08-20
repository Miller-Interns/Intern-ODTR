import z from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import type { RequestContext } from '~/server/types/RequestContext'
import { checkAuthentication } from '~/server/utils/check-authentication'
import { internService } from '~/server/service/intern.service'
import { timeLogService } from '~/server/service/time-logs.service'
import type { ExportInternTimelogsResult } from '~/server/types/ExportTimeLogs'

const dtoSchema = z.object({
	internId: z.uuid('Invalid Intern ID format.'),
})

const validateDTO = createSchemaValidator(dtoSchema)
export type ExportInternTimeLogsDTO = z.infer<typeof dtoSchema>

export const exportInternTimelogs = async (dto: ExportInternTimelogsDTO, context: RequestContext): Promise<ExportInternTimelogsResult> => {
	await checkAuthentication(context)
	const { internId } = await validateDTO(dto)

	// Fetch intern details and formatted logs concurrently
	const [intern, timelogs] = await Promise.all([
		internService.getInternDetailsById(internId, context),
		timeLogService.getFormattedLogsByInternId(internId, context),
	])

	if (!intern) {
		throw createError({
			status: 404,
			message: `Intern with ID ${internId} not found.`,
		})
	}

	return {
		intern: {
			name: intern.name,
			// IMPORTANT: Replace 'intern.official_hours' with the actual property from your intern object
			// or provide a default value.
			officialHours: (intern as any).official_hours || '9:00 AM - 6:00 PM',
		},
		timelogs,
	}
}
