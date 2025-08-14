import { useGetInternDetails } from '~/server/use-case/get-intern-details.use-case'
import type { InternDetailsResponse } from '~/types/Api'

export default defineEventHandler(async (event): Promise<InternDetailsResponse> => {
	const internId = event.context.params?.id

	if (!internId) {
		throw createError({ statusCode: 400, statusMessage: 'Intern ID is required.' })
	}

	try {
		const internDetails = await useGetInternDetails(event.context.db, internId)
		return internDetails
	} catch (error: any) {
		if (error.message === 'Intern not found.') {
			throw createError({ statusCode: 404, statusMessage: error.message })
		}

		console.error(`API Error fetching details for intern ${internId}:`, error)
		throw createError({ statusCode: 500, statusMessage: 'An internal server error occurred.' })
	}
})
