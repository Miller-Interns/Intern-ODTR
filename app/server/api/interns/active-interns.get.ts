import { useGetActiveInterns } from '~/server/use-case/get-active-interns.use-case'
import type { ActiveInternsApiResponse } from '~/types/Api'

export default defineEventHandler(async (event): Promise<ActiveInternsApiResponse> => {
	try {
		const activeInternsData = await useGetActiveInterns(event.context.db)
		return activeInternsData
	} catch (error: any) {
		if (error.message === 'No active batch found.') {
			throw createError({
				statusCode: 404,
				statusMessage: error.message,
			})
		}

		console.error('API Error fetching active interns:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'An internal server error occurred while fetching data.',
		})
	}
})
