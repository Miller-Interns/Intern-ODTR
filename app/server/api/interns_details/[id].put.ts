import { updateInternDetailsUseCase } from '~/server/use-cases/useUpdateInternDetails';

export default defineEventHandler(async (event) => {
  const internId = getRouterParam(event, 'id') as string;

  try {
    const body = await readBody(event);
    
    const result = await updateInternDetailsUseCase(internId, body);

    return result;

  } catch (error: any) {
    console.error(`Failed to update intern details for ${internId}:`, error);
    
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'An account with this email already exists.',
      });
    }

    if (error.code === 'P2025') {
       throw createError({
        statusCode: 404,
        statusMessage: 'The user or intern to update was not found.',
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Could not update intern details.',
    });
  }
});