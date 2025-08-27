import { checkAuthentication } from '../utils/check-authentication'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import { createInternTimeLogsResponse } from '../response/intern-timelogs.response'
import type { RequestContext } from '../types/RequestContext'

export const getTimeLogsForInternUseCase = async (context: RequestContext) => {
	const userId = await checkAuthentication(context)

	const intern = await userService.getInternByUserId(userId, context)
	if (!intern) {
		throw createError({ status: 404, message: 'Intern profile not found.' })
	}

	const timeLogs = await timeLogService.getCompletedTimeLogsByInternId(intern.id, context)

	return createInternTimeLogsResponse(timeLogs)
}
