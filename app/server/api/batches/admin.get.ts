
import { getAdminUsersUseCase } from '~/server/use-case/batches/get-admin.use-case';


export default defineEventHandler(async (event) => {
  try {
    const adminUsers = await getAdminUsersUseCase()
    return adminUsers;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch data. Please try again later.',
    });
  }
});