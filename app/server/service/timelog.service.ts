import type { RequestContext } from '~/server/types/RequestContext'
import { db } from '../db'
import type { TimeLog } from '../db/types'
import type { Selectable } from 'kysely'

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

export const timeLogService = {
    getActiveTimeLogByInternId,
    timeOut,
}