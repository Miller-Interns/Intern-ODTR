import { timeLogFactory } from '~/server/factory/timelogs/timeLog.factory'
import { timeLogService } from '~/server/service/timelogs/timeLog.service'

export async function getTimeLogsUseCase(internId: string) {

	const rawLogs = await timeLogService.findTimeLogsByInternId(internId)
	const formattedLogs = timeLogFactory.toTimeLogListResponse(rawLogs)

	return formattedLogs
}