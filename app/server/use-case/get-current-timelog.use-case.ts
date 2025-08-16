import { checkAuthentication } from '../utils/check-authentication'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'
import { db } from '../db'

// FIX: Added the 'export' keyword to make this function available for import.
export const getCurrentTimeLogUseCase = async (context: RequestContext) => {
  const userId = await checkAuthentication(context)

  const intern = await userService.getInternByUserId(userId, context)
  if (!intern) {
    throw createError({ status: 404, message: 'Intern profile not found.' })
  }

  let activeTimeLog = null;
  let lastCompletedLog = null;

  if (intern.status === true) {
    activeTimeLog = await timeLogService.getActiveTimeLogByInternId(intern.id, context);
    
    if (!activeTimeLog) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const qb = (context.trx ??= db);
      lastCompletedLog = await qb
        .selectFrom('time_logs')
        .selectAll()
        .where('intern_id', '=', intern.id)
        .where('time_out', '>=', today)
        .where('time_out', 'is not', null)
        .orderBy('time_out', 'desc')
        .limit(1)
        .executeTakeFirst();
    }
  }

  return {
    activeTimeLog,
    lastCompletedLog,
    internStatus: intern.status,
    requiredHours: intern.required_hours,
    renderedHours: intern.hours_completed
  }
}