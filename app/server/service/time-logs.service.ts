import { db } from '../db'
import { sql, type Selectable } from 'kysely'
import type { TimeLog } from '../db/types'
import type { RequestContext } from '~/server/types/RequestContext'
import type { RawPendingLogQueryResult } from '~/server/types/RawPendingLogQueryResult'

async function fetchPendingWithInternDetails(startDate: Date, endDate: Date, ctx: RequestContext): Promise<RawPendingLogQueryResult[]> {
	const qb = ctx.trx ?? db

	return qb
		.selectFrom('time_logs as tl')
		.innerJoin('interns as i', 'i.id', 'tl.intern_id')
		.innerJoin('users as u', 'u.id', 'i.user_id')
		.where('tl.status', '=', false)
		.where('tl.time_in', '>=', startDate)
		.where('tl.time_in', '<', endDate)
		.select([
			'tl.id',
			'tl.intern_id',
			'tl.admin_id',
			'tl.status',
			'tl.admin_remarks',
			'tl.intern_notes',
			'tl.time_in',
			'tl.time_out',
			'tl.total_hours',
			'u.name as intern_name',
			'i.role as intern_role',
			'i.intern_picture',
		])
		.orderBy('tl.time_in', 'desc')
		.execute()
}

async function approveLog(
	logId: string,
	adminId: string,
	updateData: { admin_remarks: string | null; totalHours: number },
	ctx: RequestContext,
) {
	const qb = (ctx.trx ??= db)

	return qb
		.updateTable('time_logs')
		.set({
			status: true,
			admin_remarks: updateData.admin_remarks,
			total_hours: updateData.totalHours,
			admin_id: adminId,
		})
		.where('id', '=', logId)
		.executeTakeFirst()
}

async function getLogById(id: string, ctx: RequestContext): Promise<Selectable<TimeLog> | null> {
	const qb = (ctx.trx ??= db)
	const log = await qb.selectFrom('time_logs').where('id', '=', id).selectAll().executeTakeFirst()
	return log ?? null
}

async function getTimeLogsByInternId(internId: string, ctx: RequestContext): Promise<Selectable<TimeLog>[]> {
	const qb = ctx.trx ?? db
	const logs = await qb.selectFrom('time_logs').where('intern_id', '=', internId).selectAll().execute()
	return logs
}

// async function getFormattedLogsByInternId(internId: string, ctx: RequestContext): Promise<FormattedTimeLog[]> {
// 	const qb = ctx.trx ?? db

// 	const rawLogs = await qb
// 		.selectFrom('time_logs as tl')
// 		.leftJoin('users as u', 'u.id', 'tl.admin_id')
// 		.where('tl.intern_id', '=', internId)
// 		.select(['tl.time_in', 'tl.time_out', 'tl.total_hours', sql<string>`COALESCE(u.name, 'N/A')`.as('approved_by')])
// 		.orderBy('tl.time_in', 'asc')
// 		.execute()

// 	const formattedLogs: FormattedTimeLog[] = rawLogs.map((log: any) => {
// 		const timeInDate = new Date(log.time_in);
// 		const timeOutDate = log.time_out ? new Date(log.time_out) : null;

// 		return {
// 			date: timeInDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }),
// 			timeIn: timeInDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
// 			timeOut: timeOutDate ? timeOutDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
// 			noOfHours: log.total_hours,
// 			approvedBy: log.approved_by,
// 		};
// 	});

// 	return formattedLogs;
// }

async function getLogsByInternIdWithAdmin(internId: string, ctx: RequestContext) {
	const qb = ctx.trx ?? db;
	return qb
		.selectFrom('time_logs as tl')
		.leftJoin('users as u', 'u.id', 'tl.admin_id')
		.where('tl.intern_id', '=', internId)
		.select(['tl.time_in', 'tl.time_out', 'tl.total_hours', sql<string>`COALESCE(u.name, 'N/A')`.as('approved_by')])
		.orderBy('tl.time_in', 'desc')
		.execute();
}

export const timeLogService = {
	fetchPendingWithInternDetails,
	approveLog,
	getTimeLogsByInternId,
	getLogById,
	getLogsByInternIdWithAdmin,
}
