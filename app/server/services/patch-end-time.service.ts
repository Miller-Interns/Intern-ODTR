import { db } from '~/server/db/index';
import { type MarkAsCompletedData } from '~/types/Types';
async function updateCompletionStatus( data: MarkAsCompletedData){
  const result = await db
    .updateTable('batches')
    .set({
      end_date: data.end_date,
      status: 'COMPLETED'
    })
    .where('batches.id', '=', data.id)
    .executeTakeFirst();
    
  return result;
}

export const BatchService = {
  updateCompletionStatus
};