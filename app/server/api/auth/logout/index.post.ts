import { logoutUseCase } from '~/server/use-case/logout.use-case'

export default defineEventHandler(async (event) => {
	return logoutUseCase(event)
})
