import type { RequestContext } from '~/server/types/RequestContext'

export const checkAuthentication = async (context: RequestContext): Promise<string> => {
	if (!context.auth.userId) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthenticated, please try logging in again',
		})
	}

	return context.auth.userId as string
}
