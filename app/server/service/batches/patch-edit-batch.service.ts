import { db } from '~/server/db';
import type { RequestContext } from '~/server/types/RequestContext'
import { type Selectable } from 'kysely';
import {Status} from '~/enum/enums'
import {type Batch} from '~/types/Types'

async function  editBatchDetails(id: string, batch_number: string, start_date: Date, 
  status: Status, supervisorId: string,  ctx: RequestContext):  Promise<Selectable<Batch> | undefined> {
  const qb = (ctx.trx ??= db)
    const existingBatch = await qb
    .selectFrom('batches')
    .select('id') 
    .where('batch_number', '=', batch_number)
     .where('id', '!=', id)
    .executeTakeFirst();

  
  if (existingBatch) {
  throw new Error('BATCH_CONFLICT');
  }

    
const allBatches=   await db
      .updateTable('batches')
      .set({ 
        batch_number:batch_number,
        start_date:start_date,
        status: status,
        supervisorId: supervisorId
       })
      .where('batches.id', '=', id)
      .returningAll()
          .executeTakeFirst();
           return allBatches as Batch | undefined
  
    }
    
 
export const BatchService = {
  editBatchDetails
};