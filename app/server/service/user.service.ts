import type { RequestContext } from '~/server/types/RequestContext'
import { db } from '../db' // We only need to import the Kysely 'db' instance
import type { User, Intern } from '../db/types'
import type { Selectable, Updateable } from 'kysely'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

// All the GET functions remain unchanged and are correct.
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
    return intern ?? null;
}

async function getFullInternProfileByUserId(userId: string, ctx: RequestContext) {
  const qb = (ctx.trx ??= db);
  return await qb.selectFrom('interns').innerJoin('users', 'users.id', 'interns.user_id').selectAll('interns').select(['users.email', 'users.name']).where('interns.user_id', '=', userId).executeTakeFirst();
}

// FIX: This function now uses a Kysely transaction, removing the need for the raw Prisma client.
async function updateUserProfile(userId: string, data: any) {
    const { name, email, password, ...internData } = data;

    // Use the Kysely 'db' instance to create a transaction.
    return await db.transaction().execute(async (trx) => {
        // 1. Update the 'users' table using the transaction object 'trx'
        const userUpdatePayload: any = { name, email };
        if (password && password.length > 0) {
            userUpdatePayload.password = await bcrypt.hash(password, SALT_ROUNDS);
        }
        await trx
            .updateTable('users')
            .set(userUpdatePayload)
            .where('id', '=', userId)
            .execute();

        // 2. Update the 'interns' table using the same transaction object 'trx'
        await trx
            .updateTable('interns')
            .set(internData)
            .where('user_id', '=', userId)
            .execute();
    });
}

export const userService = {
	getUserById,
	getUserByEmail,
    getInternByUserId,
    getFullInternProfileByUserId,
    updateUserProfile,
};