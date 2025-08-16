
import { getAdminUsersUseCase } from '~/server/use-case/batches/get-admin.use-case';
import { RequestContext } from '~/server/types/RequestContext'
import { adminFactory } from '~/server/factory/batches/get-admin.factory';

export default defineEventHandler(async (event) => {
 const query = getQuery(event);


  const dto = {
    isAdmin: query.isAdmin === 'true' 
  };


  try {
    const {adminUsers} = await getAdminUsersUseCase(dto, event.context as RequestContext)
    return adminFactory.toAdminResponse(adminUsers);

  } catch (error: any) {  
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch data. Please try again later.',
    });
  }
});