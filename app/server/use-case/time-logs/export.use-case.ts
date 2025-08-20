import z from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import type { RequestContext } from '~/server/types/RequestContext'
import { timeLogService } from '~/server/service/time-logs.service'
import { createError } from 'h3'
import { format as formatCsv } from 'fast-csv'

const dtoSchema = z.object({
	internId: z.string().uuid('Invalid Intern ID format.'),
})

const validateDTO = createSchemaValidator(dtoSchema)
export type ExportInternTimeLogsDTO = z.infer<typeof dtoSchema>

export async function exportInternTimeLogs(dto: ExportInternTimeLogsDTO, context: RequestContext): Promise<string> {
	const { internId } = await validateDTO(dto)
	const timeLogs = await timeLogService.getTimeLogsByInternId(internId, context)

	if (!timeLogs || timeLogs.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: 'No time logs found for this intern to export.',
		})
	}

	return new Promise((resolve, reject) => {
		const csvRows: string[] = []
		const headers = ['id', 'date', 'time_in', 'time_out', 'total_hours', 'status', 'remarks']
		const csvStream = formatCsv({ headers, writeHeaders: true })

		csvStream.on('data', (chunk) => {
			csvRows.push(chunk)
		})

		csvStream.on('end', () => {
			resolve(csvRows.join(''))
		})

		csvStream.on('error', (err) => {
			reject(
				createError({
					statusCode: 500,
					statusMessage: 'Failed to generate CSV file.',
					cause: err,
				}),
			)
		})

		for (const log of timeLogs) {
			const date = log.time_in.toISOString().split('T')[0]
			csvStream.write({
				id: log.id,
				date: date,
				time_in: log.time_in.toLocaleTimeString('en-US', { hour12: true }),
				time_out: log.time_out.toLocaleTimeString('en-US', { hour12: true }),
				total_hours: log.total_hours?.toFixed(2) ?? '0.00',
				status: log.status ? 'Approved' : 'Pending',
				remarks: log.admin_remarks ?? '',
			})
		}

		csvStream.end()
	})
}
