import { checkAuthentication } from '../utils/check-authentication'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import { createInternTimeLogsResponse } from '../response/intern-timelogs.response' // Import the new response formatter
import type { RequestContext } from '../types/RequestContext'

/**
 * This use case orchestrates the process of fetching the complete time log history for the currently logged-in intern.
 */
export const getTimeLogsForInternUseCase = async (context: RequestContext) => {
	// 1. Authenticate the user
	const userId = await checkAuthentication(context)

	// 2. Fetch the intern profile to get their ID
	const intern = await userService.getInternByUserId(userId, context)
	if (!intern) {
		throw createError({ status: 404, message: 'Intern profile not found.' })
	}

	// 3. Fetch the raw data from the time log service
	const timeLogs = await timeLogService.getCompletedTimeLogsByInternId(intern.id, context)

	// 4. Pass the raw data to the response formatter to build the final API response
	return createInternTimeLogsResponse(timeLogs)
}
