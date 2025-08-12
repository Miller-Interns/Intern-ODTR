// app/server/service/user.service.ts

import type { RequestContext } from '~/server/types/RequestContext'
import { db } from '../db'
import type { User, Intern } from '../db/types' // Import Intern type
import type { Selectable } from 'kysely'

async function getUserById(id: string, ctx: RequestContext): Promise<Selectable<User> | null> {
	const qb = (ctx.trx ??= db)
	// Use the mapped table name 'users'
	const user = await qb.selectFrom('users').where('id', '=', id).selectAll().executeTakeFirst()
	return user ?? null
}

async function getUserByEmail(email: string, ctx: RequestContext): Promise<Selectable<User> | null> {
	const qb = (ctx.trx ??= db)
	// Use the mapped table name 'users'
	const user = await qb.selectFrom('users').where('email', '=', email).selectAll().executeTakeFirst()
	return user ?? null
}

async function getInternByUserId(userId: string, ctx: RequestContext): Promise<Selectable<Intern> | null> {
    const qb = (ctx.trx ??= db)
    // FIX: Use the mapped table name 'interns' from schema.prisma
    const intern = await qb
        .selectFrom('interns')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst()
    return intern ?? null;
}

export const userService = {
	getUserById,
	getUserByEmail,
    getInternByUserId, // Export the new function
}