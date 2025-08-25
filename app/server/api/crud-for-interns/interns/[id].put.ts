import { updateInternDetailsUseCase } from '~/server/use-case/crud-for-interns/interns/update-intern-details.use-case'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return updateInternDetailsUseCase(body)
})