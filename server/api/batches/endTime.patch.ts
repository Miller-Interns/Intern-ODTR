import { db } from '~/server/db/index';
import { sql } from 'kysely';
import { z } from 'zod';

const BodySchema = z.object({
    id:z.string(),
  end_date: z.string()
});

export default defineEventHandler(async (event) => {
  
  const body = await readBody(event);
  const validation = BodySchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.issues,
    });
  }

  const { id, end_date } = validation.data;

  try {

    await db
      .updateTable('batches')
      .set({ 
        end_date: end_date,
        status: 'COMPLETED'
       })
      .where('batches.id', '=', id)
      .execute();

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
        
        .select(['intern_counts.intern_count',
          'users.name as supervisor_name'
        ])
        .orderBy('batches.batch_number', 'desc')
        .execute();
  

      const batchesWithCount = allBatches.map((batch) => ({
        ...batch,
        intern_count: batch.intern_count || 0,
      }));
  
      return batchesWithCount;
  
    } catch (e: any) {
      console.error('API Error in endTime.patch.ts:', e);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update batches in the database.',
      });
    }
});