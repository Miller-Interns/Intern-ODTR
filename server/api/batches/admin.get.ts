import { db } from '~/server/db/index'; 





export default defineEventHandler(async (event) => {


  try{
    const adminUsers = await db
      .selectFrom('users')
      .select(['id', 'name'])
      .where('isAdmin', '=', true) 
      .execute();
      
    return adminUsers;

 
  } catch (error) {

    console.error('Error fetching admin users:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch data. Please try again later.',
    });
  }
});