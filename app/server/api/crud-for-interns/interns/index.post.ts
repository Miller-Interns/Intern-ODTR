import { addInternUseCase } from '~/server/use-case/crud-for-interns/add-intern/add-intern.use-case'
import type { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const newIntern = await addInternUseCase(body, event.context as RequestContext)

	return {
		status: 'success',
		message: 'Intern added successfully',
		data: newIntern,
	}
})