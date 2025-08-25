import { userFactory } from '~/server/factory/user.factory'
import { getCurrentUser } from '~/server/use-case/get-current-user.use-case'

export default defineEventHandler(async (event) => {
	const params = getRouterParams(event)

	const dto: any = {
		...params,
	}

	const { user } = await getCurrentUser(dto, event.context)
	return userFactory.toFullResponse(user)
})
