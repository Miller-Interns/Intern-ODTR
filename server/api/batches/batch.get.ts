import { prisma } from '~/server/db/db';


export default defineEventHandler(async (event) => {
  try {

    const allBatches = await prisma.batch.findMany({
      orderBy: {
        batch_number: 'desc',
      },
    });

    return allBatches;

  } catch (e: any) {
  
    console.error('API Error:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch batches from the database.',
   
    });
  }
});