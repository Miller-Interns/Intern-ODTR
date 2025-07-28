
import { defineEventHandler, createError, setResponseStatus } from 'h3';
import { prisma } from '~/server/db/db';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import type { BatchApiResponse } from '~/interfaces/batch-response';

const batchInputSchema = z.object({
  batch_number: z.string().trim(),
  start_date: z.string()
});


export default defineEventHandler(async (event): Promise<BatchApiResponse> => {
  const body = await readValidatedBody(event, (bodyToValidate) => 
    batchInputSchema.safeParse(bodyToValidate)
  );

  if (!body.success) {
    throw createError({
      statusCode: 400, 
      statusMessage: body.error.issues.map(issue => issue.message).join('. '),
    });
  }
  
  const batchData = {
    batch_number: body.data.batch_number,
    start_date: new Date(body.data.start_date),
  };

  try {
    const newBatch = await prisma.batch.create({ 
      data: batchData,
      select: {
        id: true,
        batch_number: true,
        start_date: true,
      }
    });
    

    setResponseStatus(event, 201); 

    return {
      success: true,
      batch: newBatch,
    };

  } catch (e) {

    if (e instanceof Prisma.PrismaClientKnownRequestError) {

      if (e.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: `A batch with the number "${batchData.batch_number}" already exists.`,
        });
      }
    }
    

    console.error('Failed to create batch:', e);
    throw createError({
      statusCode: 500, 
      statusMessage: 'An unexpected error occurred on the server.',
    });
  }
});