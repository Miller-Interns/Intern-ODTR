import { schoolService } from '~/server/service/schools/school.service'
import type { RequestContext } from '~/server/types/RequestContext'

export const getAllSchoolsUseCase = async (_context: RequestContext) => {
  return schoolService.getDistinctSchoolNames()
}