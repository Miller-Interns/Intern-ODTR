import { checkAuthentication } from '../utils/check-authentication'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import { createCurrentTimeLogResponse } from '../response/current-timelog.response'
import type { RequestContext } from '../types/RequestContext'
import { Status } from '../../enum/enums'

export const getCurrentTimeLogUseCase = async (context: RequestContext) => {
	const userId = await checkAuthentication(context)
	const intern = await userService.getInternByUserId(userId, context)
	if (!intern) {
		throw createError({ status: 404, message: 'Intern profile not found.' })
	}

	let activeTimeLog = null
	let lastCompletedLog = null

	// FIX: Only search for logs if the intern is ONGOING.
	if (intern.status === Status.ONGOING) {
		activeTimeLog = await timeLogService.getActiveTimeLogByInternId(intern.id, context)
		if (!activeTimeLog) {
			lastCompletedLog = await timeLogService.getLastCompletedLogTodayByInternId(intern.id, context)
		}
	}

	return createCurrentTimeLogResponse({
		intern,
		activeTimeLog,
		lastCompletedLog,
	})
}
