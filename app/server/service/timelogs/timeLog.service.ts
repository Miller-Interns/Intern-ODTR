import { db } from '~/server/db'
import type { TimeLog } from '~/server/db/types.d'

export type TimeLogWithInternDetails = TimeLog & {
	intern_name: string | null
	intern_role: string | null
	intern_picture: string | null
}

async function findTimeLogsByInternId(internId: string): Promise<TimeLogWithInternDetails[]> {
	const logs = await db
		.selectFrom('time_logs')
		.innerJoin('interns', 'interns.id', 'time_logs.intern_id')
		.innerJoin('users', 'users.id', 'interns.user_id')
		.where('time_logs.intern_id', '=', internId)
		.orderBy('time_logs.time_in', 'desc')
		.selectAll('time_logs')
		.select([
			'users.name as intern_name',
			'interns.role as intern_role',
			'interns.intern_picture as intern_picture',
		])
		.execute()

	return logs as unknown as TimeLogWithInternDetails[]
}

export const timeLogService = {
	findTimeLogsByInternId,
}