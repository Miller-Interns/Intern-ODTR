import type { Kysely, Transaction } from 'kysely'
import type { DB } from '~/server/db/types'

export function calculateWorkHours(timeIn: Date, timeOut: Date | null): { totalHours: number } {
	const BREAK_HOURS = 1
	if (!timeOut || isNaN(timeIn.getTime()) || isNaN(timeOut.getTime())) {
		return { totalHours: 0 }
	}

	const grossDurationHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60)
	const netWorkHours = Math.max(0, grossDurationHours - BREAK_HOURS)

	return {
		totalHours: netWorkHours,
	}
}

export async function approveLog(dbOrTrx: Kysely<DB> | Transaction<DB>, logId: string, admin_remarks: string | null, adminId: string) {
	const originalLog = await dbOrTrx
		.selectFrom('time_logs')
		.select(['time_in', 'time_out'])
		.where('id', '=', logId)
		.executeTakeFirstOrThrow() 

	const { totalHours } = calculateWorkHours(new Date(originalLog.time_in), originalLog.time_out ? new Date(originalLog.time_out) : null)

	return dbOrTrx
		.updateTable('time_logs')
		.set({
			status: true,
			admin_remarks,
			total_hours: totalHours,
			admin_id: adminId,
		})
		.where('id', '=', logId)
		.executeTakeFirst()
}