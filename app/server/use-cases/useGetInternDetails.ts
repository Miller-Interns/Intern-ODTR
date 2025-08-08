import type { Kysely } from 'kysely';
import type { DB } from '../db/types';
import type { InternDetailsResponse } from '../../interfaces/api';
import type { TimeLogEntry } from '../../interfaces/time-logs';
import type { InternWithDetails } from '../../interfaces/interns';
import { getInternDetailsById, getTimeLogsByInternId } from '../services/intern-details.service';

export async function useGetInternDetails(db: Kysely<DB>, internId: string): Promise<InternDetailsResponse> {
    const internResult = await getInternDetailsById(db, internId);

    if (!internResult) {
        throw new Error('Intern not found.');
    }

    const { name, email, batch_number, completed_hours, ...internBase } = internResult;
    const completedHours = Number(completed_hours) || 0;
    const remainingHours = internBase.required_hours - completedHours;

    const intern: InternWithDetails = {
        ...internBase,
        user: { name, email },
        batch: { batch_number: batch_number || 'N/A' },
        completed_hours: completedHours,
        remaining_hours: remainingHours,
    };

    const timeLogsResult = await getTimeLogsByInternId(db, internId);

    const timeLogs: TimeLogEntry[] = timeLogsResult.map(log => ({
        ...log,
        time_in: log.time_in.toString(),
        time_out: log.time_out ? log.time_out.toString() : null,
        admin_id: log.admin_id || null,
        intern: {
            id: intern.id,
            name: intern.user.name,
            role: intern.role,
            intern_picture: intern.intern_picture,
        }
    }));

    return {
        intern,
        timeLogs,
    };
}