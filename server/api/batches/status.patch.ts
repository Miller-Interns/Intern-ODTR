


import { db } from '~/server/db/index';
import {sql } from 'kysely'
import { type Batch } from '@prisma/client';
import {type BatchWithInternCount } from '~/interfaces/batch-response'


// export default defineEventHandler(async (event): Promise<Batch[]> => {
//   try {
   
//  const updatedBatches = await db
//       .updateTable('batches')
//       .set({ status: 'ONGOING' })
//       .where((eb) =>
//         eb.and([
//           eb('status', '=', 'INCOMING'),
//           eb('start_date', '<=', new Date()),
//         ])
//       )
//       .returningAll() 
//       .execute();

//     console.log(`Server: Atomically updated ${updatedBatches.length} batch(es).`);

//     const allBatches = await db
//       .selectFrom('batches')
//       .selectAll()
//       .orderBy('batch_number', 'desc')
//       .execute();

//     console.log(`Server: Returning the complete list of ${allBatches.length} batches.`);
//     return allBatches;

//   } catch (error) {
//     console.error('Error updating batch statuses:', error);
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Failed to update batch statuses in the database.',
//     });
//   }
// });


export default defineEventHandler(async (event) => {
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
        .selectAll('batches') // Select all columns from the 'batches' table
        // Here we create and join our subquery
        .leftJoin(
          (eb) =>
            eb
              .selectFrom('interns') // From the Intern table (Prisma model name)
              .select([
                'interns.batch_id', // Select the foreign key to join on
                // Use the count function and cast the result to an integer
                sql<number>`count("interns".id)::int`.as('intern_count'),
              ])
              .groupBy('interns.batch_id') // Group by batch_id to count interns per batch
              .as('intern_counts'), // Give the subquery a temporary name
          (join) => join.onRef('intern_counts.batch_id', '=', 'batches.id') // Join condition
        )
        // Make sure to select the count from our subquery
        .select('intern_counts.intern_count')
        .orderBy('batches.batch_number', 'desc')
        .execute();
  
      // The result will have an `intern_count` property. If a batch has no interns,
      // the count will be `null` due to the LEFT JOIN. We can clean this up.
      const batchesWithCount = allBatches.map((batch) => ({
        ...batch,
        // Coalesce the null count to 0 for a cleaner API response
        intern_count: batch.intern_count || 0,
      }));
  
      return batchesWithCount;
  
    } catch (e: any) {
      console.error('API Error:', e);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch batches from the database.',
      });
    }
  });