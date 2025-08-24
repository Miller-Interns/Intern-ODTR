import { updateInternProfileUseCase } from '~/server/use-case/update-intern-profile.use-case'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await updateInternProfileUseCase(body, event.context)
})