import z from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import type { RequestContext } from '~/server/types/RequestContext'
import { checkAuthentication } from '~/server/utils/check-authentication'
import { internService } from '~/server/service/intern.service'
import { timeLogService } from '~/server/service/time-logs.service'
import type { ExportTimeLogsResponse, FormattedTimeLog } from '~/server/response/export-logs.response';

const dtoSchema = z.object({
	internId: z.uuid('Invalid Intern ID format.'),
})

const validateDTO = createSchemaValidator(dtoSchema)
export type ExportInternTimeLogsDTO = z.infer<typeof dtoSchema>

export const exportInternTimelogs = async (dto: ExportInternTimeLogsDTO, context: RequestContext): Promise<ExportTimeLogsResponse> => {
	await checkAuthentication(context)
	const { internId } = await validateDTO(dto)

	// Fetch intern details and formatted logs concurrently
	const [intern, timelogs] = await Promise.all([
		internService.getInternDetailsById(internId, context),
		timeLogService.getLogsByInternIdWithAdmin(internId, context),
	])

	if (!intern) {
		throw createError({
			status: 404,
			message: `Intern with ID ${internId} not found.`,
		})
	}

	if (!intern.name) {
		throw createError({ statusCode: 500, message: `Data integrity error: Intern with ID ${internId} has no name.` });
	}

	const formattedLogs: FormattedTimeLog[] = timelogs.map((log) => {
		const timeInDate = new Date(log.time_in);
		const timeOutDate = log.time_out ? new Date(log.time_out) : null;

		return {
			date: timeInDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }),
			timeIn: timeInDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
			timeOut: timeOutDate ? timeOutDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
			noOfHours: log.total_hours,
			approvedBy: log.approved_by,
		};
	});

	return {
		intern: {
			name: intern.name,
			officialHours: '9:00 - 6:00 PM',
		},
		timelogs: formattedLogs,
	};
}
