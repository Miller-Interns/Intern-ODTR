import { schoolService } from '~/server/service/crud-for-interns/schools/school.service'
import type { RequestContext } from '~/server/types/RequestContext'
import { schoolFactory } from '~/server/factory/crud-for-interns/schools/school.factory'

export const getAllSchoolsUseCase = async (_context: RequestContext) => {
  const rawSchools = await schoolService.getDistinctSchoolNames()
  
  return schoolFactory.toSchoolListResponse(rawSchools);
}