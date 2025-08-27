import { getTimeLogsForInternUseCase } from '~/server/use-case/get-timelogs-for-intern.use-case'

export default defineEventHandler(async (event) => {
	return await getTimeLogsForInternUseCase(event.context)
})
