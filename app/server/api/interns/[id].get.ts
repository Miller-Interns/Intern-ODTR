import { getInternDetailsUseCase } from '~/server/use-case/interns/get-intern-details.use-case'

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  return getInternDetailsUseCase({ id: params.id })
})