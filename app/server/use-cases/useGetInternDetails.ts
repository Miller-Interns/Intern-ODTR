import type { Kysely } from 'kysely'
import type { DB } from '../db/types'
import type { InternDetailsResponse } from '../../interfaces/api'
import type { TimeLogEntry } from '../../interfaces/time-logs'
import type { InternWithDetails } from '../../interfaces/interns' 
import { getInternDetailsById, getTimeLogsByInternId } from '../services/intern-details.service'
export async function useGetInternDetails(db: Kysely<DB>, internId: string): Promise<InternDetailsResponse> {
	const [internResult, timeLogsResult] = await Promise.all([getInternDetailsById(db, internId), getTimeLogsByInternId(db, internId)])

	if (!internResult) {
		throw new Error('Intern not found.')
	}

	const completedHoursRaw = timeLogsResult
        .filter((log) => log.status === true)
        .reduce((sum, log) => sum + (log.total_hours || 0), 0);

    const completedHours = Math.floor(completedHoursRaw * 100) / 100;
	const { name, email, batch_number, ...internBase } = internResult;
    	const remainingHoursRaw = internBase.required_hours - completedHours;
    const remainingHours = Math.floor(remainingHoursRaw * 100) / 100;

	const intern: InternWithDetails = {
		...internBase,
		user: { name, email },
		batch: { batch_number: batch_number || 'N/A' },
		completed_hours: completedHours,
		remaining_hours: remainingHours,
	}

	const timeLogs: TimeLogEntry[] = timeLogsResult.map((log) => ({
		...log,
        total_hours: Math.floor((log.total_hours || 0) * 100) / 100,
		time_in: log.time_in.toISOString(),
		time_out: log.time_out ? log.time_out.toISOString() : null,
		admin_id: log.admin_id ?? null,

		intern: {
			id: internResult.id,
			name: internResult.name ?? 'Unnamed Intern',
			role: internResult.role,
			intern_picture: internResult.intern_picture ?? null,
		},
	}));

	return {
		intern,
		timeLogs,
	};
}