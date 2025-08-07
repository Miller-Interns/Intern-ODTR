import { getAllBatchesUseCase } from '~/server/use-case/use-get-batch';

export default defineEventHandler(async (event) => {
  try {
    const batches = await getAllBatchesUseCase();
    return batches; 
  } catch (e: any) {
    console.error('API Handler Error:', e); 
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch batches from the database.',
      data: {
        message: 'An internal server error occurred while retrieving batches.',
      },
    });
  }
});