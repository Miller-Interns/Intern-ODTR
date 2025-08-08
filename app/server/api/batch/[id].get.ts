import { getBatchDetailsUseCase } from '~/server/use-cases/useGetBatch';

export default defineEventHandler(async (event) => {
  const batchId = getRouterParam(event, 'id') as string;

  try {
    const batchDetails = await getBatchDetailsUseCase(batchId);
    
    return batchDetails;

  } catch (error: any) {
    console.error('Failed to fetch batch details:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Could not fetch batch details.',
    });
  }
});