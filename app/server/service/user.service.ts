import type { RequestContext } from '~/server/types/RequestContext'
import { db } from '../db' // We only need the Kysely db instance
import type { User, Intern } from '../db/types'
import type { Selectable, Updateable } from 'kysely'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

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

async function getInternByUserId(userId: string, ctx: RequestContext): Promise<Selectable<Intern> | null> {
	const qb = (ctx.trx ??= db)
	const intern = await qb.selectFrom('interns').selectAll().where('user_id', '=', userId).executeTakeFirst()
	return intern ?? null
}

async function getFullInternProfileByUserId(userId: string, ctx: RequestContext) {
	const qb = (ctx.trx ??= db)
	return await qb
		.selectFrom('interns')
		.innerJoin('users', 'users.id', 'interns.user_id')
		.selectAll('interns')
		.select(['users.email', 'users.name'])
		.where('interns.user_id', '=', userId)
		.executeTakeFirst()
}

async function updateUserProfile(userId: string, data: any) {
	const { first_name, middle_name, last_name, email, password, ...internData } = data

	const middleInitial = middle_name ? `${middle_name.charAt(0).toUpperCase()}.` : null
	const fullName = [first_name, middleInitial, last_name].filter(Boolean).join(' ')

	return await db.transaction().execute(async (trx) => {
		const userUpdatePayload: any = { name: fullName, email }
		if (password && password.length > 0) {
			userUpdatePayload.password = await bcrypt.hash(password, SALT_ROUNDS)
		}
		await trx.updateTable('users').set(userUpdatePayload).where('id', '=', userId).execute()
		const internUpdatePayload = {
			...internData,
			first_name,
			middle_name,
			last_name,
		}
		await trx.updateTable('interns').set(internUpdatePayload).where('user_id', '=', userId).execute()
	})
}

async function updateInternPicture(userId: string, picturePath: string, ctx: RequestContext) {
	const qb = (ctx.trx ??= db)
	return await qb.updateTable('interns').set({ intern_picture: picturePath }).where('user_id', '=', userId).execute()
}

export const userService = {
	getUserById,
	getUserByEmail,
	getInternByUserId,
	getFullInternProfileByUserId,
	updateUserProfile,
	updateInternPicture,
}
