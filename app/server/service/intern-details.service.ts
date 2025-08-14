import { sql, type Kysely } from 'kysely'
import type { DB, TimeLog } from '../db/types'
import type { InternQueryRow } from '../../types/InternDetails'
import type { Selectable } from 'kysely'

export async function getInternDetailsById(db: Kysely<DB>, internId: string): Promise<InternQueryRow | undefined> {
	return await db
		.selectFrom('interns as i')
		.innerJoin('users as u', 'u.id', 'i.user_id')
		.innerJoin('batches as b', 'b.id', 'i.batch_id')
		.where('i.id', '=', internId)
		.selectAll('i')
		.select(['u.name', 'u.email', 'b.batch_number'])
		.select((eb) => [
			eb
				.selectFrom('time_logs as tl')
				.select(sql<number>`COALESCE(SUM(tl.total_hours), 0)`.as('total'))
				.where('tl.intern_id', '=', internId)
				.where('tl.status', '=', true)
				.as('completed_hours'),
		])
		.executeTakeFirst()
}

export async function getTimeLogsByInternId(db: Kysely<DB>, internId: string): Promise<Selectable<TimeLog>[]> {
	return await db.selectFrom('time_logs').where('intern_id', '=', internId).orderBy('time_in', 'desc').selectAll().execute()
}
