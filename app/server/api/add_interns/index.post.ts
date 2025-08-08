import { createInternUseCase } from '~/server/use-cases/useAddIntern'
import type { InternRequestBody } from '~/interfaces/interfaces'

export default defineEventHandler(async (event) => {
	try {
		const body: InternRequestBody = await readBody(event)

		const newIntern = await createInternUseCase(body)

		event.node.res.statusCode = 201
		return {
			message: 'Intern created successfully!',
			data: newIntern,
		}
	} catch (error: any) {
		if (error.code === 'P2002') {
			throw createError({
				statusCode: 409,
				statusMessage: 'An account with this email already exists.',
			})
		}
		
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.statusMessage || 'An internal server error occurred.',
		})
	}
})