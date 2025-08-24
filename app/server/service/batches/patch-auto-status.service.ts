import { db } from '~/server/db';
import type { RequestContext } from '~/server/types/RequestContext';
import {type  Selectable } from 'kysely';
import {type Batch} from '~/types/Types'

async function updateIncomingStatus( ctx: RequestContext):  Promise<Selectable<Batch> | undefined> {
  const qb = (ctx.trx ??= db)
  const allBatches = await qb
    .updateTable('batches')
    .set({ status: 'ONGOING' })
    .where((eb) =>
      eb.and([
        eb('status', '=', 'INCOMING'),
        eb('start_date', '<=', new Date()),
      ])
    )
  .returningAll()
          .executeTakeFirst();
           return allBatches as Batch | undefined
  
    }

export const BatchService = {
  updateIncomingStatus
};