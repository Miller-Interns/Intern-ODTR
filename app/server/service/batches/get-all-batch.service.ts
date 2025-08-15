
import { db } from '~/server/db'; 
import {sql } from 'kysely';
import type { BatchWithInternCount } from '~/types/Types'
// import type { RequestContext } from '~/server/types/RequestContext'
import {Status} from '~/enums/status'
// import type { GetAllBatchesDTO } from '~/server/use-case/batches/get-batch.use-case';

// async function getAllBatchesWithDetails( id: string, batch_number: string, start_date: Date, 
//     end_date: Date, status: Status, intern_count: number,
//   supervisorId: string, supervisor_name: string, ctx: RequestContext): Promise<BatchWithInternCount[] | null>{
//   const qb = (ctx.trx ??= db)
//   try {
//     const allBatches = await qb
//       .selectFrom('batches')
//       .selectAll('batches')
//       .leftJoin('users', 'users.id', 'batches.supervisorId')
//       .leftJoin(
//         (eb) =>
//           eb
//             .selectFrom('interns')
//             .select([
//               'interns.batch_id',
//               sql<number>`count("interns".id)::int`.as('intern_count'),
//             ])
//             .groupBy('interns.batch_id')
//             .as('intern_counts'),
//         (join) => join.onRef('intern_counts.batch_id', '=', 'batches.id')
//       )
//       .select(['intern_counts.intern_count', 'users.name as supervisor_name'])
//       .orderBy('batches.batch_number', 'desc')
//       .execute();

    
//     const batchesWithCount = allBatches.map((batch) => ({
//       ...batch,
//       intern_count: batch.intern_count || 0,
//       status: batch.status as Status,
//     }));

//     return batchesWithCount;
//   } catch (error) {
//     console.error('Batch Service Error:', error);
   
//     throw error;
//   }
// }

// export const BatchService = {
//   getAllBatchesWithDetails
// };
// FILE: server/service/batches/get-all-batch.service.ts

// ... imports

// The function no longer needs all the dto parameters
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