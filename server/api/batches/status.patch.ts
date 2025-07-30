


import { db } from '~/server/db/index';
import { type Batch } from '@prisma/client';


export default defineEventHandler(async (event): Promise<Batch[]> => {
  try {
   
 const updatedBatches = await db
      .updateTable('batches')
      .set({ status: 'ONGOING' })
      .where((eb) =>
        eb.and([
          eb('status', '=', 'INCOMING'),
          eb('start_date', '<=', new Date()),
        ])
      )
      .returningAll() 
      .execute();

    console.log(`Server: Atomically updated ${updatedBatches.length} batch(es).`);

    const allBatches = await db
      .selectFrom('batches')
      .selectAll()
      .orderBy('batch_number', 'desc')
      .execute();

    console.log(`Server: Returning the complete list of ${allBatches.length} batches.`);
    return allBatches;

  } catch (error) {
    console.error('Error updating batch statuses:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update batch statuses in the database.',
    });
  }
});