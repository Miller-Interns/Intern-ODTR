import type { RequestContext } from '~/server/types/RequestContext'

export const checkAuthentication = async (context: RequestContext): Promise<string> => {
	if (!context || !context.auth) {
		console.error('[AUTH ERROR] The "auth" object is missing from the request context.');
		throw createError({
			statusCode: 500,
			statusMessage: 'Server authentication configuration error.',
		});
	}

	if (!context.auth.userId) {
		console.error('[AUTH ERROR] "userId" is missing from the auth context. The user is not authenticated.');
		console.error('[AUTH CONTEXT SNAPSHOT]', context.auth);
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthenticated, please try logging in again',
		});
	}

	return context.auth.userId as string
}