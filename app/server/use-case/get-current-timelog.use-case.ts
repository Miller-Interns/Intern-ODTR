import { checkAuthentication } from '../utils/check-authentication'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'
import { db } from '../db'

export const getCurrentTimeLogUseCase = async (context: RequestContext) => {
  const userId = await checkAuthentication(context)

  // Step 1: Get the complete intern profile. This is unchanged.
  const intern = await userService.getInternByUserId(userId, context)
  if (!intern) {
    throw createError({ status: 404, message: 'Intern profile not found.' })
  }

  // Step 2: Look for an active time log first. This is unchanged.
  const activeTimeLog = await timeLogService.getActiveTimeLogByInternId(intern.id, context);
  let lastCompletedLog = null;

  // Step 3: If no active log is found, find the most recent log that was COMPLETED today.
  if (!activeTimeLog) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the current day

    const qb = (context.trx ??= db);
    lastCompletedLog = await qb
      .selectFrom('time_logs')
      .selectAll()
      .where('intern_id', '=', intern.id)
      // FIX: The query now correctly checks the 'time_out' field.
      // This ensures we find any log that was completed today, regardless of when it started.
      .where('time_out', '>=', today)
      .where('time_out', 'is not', null) // This is a safe redundant check
      .orderBy('time_out', 'desc')
      .limit(1)
      .executeTakeFirst();
  }

  // Step 4: Return the data. This is unchanged.
  return {
    activeTimeLog,
    lastCompletedLog,
    requiredHours: intern.required_hours,
    renderedHours: intern.hours_completed
  }
}