

import { updateStatusUseCase } from '~/server/use-case/batches/patch-auto-status.use-case';

export default defineEventHandler(async (event) => {
  try {
   
    const autoUpdateStatus = await updateStatusUseCase();
    return autoUpdateStatus;
    
  } catch (e: any) {

    console.error('API Error:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch batches from the database.',
    });
  }
});