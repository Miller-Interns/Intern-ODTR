

import { prisma } from '~/server/db/db';
import { z } from 'zod';
import type { BatchApiResponse } from '~/interfaces/batch-response';
import { Status } from "@prisma/client";


const batchInputSchema = z.object({
  batch_number: z.string().trim(),
  start_date: z.string(),
  status: z.enum([Status.INCOMING, Status.ONGOING]), 
  supervisorId: z.string()
})

.superRefine(async (data) => {
  const existingBatch = await prisma.batch.findFirst({
    where: {
      batch_number: data.batch_number,
    },
  });

  if (existingBatch) {
        throw createError({
          statusCode: 409,
          statusMessage: `A batch with the number already exists.`,
        
  })
}
});


export default defineEventHandler(async (event): Promise<BatchApiResponse> => {
  const body = await batchInputSchema.safeParseAsync(await readBody(event));

  if (!body.success) {
    throw createError({
      statusCode: 400, 
      statusMessage: body.error.issues.map(issue => issue.message).join('. '),
    });
  }


  const { batch_number, start_date, status, supervisorId } = body.data;


  const prismaData = {
    batch_number,
    start_date: new Date(start_date), 
    status, 
    supervisorId
  };


  try {
    const newBatch = await prisma.batch.create({ 
      data: prismaData, 
      select: {
        id: true,
        batch_number: true,
        start_date: true,
        status: true,
        intern_supervisor:{
          select:{
            id: true,
            name: true
          }
        }
      }
    });

    const responseBatch = {
      id: newBatch.id,
      batch_number: newBatch.batch_number,
      start_date: newBatch.start_date,
      status: newBatch.status,
      supervisorId: newBatch.intern_supervisor
    };

    return {
      success: true,
      batch: responseBatch,
    };

  } catch (e) {

    
    console.error('Failed to create batch:', e);
    throw createError({
      statusCode: 500, 
      statusMessage: 'An unexpected error occurred on the server.',
    });
  }
});