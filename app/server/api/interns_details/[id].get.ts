import { getInternDetailsUseCase } from '~/server/use-cases/useGetInternDetails';

export default defineEventHandler(async (event) => {
  const internId = getRouterParam(event, 'id') as string;

  try {
    const internDetails = await getInternDetailsUseCase(internId);
    
    return internDetails;

  } catch (error: any) {
    console.error(`Failed to get details for intern ${internId}:`, error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Could not fetch intern details.',
    });
  }
});