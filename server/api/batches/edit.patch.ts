import { db } from '~/server/db/index';
import { z } from 'zod';
import { Status } from "@prisma/client";

const BodySchema = z.object({
    id:z.string(),
  batch_number: z.string().trim(),
  start_date: z.string(),
  status: z.enum([Status.INCOMING, Status.ONGOING]), 
  supervisorId: z.string()
})

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

  const { id, batch_number, start_date, status,supervisorId } = validation.data;

  try {

   await db
      .updateTable('batches')
      .set({ 
        batch_number: batch_number,
        start_date: start_date,
        status: status,
        supervisorId: supervisorId
       })
      .where('batches.id', '=', id)
      .execute();

   
   return { success: true };

  
    } catch (e: any) {
      console.error('API Error in endTime.patch.ts:', e);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update batches in the database.',
      });
    }
});