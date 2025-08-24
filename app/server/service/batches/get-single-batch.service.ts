import { db } from '~/server/db';
import type { RequestContext } from '~/server/types/RequestContext'
import { type Selectable } from 'kysely';
import {type Batch} from '~/types/Types'

async function findById(id: string, ctx: RequestContext):
 Promise<Selectable<Batch> | null> {
  const qb = (ctx.trx ??= db)

  const batch = await qb
    .selectFrom('batches')
    .leftJoin('users', 'users.id', 'batches.supervisorId')
    .where('batches.id', '=', id)
    .selectAll('batches')
    .select('users.name as supervisor_name')
    .executeTakeFirst()

  return (batch as Batch) ?? null
 }

export const BatchService = {
  findById,
}