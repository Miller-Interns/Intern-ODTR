
import { prisma } from '~/server/db/db';
import { z } from 'zod';
import { Status } from "@prisma/client";

export const BatchCreateInputSchema = z.object({
  batch_number: z.string().trim(),
  start_date: z.string(),
  status: z.enum([Status.INCOMING, Status.ONGOING]),
  supervisorId: z.string()
});


export type BatchCreateInput = z.infer<typeof BatchCreateInputSchema>;

async function createBatch(data: BatchCreateInput) {
  const existingBatch = await prisma.batch.findFirst({
    where: { batch_number: data.batch_number },
  });

  if (existingBatch) {
    throw new Error('BATCH_CONFLICT');
      
  }

  try {
   return await prisma.batch.create({
      data: {
        batch_number: data.batch_number,
        start_date: new Date(data.start_date),
        status: data.status,
        supervisorId: data.supervisorId,
      },

      select: {
        id: true,
        batch_number: true,
        start_date: true,
        status: true,
        intern_supervisor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    

    
  } catch (error) {
    console.error('Error in batchService.createBatch:', error);
    throw new Error('Failed to create batch in database.');
  };
  
};
export const BatchService = {
  createBatch
};
  