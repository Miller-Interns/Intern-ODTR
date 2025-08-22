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
	return result ?? null
}

async function getLastCompletedLogTodayByInternId(internId: string, ctx: RequestContext) {
	const qb = (ctx.trx ??= db)
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	return await qb
		.selectFrom('time_logs')
		.selectAll()
		.where('intern_id', '=', internId)
		.where('time_out', '>=', today)
		.where('time_out', 'is not', null)
		.orderBy('time_out', 'desc')
		.limit(1)
		.executeTakeFirst()
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

async function getCompletedTimeLogsByInternId(internId: string, ctx: RequestContext) {
	const qb = (ctx.trx ??= db)
	return await qb
		.selectFrom('time_logs')
		.leftJoin('users', 'users.id', 'time_logs.admin_id')
		.selectAll('time_logs')
		.select('users.name as adminName')
		.where('intern_id', '=', internId)
		.where('time_out', 'is not', null)
		.orderBy('time_in', 'desc')
		.execute()
}

async function findActiveLogByIdAndInternId(logId: string, internId: string, ctx: RequestContext) {
	const qb = (ctx.trx ??= db)
	return await qb
		.selectFrom('time_logs')
		.selectAll()
		.where('id', '=', logId)
		.where('intern_id', '=', internId)
		.where('time_out', 'is', null)
		.orderBy('time_in', 'asc')
		.executeTakeFirst()
}

export const timeLogService = {
	getActiveTimeLogByInternId,
	timeOut,
	getCompletedTimeLogsByInternId,
	getLastCompletedLogTodayByInternId,
	findActiveLogByIdAndInternId,
}
