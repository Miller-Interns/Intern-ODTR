import { getTimeLogsUseCase } from '~/server/use-case/timelogs/get-time-log.use-case'

export default defineEventHandler(async (event) => {
	const internId = event.context.params?.id

	if (!internId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Intern ID is required.',
		})
	}

	try {
		const timeLogs = await getTimeLogsUseCase(internId)
		return timeLogs
	} catch (error) {
		console.error('Error fetching time logs:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch time logs.',
		})
	}
})