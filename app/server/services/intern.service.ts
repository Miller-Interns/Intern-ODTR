import { sql, type Kysely } from 'kysely';
import type { DB, Batch } from '../db/types';
import type { InternQueryRow } from '../../interfaces/interns';
import type { Selectable } from 'kysely';

export async function getActiveBatch(db: Kysely<DB>): Promise<Selectable<Batch> | undefined> {
    return await db
        .selectFrom('batches')
        .selectAll()
        .where('status', '=', true)
        .executeTakeFirst();
}

export async function getInternsByBatchId(db: Kysely<DB>, batchId: string): Promise<InternQueryRow[]> {
    return await db
        .selectFrom('interns as i')
        .innerJoin('users as u', 'u.id', 'i.user_id')
        .where('i.batch_id', '=', batchId)
        .selectAll('i')
        .select(['u.name', 'u.email'])
        .select(
            sql<number>`CAST(COALESCE((SELECT SUM(total_hours) FROM time_logs WHERE intern_id = i.id AND status = true), 0) AS INTEGER)`.as('completed_hours')
        )
        .orderBy('u.name', 'asc')
        .execute();
}