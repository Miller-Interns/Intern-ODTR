import type { Kysely } from 'kysely';
import type { DB } from '../db/types';
import type { InternDetailsResponse } from '../../interfaces/api';
import type { TimeLogEntry } from '../../interfaces/time-logs';
import type { InternWithDetails } from '../../interfaces/interns';
import { getInternDetailsById, getTimeLogsByInternId } from '../services/intern-details.service';

export async function useGetInternDetails(db: Kysely<DB>, internId: string): Promise<InternDetailsResponse> {
    const [internResult, timeLogsResult] = await Promise.all([
        getInternDetailsById(db, internId),
        getTimeLogsByInternId(db, internId),
    ]);

    if (!internResult) {
        throw new Error('Intern not found.');
    }

    const completedHours = timeLogsResult
        .filter(log => log.status === true) 
        .reduce((sum, log) => sum + (log.total_hours || 0), 0); 

    const { name, email, batch_number, ...internBase } = internResult;
    const remainingHours = internBase.required_hours - completedHours;

    const intern: InternWithDetails = {
        ...internBase,
        user: { name, email },
        batch: { batch_number: batch_number || 'N/A' },
        completed_hours: completedHours,
        remaining_hours: remainingHours,
    };

    const timeLogs: TimeLogEntry[] = timeLogsResult.map(log => ({
        ...log,
        time_in: log.time_in.toISOString(),
        time_out: log.time_out ? log.time_out.toISOString() : null,
        admin_id: log.admin_id ?? null,
    }));

    return {
        intern,
        timeLogs,
    };
}