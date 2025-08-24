import { getCurrentUser } from '~/server/use-case/get-current-user.use-case'
import { checkAuthentication } from '~/server/utils/check-authentication'

export default defineEventHandler(async (event) => {
	const userId = await checkAuthentication(event.context)
	
	return getCurrentUser({ id: userId }, event.context)
})
