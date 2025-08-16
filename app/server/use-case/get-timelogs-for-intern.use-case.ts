import { checkAuthentication } from '../utils/check-authentication'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'
import { db } from '../db'

export const getTimeLogsForInternUseCase = async (context: RequestContext) => {
  const userId = await checkAuthentication(context)

  const intern = await userService.getInternByUserId(userId, context)
  if (!intern) {
    throw createError({ status: 404, message: 'Intern profile not found.' })
  }

  // FIX: Update the query to join with the users table to get the admin's name.
  const qb = (context.trx ??= db);
  const timeLogs = await qb
    .selectFrom('time_logs')
    .leftJoin('users', 'users.id', 'time_logs.admin_id') // Join users table on admin_id
    .selectAll('time_logs') // Select all columns from the time_logs table
    .select('users.name as adminName') // And select the admin's name, aliasing it as 'adminName'
    .where('intern_id', '=', intern.id)
    .where('time_out', 'is not', null)
    .orderBy('time_in', 'desc')
    .execute();

  return { timeLogs }
}