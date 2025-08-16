
// import { prisma } from '~/server/db/db';
// import { z } from 'zod';
// import { Status } from "@prisma/client";

// export const BatchCreateInputSchema = z.object({
//   batch_number: z.string().trim(),
//   start_date: z.string(),
//   status: z.enum([Status.INCOMING, Status.ONGOING]),
//   supervisorId: z.string()
// });


// export type BatchCreateInput = z.infer<typeof BatchCreateInputSchema>;

// async function createBatch(data: BatchCreateInput) {
//   const existingBatch = await prisma.batch.findFirst({
//     where: { batch_number: data.batch_number },
//   });

//   if (existingBatch) {
//     throw new Error('BATCH_CONFLICT');
      
//   }

//   try {
//    return await prisma.batch.create({
//       data: {
//         batch_number: data.batch_number,
//         start_date: new Date(data.start_date),
//         status: data.status,
//         supervisorId: data.supervisorId,
//       },

//       select: {
//         id: true,
//         batch_number: true,
//         start_date: true,
//         status: true,
//         intern_supervisor: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     });
    

    
//   } catch (error) {
//     console.error('Error in batchService.createBatch:', error);
//     throw new Error('Failed to create batch in database.');
//   };
  
// };
// export const BatchService = {
//   createBatch
// };
import {Status} from '~/enums/status'
import {db} from '~/server/db'
import { randomUUID } from 'node:crypto'
import { type Batch } from '~/types/Types'
import type { RequestContext } from '~/server/types/RequestContext'
import { Selectable } from 'kysely'

async function createBatch(batch_number: string, start_date: Date, 
  status: Status, supervisorId: string,  ctx: RequestContext): Promise<Selectable<Batch> | undefined>{
  const qb = (ctx.trx ??= db)
    const existingBatch = await qb
    .selectFrom('batches')
    .select('id') 
    .where('batch_number', '=', batch_number)
    .executeTakeFirst();

  
  if (existingBatch) {
  throw new Error('BATCH_CONFLICT');
  }
  const allBatches= await qb.insertInto('batches')
          .values({
					id: randomUUID(),
          batch_number: batch_number,
          start_date: start_date,
          status: status ,
          supervisorId: supervisorId
				})
           .returningAll()
          .executeTakeFirst();

        return allBatches as Batch | undefined

}

export const BatchService={
  createBatch
}