import { getAllSchoolsUseCase } from '~/server/use-cases/useGetAllSchool';

export default defineEventHandler(async () => {
  try {
    const schoolNames = await getAllSchoolsUseCase();
    
    return schoolNames;

  } catch (error: any) {
    console.error('API Error: Failed to fetch schools:', error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Could not fetch the list of schools.',
    });
  }
});