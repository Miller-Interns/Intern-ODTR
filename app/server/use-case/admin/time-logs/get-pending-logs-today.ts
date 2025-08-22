import z from 'zod'
import { createSchemaValidator } from '../../../utils/create-schema-validator'
import { timeLogService } from '~/server/service/admin/time-logs.service'
import type { RequestContext } from '../../../types/RequestContext'
import type { DashboardLog } from '~/types/TimeLog'
import { checkAuthentication } from '../../../utils/check-authentication'
import type { RawPendingLogQueryResult } from '~/server/types/RawPendingLogQueryResult'

const dtoSchema = z.object({})
const validateDTO = createSchemaValidator(dtoSchema)
export type GetPendingTodayDTO = z.infer<typeof dtoSchema>

type GetPendingTodayResult = {
	logs: DashboardLog[]
}

function formatToDashboardLogs(rawLogs: RawPendingLogQueryResult[]): DashboardLog[] {
	return rawLogs.map((log) => ({
		id: log.id,
		intern_id: log.intern_id,
		time_in: log.time_in.toISOString(),
		time_out: log.time_out ? log.time_out.toISOString() : null,
		total_hours: log.total_hours,
		admin_remarks: log.admin_remarks ?? null,
		intern_notes: log.intern_notes ?? null,
		status: log.status,
		admin_id: log.admin_id ?? '',
		intern_name: log.intern_name ?? 'Unnamed Intern',
		intern_picture: log.intern_picture ?? null,
	}))
}

export const getPendingToday = async (dto: GetPendingTodayDTO, context: Partial<RequestContext>): Promise<GetPendingTodayResult> => {
	const safeContext: RequestContext = {
		auth: context.auth ?? {},
		trx: context.trx,
	}

	await checkAuthentication(safeContext)
	await validateDTO(dto)

	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	const rawLogs = await timeLogService.fetchPendingWithInternDetails(today, tomorrow, safeContext)
	const formattedLogs = formatToDashboardLogs(rawLogs)
	return { logs: formattedLogs }
}
