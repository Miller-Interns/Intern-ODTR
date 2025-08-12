import type { Kysely } from 'kysely'
import type { DB } from '~/server/db/types'
import type { RawPendingLogQueryResult, TimeLogEntry } from '~/interfaces/time-logs'

export async function fetchPendingLogsFromDb(db: Kysely<DB>, startDate: Date, endDate: Date): Promise<RawPendingLogQueryResult[]> {
	const flatResults = await db
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
		.execute();

	return flatResults.map((log) => {
		const { intern_name, intern_role, intern_picture, ...restOfLog } = log;

		return {
			...restOfLog,
			intern: {
				id: log.intern_id,
				name: intern_name ?? 'No Name', 
				role: intern_role ?? 'No Role',
				intern_picture: intern_picture ?? '', 
			},
		};
	});
}

export function formatDbLogsToTimeEntries(logs: RawPendingLogQueryResult[]): TimeLogEntry[] {
	return logs.map((log) => ({
		id: log.id,
		intern_id: log.intern_id,
		admin_id: log.admin_id ?? '',
		status: log.status,
		admin_remarks: log.admin_remarks ?? null,
		intern_notes: log.intern_notes,
		time_in: log.time_in.toISOString(),
		time_out: log.time_out ? log.time_out.toISOString() : null,
		total_hours: log.total_hours,
		intern: {
			id: log.intern_id,
			name: log.intern.name ?? 'Unnamed Intern',
			role: log.intern.role,
			intern_picture: log.intern.intern_picture,
		},
	}))
}
