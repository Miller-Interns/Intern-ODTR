import { checkAuthentication } from '../utils/check-authentication'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'

export const getInternProfileUseCase = async (context: RequestContext) => {
  const userId = await checkAuthentication(context)
  
  const profile = await userService.getFullInternProfileByUserId(userId, context);
  if (!profile) {
    throw createError({ status: 404, message: 'Intern profile could not be found.' })
  }

  return { profile }
}