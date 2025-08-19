import { approveBulkLogsUseCase } from '~/server/use-case/time-logs/approve-all.use-case'
import { defineEventHandler, readBody } from 'h3'
import { ZodError } from 'zod'
import type { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)
		const result = await approveBulkLogsUseCase(body, event.context as RequestContext)

		return {
			success: true,
			message: `Successfully approved ${result.approvedCount} logs.`,
			data: {
				approvedCount: result.approvedCount,
			},
		}
	} catch (error) {
		if (error instanceof ZodError) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request: Invalid input.',
				data: error.issues,
			})
		}

		throw error
	}
})
