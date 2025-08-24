import { db } from '~/server/db';
import type { RequestContext } from '~/server/types/RequestContext'
import {type  Selectable } from 'kysely';
import {type Batch} from '~/types/Types'

async function updateCompletionStatus(id: string, end_date: Date,   ctx: RequestContext):  Promise<Selectable<Batch> | undefined> {
  const qb = (ctx.trx ??= db)
  const allBatches = await db
    .updateTable('batches')
    .set({
      end_date: end_date,
      status: 'COMPLETED'
    })
    .where('batches.id', '=', id)
  .returningAll()
          .executeTakeFirst();
           return allBatches as Batch | undefined
  
    }

export const BatchService = {
  updateCompletionStatus
};