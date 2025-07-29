// import { prisma } from '~/server/db/db';


// export default defineEventHandler(async (event) => {
//   try {

//     const allBatches = await prisma.batch.findMany({
//       orderBy: {
//         batch_number: 'desc',
//       },
//     });

//     return allBatches;

//   } catch (e: any) {
  
//     console.error('API Error:', e);
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Failed to fetch batches from the database.',
   
//     });
//   }
// });

// server/api/batches.get.ts
import { db } from '~/server/db/index'; // <-- Import the Kysely instance
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Kysely query to select all columns from the 'batch' table,
    // ordering by 'batch_number' in descending order.
    const allBatches = await db
      .selectFrom('batches')
      .selectAll()
      .orderBy('batch_number', 'desc')
      .execute();

    return allBatches;

  } catch (e: any) {
    console.error('API Error:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch batches from the database.',
    });
  }
});