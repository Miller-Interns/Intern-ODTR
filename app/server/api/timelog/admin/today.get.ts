import { timelogFactory } from '~/server/factory/time-log.factory'
import { getPendingToday } from '~/server/use-case/admin/time-logs/get-pending-logs-today'
import type { RequestContext } from '~/server/types/RequestContext'
import type { DashboardLog } from '~/types/TimeLog'

export default defineEventHandler(async (event) => {
	const dto = {}

	const useCaseContext: RequestContext = {
		auth: event.context.auth ?? {},
		trx: event.context.trx,
	}

	const { logs: fetchedLogs } = await getPendingToday(dto, useCaseContext)
	const completeLogs = fetchedLogs.filter((log): log is Omit<DashboardLog, 'time_out'> & { time_out: string } => {
		return log.time_out !== null
	})

	const validatedLogs = timelogFactory.toDashboardResponseArray(completeLogs)
	return { logs: validatedLogs }
})
