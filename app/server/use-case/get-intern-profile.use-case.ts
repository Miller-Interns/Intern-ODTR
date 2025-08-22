import { checkAuthentication } from '../utils/check-authentication'
import { userService } from '../service/user.service'
import { createInternProfileResponse } from '../response/intern-profile.response' // Import the new response formatter
import type { RequestContext } from '../types/RequestContext'

export const getInternProfileUseCase = async (context: RequestContext) => {
	const userId = await checkAuthentication(context)
	const profile = await userService.getFullInternProfileByUserId(userId, context)

	if (!profile) {
		throw createError({ status: 404, message: 'Intern profile could not be found.' })
	}

	return createInternProfileResponse(profile)
}
