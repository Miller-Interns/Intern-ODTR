import { db } from '~/server/db'
import type { User, Intern } from '~/server/db/types'
import type { Updateable } from 'kysely'

export type InternWithUser = Intern & User;

async function findInternWithUserById(internId: string): Promise<InternWithUser> {
  const intern = await db
    .selectFrom('interns')
    .innerJoin('users', 'users.id', 'interns.user_id')
    .selectAll('interns')
    .select([
      'users.id as user_id_from_users',
      'users.name',
      'users.email',
      'users.isAdmin',
      'users.createdAt',
      'users.updatedAt'
    ])
    .where('interns.id', '=', internId)
    .executeTakeFirst()

  if (!intern) {
    throw createError({ statusCode: 404, statusMessage: 'Intern not found.' })
  }

  return intern as unknown as InternWithUser;
}

async function updateInternStatus(internId: string, status: 'INCOMING' | 'ONGOING' | 'COMPLETED') {
  return db
    .updateTable('interns')
    .set({ status })
    .where('id', '=', internId)
    .returningAll()
    .executeTakeFirstOrThrow()
}

async function updateInternPicture(internId: string, picturePath: string) {
  return db
    .updateTable('interns')
    .set({ intern_picture: picturePath })
    .where('id', '=', internId)
    .returningAll()
    .executeTakeFirstOrThrow()
}

async function updateInternAndUser(payload: {
  userId: string,
  internId: string,
  userData: Updateable<User>, 
  internData: Updateable<Intern>
}) {
  return db.transaction().execute(async (trx) => {
    await trx.updateTable('users').set(payload.userData).where('id', '=', payload.userId).execute()
    const updatedIntern = await trx.updateTable('interns').set(payload.internData).where('id', '=', payload.internId).returningAll().executeTakeFirstOrThrow()
    return updatedIntern
  })
}

export const internService = {
  findInternWithUserById,
  updateInternStatus,
  updateInternPicture,
  updateInternAndUser,
}