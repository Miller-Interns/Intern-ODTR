
// import { db } from '~/server/db/index';


// export default defineEventHandler(async (event) => {
//   try {
    

//     const allBatches = await db
//       .selectFrom('batches')
//       .selectAll()
//       .orderBy('batch_number', 'desc')
//       .execute();

//     return allBatches;

//   } catch (e: any) {
//     console.error('API Error:', e);
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Failed to fetch batches from the database.',
//     });
//   }
// });

// server/api/batches/batch.get.ts (or your file name)
import { db} from '~/server/db/index'; // <-- Import Kysely instance and sql helper
import { sql } from 'kysely'; 

export default defineEventHandler(async (event) => {
  try {
    const allBatches = await db
      .selectFrom('batches')
      .selectAll('batches') // Select all columns from the 'batches' table
      // Here we create and join our subquery
       .leftJoin('users', 'users.id', 'batches.supervisorId')
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
      .select(['intern_counts.intern_count' ,
        'users.name as supervisor_name'])
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