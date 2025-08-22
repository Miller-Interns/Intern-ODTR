
import {Status} from '~/enums/status'
import {db} from '~/server/db'
import { randomUUID } from 'node:crypto'
import { type Batch } from '~/types/Types'
import type { RequestContext } from '~/server/types/RequestContext'
import { Selectable } from 'kysely'

async function createBatch(batch_number: string, start_date: Date, 
  status: Status, supervisorId: string,  ctx: RequestContext): Promise<Selectable<Batch> | undefined>{
  const qb = (ctx.trx ??= db)
    const existingBatch = await qb
    .selectFrom('batches')
    .select('id') 
    .where('batch_number', '=', batch_number)
    .executeTakeFirst();

  
  if (existingBatch) {
  throw new Error('BATCH_CONFLICT');
  }
  const allBatches= await qb.insertInto('batches')
          .values({
					id: randomUUID(),
          batch_number: batch_number,
          start_date: start_date,
          status: status ,
          supervisorId: supervisorId
				})
           .returningAll()
          .executeTakeFirst();

        return allBatches as Batch | undefined

}

export const BatchService={
  createBatch
}