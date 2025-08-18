import { checkAuthentication } from '../utils/check-authentication'
import { userService } from '../service/user.service'
import { createInternProfileResponse } from '../response/intern-profile.response' // Import the new response formatter
import type { RequestContext } from '../types/RequestContext'

/**
 * This use case orchestrates the process of fetching the full profile details for the currently logged-in intern.
 */
export const getInternProfileUseCase = async (context: RequestContext) => {
	// 1. Authenticate the user
	const userId = await checkAuthentication(context)

	// 2. Fetch the raw data from the user service
	const profile = await userService.getFullInternProfileByUserId(userId, context)
	if (!profile) {
		throw createError({ status: 404, message: 'Intern profile could not be found.' })
	}

	// 3. Pass the raw data to the response formatter to build the final API response
	return createInternProfileResponse(profile)
}
