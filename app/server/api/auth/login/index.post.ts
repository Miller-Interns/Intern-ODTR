import type { RequestContext } from '~/server/types/RequestContext'
import { loginUseCase } from '~/server/use-case/login.use-case'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const dto: any = {
		...body,
	}
	const response = await loginUseCase(dto, event.context as RequestContext, event)

	if (!response.user) {
		return null
	}

	await setUserSession(event, {
		user: response.user,
	})

	setCookie(event, 'auth_token', response.token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 12,
		path: '/',
	})

	return {
		status: 'success',
	}
})
