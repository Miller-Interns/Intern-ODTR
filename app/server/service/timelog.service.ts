import type { RequestContext } from '~/server/types/RequestContext'
import { db } from '../db'
import type { TimeLog } from '../db/types'
import type { Selectable } from 'kysely'

/**
 * Finds the single most recent time log for an intern that has not yet been timed out.
 */
async function getActiveTimeLogByInternId(internId: string, ctx: RequestContext): Promise<Selectable<TimeLog> | null> {
  const qb = (ctx.trx ??= db)
  const result = await qb
    .selectFrom('time_logs')
    .selectAll()
    .where('intern_id', '=', internId)
    .where('time_out', 'is', null)
    .orderBy('time_in', 'desc')
    .limit(1)
    .executeTakeFirst()
  return result ?? null;
}

/**
 * Updates an existing time log record to mark it as complete.
 */
async function timeOut(logId: string, details: { intern_notes?: string; total_hours: number }, ctx: RequestContext) {
  const qb = (ctx.trx ??= db)
  return await qb
    .updateTable('time_logs')
    .set({
      time_out: new Date(),
      intern_notes: details.intern_notes,
      total_hours: details.total_hours,
    })
    .where('id', '=', logId)
    .returningAll()
    .executeTakeFirst()
}

/**
 * FIX: This function now correctly handles the database logic.
 * Fetches all completed time logs for a specific intern and joins with the users table
 * to get the name of the approving admin.
 */
async function getCompletedTimeLogsByInternId(internId: string, ctx: RequestContext) {
  const qb = (ctx.trx ??= db);
  return await qb
    .selectFrom('time_logs')
    .leftJoin('users', 'users.id', 'time_logs.admin_id') // Join users table
    .selectAll('time_logs') // Select all columns from the time_logs table
    .select('users.name as adminName') // And select the admin's name, aliasing it
    .where('intern_id', '=', internId)
    .where('time_out', 'is not', null)
    .orderBy('time_in', 'desc')
    .execute();
}

export const timeLogService = {
    getActiveTimeLogByInternId,
    timeOut,
    getCompletedTimeLogsByInternId,
};