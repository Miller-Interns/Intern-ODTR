import { sql, type Kysely } from 'kysely';
import type { DB, Batch } from '../db/types';
import type { InternQueryRow, ActiveInternRow } from '../../interfaces/interns';
import type { Selectable } from 'kysely';

export async function getActiveBatch(db: Kysely<DB>): Promise<Selectable<Batch> | undefined> {
    return await db
        .selectFrom('batches')
        .selectAll()
        .where('status', '=', 'ONGOING')
        .executeTakeFirst();
}

export async function getInternsByBatchId(db: Kysely<DB>, batchId: string): Promise<ActiveInternRow[]> {
    return await db
        .selectFrom('interns as i')
        .innerJoin('users as u', 'u.id', 'i.user_id')
        .innerJoin('batches as b', 'b.id', 'i.batch_id')
        .leftJoin('time_logs as tl', (join) =>
            join
                .onRef('tl.intern_id', '=', 'i.id')
                .on('tl.status', '=', true)
        )
        .where('i.batch_id', '=', batchId)
        .select([
            'i.id',
            'i.user_id',
            'i.batch_id',
            'i.required_hours',
            'i.intern_picture',
            'i.status',
            'u.name',
            'u.email',
            'b.batch_number',
        ])
        .select(
            sql<number>`COALESCE(SUM(tl.total_hours), 0)`.as('completed_hours')
        )
        .groupBy([
            'i.id',
            'u.id',
            'b.id', 
        ])
        .orderBy('u.name', 'asc')
        .execute();
}