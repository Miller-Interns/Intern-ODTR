import type { RequestContext } from '~/server/types/RequestContext'
import { loginUseCase } from '~/server/use-case/login.use-case'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const dto: any = {
		...body,
	}
	return await loginUseCase(dto, event.context as RequestContext, event)
})
