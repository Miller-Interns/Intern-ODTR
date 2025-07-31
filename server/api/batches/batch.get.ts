
import { db} from '~/server/db/index'; 
import { sql } from 'kysely'; 

export default defineEventHandler(async (event) => {
  try {
    const allBatches = await db
      .selectFrom('batches')
      .selectAll('batches')
       .leftJoin('users', 'users.id', 'batches.supervisorId')
      .leftJoin(
        (eb) =>
          eb
            .selectFrom('interns') 
            .select([
              'interns.batch_id', 
              sql<number>`count("interns".id)::int`.as('intern_count'),
            ])
            .groupBy('interns.batch_id') 
            .as('intern_counts'),
        (join) => join.onRef('intern_counts.batch_id', '=', 'batches.id')
      )

      .select(['intern_counts.intern_count' ,
        'users.name as supervisor_name'])
      .orderBy('batches.batch_number', 'desc')
      .execute();

    const batchesWithCount = allBatches.map((batch) => ({
      ...batch,
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