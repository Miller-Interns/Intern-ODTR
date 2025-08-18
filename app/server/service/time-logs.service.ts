import { db } from '../db'
import type { Selectable } from 'kysely';
import type { TimeLog } from '../db/types'
import type { RequestContext } from '~/server/types/RequestContext';
import type { RawPendingLogQueryResult } from '~/server/types/RawPendingLogQueryResult';

async function fetchPendingWithInternDetails(
	startDate: Date,
	endDate: Date,
	ctx: RequestContext,
): Promise<RawPendingLogQueryResult[]> {
	const qb = ctx.trx ?? db;

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

	const log = await qb
		.selectFrom('time_logs')
		.where('id', '=', id)
		.selectAll()
		.executeTakeFirst()
	return log ?? null
}

async function getTimeLogsByInternId(
	internId: string,
	ctx: RequestContext
): Promise<Selectable<TimeLog>[]> {
	const qb = ctx.trx ?? db;

	const logs = await qb
		.selectFrom('time_logs')
		.where('intern_id', '=', internId)
		.selectAll()
		.execute();

	return logs;
}

export const timeLogService = {
	fetchPendingWithInternDetails,
	approveLog,
	// formatToDashboardLogs,
	getTimeLogsByInternId,
	getLogById,
};



// function formatToInternLogs(rawLogs: RawPendingLogQueryResult[]): InternLog[] {
// 	return rawLogs.map((log) => {
// 		return {
// 			id: log.id,
// 			intern_id: log.intern_id,
// 			admin_id: log.admin_id ?? '',
// 			status: log.status,
// 			admin_remarks: log.admin_remarks ?? null,
// 			intern_notes: log.intern_notes ?? null,
// 			time_in: log.time_in.toISOString(),
// 			time_out: log.time_out ? log.time_out.toISOString() : null,
// 			total_hours: log.total_hours,
// 			intern: {
// 				id: log.intern_id,
// 				name: log.intern_name ?? 'Unnamed Intern',
// 				role: log.intern_role ?? 'No Role Assigned',
// 				intern_picture: log.intern_picture ?? null,
// 			},
// 		}
// 	})
// }

