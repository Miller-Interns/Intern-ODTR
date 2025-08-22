
import { db } from '~/server/db'; 
import {sql } from 'kysely';
import type { BatchWithInternCount } from '~/types/Types'
import {Status} from '~/enums/status'

async function getAllBatchesWithDetails(): Promise<BatchWithInternCount[] | null> {

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
      .select(['intern_counts.intern_count', 'users.name as supervisor_name'])
      .orderBy('batches.batch_number', 'desc')
      .execute();

    
    const batchesWithCount = allBatches.map((batch) => ({
      ...batch,
      intern_count: batch.intern_count || 0,
      status: batch.status as Status,
    }));

    return batchesWithCount;
  } catch (error) {
    console.error('Batch Service Error:', error);
   
    throw error;
  }
}

export const BatchService = {
  getAllBatchesWithDetails
}