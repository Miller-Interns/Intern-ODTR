import type { RequestContext } from '~/server/types/RequestContext';
import { db } from '../db'
import type { User } from '../db/types'
import type { Selectable } from 'kysely'

async function getUserById(id: string, ctx: RequestContext): Promise<Selectable<User> | null> {
	const qb = (ctx.trx ??= db)

	const user = await qb.selectFrom('users').where('id', '=', id).selectAll().executeTakeFirst()

	return user ?? null
}

async function getUserByEmail(email: string, ctx: RequestContext): Promise<Selectable<User> | null> {
	const qb = (ctx.trx ??= db)

	const user = await qb.selectFrom('users').where('email', '=', email).selectAll().executeTakeFirst()

	return user ?? null
}

export const userService = {
	getUserById,
	getUserByEmail,
}
