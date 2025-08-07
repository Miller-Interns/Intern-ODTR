import { db } from '~/server/db/index';
import { prisma } from '~/server/db/db';
import { Status } from "@prisma/client";
import {z} from 'zod'

 export const BatchUpdateSchema = z.object({
  id: z.string(), 
  batch_number: z.string(),
  start_date: z.string(), 
  status: z.enum([Status.INCOMING, Status.ONGOING]),
  supervisorId: z.string()
});
export type BatchUpdateData = z.infer<typeof BatchUpdateSchema>;

async function  editBatchDetails(id: string, data: Omit<BatchUpdateData, 'id'>) {
    const conflictingBatch = await prisma.batch.findFirst({
      where: {
        batch_number: data.batch_number,
        id: {
          not: id,
        },
    }
    });
 if (conflictingBatch) {
      throw new Error('BATCH_CONFLICT');
    }
     try {
    
   await db
      .updateTable('batches')
      .set({ 
        batch_number: data.batch_number,
        start_date: data.start_date,
        status: data.status,
        supervisorId: data.supervisorId
       })
      .where('batches.id', '=', id)
      .execute();
  
    } catch (e: any) {
      console.error('API Error in endTime.patch.ts:', e);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update batches in the database.',
      });
    }
 
};
export const BatchService = {
  editBatchDetails
};