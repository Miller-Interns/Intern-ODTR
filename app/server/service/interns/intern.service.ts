import { db } from '~/server/db'
import type { User, Intern, Batch} from '~/server/db/types.d'
import type { Updateable, Insertable, Transaction } from 'kysely'
import type { DB } from '~/server/db/types'


export type InternWithUserAndBatchStatus = Intern & User & { batch_status: Batch['status'] } & { user_id_from_users?: string };

type CreateInternAndUserPayload = {
  userData: Insertable<User>,
  internData: Omit<Insertable<Intern>, 'user_id'>
}

async function createInternAndUser(payload: CreateInternAndUserPayload): Promise<Intern> {
  const { userData, internData } = payload;
  
  const result = await db.transaction().execute(async (trx) => {
    await trx
      .insertInto('users')
      .values(userData)
      .execute();

    const newIntern = await trx
      .insertInto('interns')
      .values({
        ...internData,
        user_id: userData.id as string,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
      
    return newIntern;
  });

  return result as unknown as Intern;
}

async function findInternWithUserById(internId: string, trx?: Transaction<DB>): Promise<InternWithUserAndBatchStatus> {
  const dbOrTrx = trx || db;
  const intern = await dbOrTrx
    .selectFrom('interns')
    .innerJoin('users', 'users.id', 'interns.user_id')
    .innerJoin('batches', 'batches.id', 'interns.batch_id') 
    .selectAll('interns')
    .select([
      'users.id as user_id_from_users',
      'users.name',
      'users.email',
      'users.isAdmin',
      'users.createdAt',
      'users.updatedAt',
      'batches.status as batch_status'
    ])
    .where('interns.id', '=', internId)
    .executeTakeFirst()

  if (!intern) {
    throw createError({ statusCode: 404, statusMessage: 'Intern not found.' })
  }
  return intern as unknown as InternWithUserAndBatchStatus;
}


async function updateInternStatus(internId: string, status: 'INCOMING' | 'ONGOING' | 'COMPLETED') {
  return db.updateTable('interns').set({ status }).where('id', '=', internId).returningAll().executeTakeFirstOrThrow()
}

async function updateInternPicture(internId: string, picturePath: string) {
  return db.updateTable('interns').set({ intern_picture: picturePath }).where('id', '=', internId).returningAll().executeTakeFirstOrThrow()
}

async function updateInternAndUser(payload: { userId: string; internId: string; userData: Updateable<User>; internData: Updateable<Intern> }): Promise<InternWithUserAndBatchStatus> {
  return db.transaction().execute(async (trx) => {
    await trx.updateTable('users').set(payload.userData).where('id', '=', payload.userId).execute()
    await trx.updateTable('interns').set(payload.internData).where('id', '=', payload.internId).execute()
    const updatedData = await findInternWithUserById(payload.internId, trx);
    return updatedData;
  })
}


export const internService = {
  createInternAndUser,
  findInternWithUserById,
  updateInternStatus,
  updateInternPicture,
  updateInternAndUser,
}