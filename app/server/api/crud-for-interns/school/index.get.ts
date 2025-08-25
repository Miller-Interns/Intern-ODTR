import { getAllSchoolsUseCase } from '~/server/use-case/crud-for-interns/schools/get-all-schools.use-case'
import type { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
  const schools = await getAllSchoolsUseCase(event.context as RequestContext)
  return schools
})