import { db } from '../db'
import type { RequestContext } from '../types/RequestContext'
import type { InternQueryRow } from '~/server/types/InternQueryRow'

async function getInternDetailsById(id: string, ctx: RequestContext): Promise<InternQueryRow | null> {
	const qb = ctx.trx ?? db

	const intern = await qb
		.selectFrom('interns as i')
		.innerJoin('users as u', 'u.id', 'i.user_id')
		.innerJoin('batches as b', 'b.id', 'i.batch_id')
		.where('i.id', '=', id)
		.selectAll('i')
		.select(['u.name', 'u.email', 'b.batch_number'])
		.executeTakeFirst()
	return intern ?? null
}

async function updateCompletedHours(id: string, newCompletedHours: number, ctx: RequestContext) {
	const qb = (ctx.trx ??= db)
	return qb.updateTable('interns').set({ hours_completed: newCompletedHours }).where('id', '=', id).executeTakeFirst()
}

export const internService = {
	getInternDetailsById,
	updateCompletedHours,
}
