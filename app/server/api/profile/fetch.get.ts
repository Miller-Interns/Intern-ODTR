import { getInternProfileUseCase } from '~/server/use-case/get-intern-profile.use-case'

export default defineEventHandler(async (event) => {
  return await getInternProfileUseCase(event.context)
})