import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

export default defineEventHandler((event) => {
	event.context.auth = {
		userId: undefined,
	}
	event.context.user = null

	const token = getCookie(event, 'auth_token')
	const jwtSecret = process.env.JWT_SECRET

	if (token && jwtSecret) {
		try {
			const decoded = jwt.verify(token, jwtSecret)

			if (typeof decoded === 'object' && (decoded as JwtPayload).userId) {
				const payload = decoded as JwtPayload
				event.context.user = payload
				event.context.auth.userId = payload.userId
			}
		} catch (err) {
			if (err instanceof Error) {
				console.warn('Invalid auth token provided:', err.message)
			} else {
				console.warn('An unknown error occurred during token verification.')
			}
		}
	}
})
