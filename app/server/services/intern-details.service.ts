import { sql, type Kysely } from 'kysely';
import type { DB } from '../db/types';
import type { InternQueryRow } from '../../interfaces/interns';
import type { TimeLogEntry } from '../../interfaces/time-logs';

export async function getInternDetailsById(
    db: Kysely<DB>,
    internId: string
): Promise<InternQueryRow | undefined> {
    return await db
        .selectFrom('interns as i')
        .innerJoin('users as u', 'u.id', 'i.user_id')
        .innerJoin('batches as b', 'b.id', 'i.batch_id')
        .where('i.id', '=', internId)
        .selectAll('i')
        .select(['u.name', 'u.email', 'b.batch_number'])
        .select(
            sql<number>`(
                SELECT COALESCE(SUM(tl.total_hours), 0)
                FROM time_logs as tl
                WHERE tl.intern_id = i.id AND tl.status = true
            )`.as('completed_hours')
        )
        .executeTakeFirst();
}

export async function getTimeLogsByInternId(
    db: Kysely<DB>,
    internId: string
): Promise<TimeLogEntry[]> {
    const logs = await db
        .selectFrom('time_logs')
        .where('intern_id', '=', internId)
        .orderBy('time_in', 'desc')
        .selectAll()
        .execute();

    return logs.map(log => ({
        id: log.id,
        intern_id: log.intern_id,
        admin_id: log.admin_id ?? null,
        status: log.status,
        remarks: log.remarks,
        time_in: log.time_in instanceof Date ? log.time_in.toISOString() : String(log.time_in),
        time_out: log.time_out ? log.time_out.toISOString() : null,
        total_hours: log.total_hours,
        overtime: log.overtime,
        intern: {
            id: log.intern_id,
            name: null,
            role: '',
            intern_picture: null,
        }
    }));
}
