import type { RequestContext } from '~/server/types/RequestContext'
import { db } from '../db'
import type { TimeLog } from '../db/types'
import type { Selectable } from 'kysely'

async function getActiveTimeLogByInternId(internId: string, ctx: RequestContext): Promise<Selectable<TimeLog> | null> {
  const qb = (ctx.trx ??= db)
  // FIX: Find the active log by checking for `status: false`
  const result = await qb
    .selectFrom('time_logs')
    .selectAll()
    .where('intern_id', '=', internId)
    .where('status', '=', false) // This is the new logic for "active"
    .orderBy('time_in', 'desc')
    .limit(1)
    .executeTakeFirst()

  return result ?? null;
}

// This method is now an UPDATE operation.
async function timeOut(logId: string, details: { remarks?: string; total_hours: number }, ctx: RequestContext) {
  const qb = (ctx.trx ??= db)
  return await qb
    .updateTable('time_logs')
    .set({
      time_out: new Date(), // Set the real time_out
      remarks: details.remarks,
      total_hours: details.total_hours,
      status: true, // Mark the log as "completed"
    })
    .where('id', '=', logId)
    .returningAll()
    .executeTakeFirst()
}

export const timeLogService = {
    getActiveTimeLogByInternId,
    timeOut
}