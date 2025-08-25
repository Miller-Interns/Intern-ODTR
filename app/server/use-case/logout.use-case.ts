import type { H3Event } from 'h3'

export const logoutUseCase = (event: H3Event) => {
	setCookie(event, 'auth_token', '', {
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		maxAge: 0, // expire immediately
	})

	return { status: true }
}
