// server/api/user.get.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // The server middleware has already run and should have set event.context.user
  const userContext = event.context.user;

  console.log('[API /user] User context received from middleware:', userContext);

  // If there's no user in the context, the middleware failed or found no token.
  if (!userContext) {
    console.error('[API /user] Aborting. No user context available.');
    // Send a specific error message back to the client.
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No valid session found by middleware.',
    });
  }

  // Use the userId from the token to fetch the full user details from the DB.
  try {
    const user = await prisma.user.findUnique({
      where: { id: userContext.userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      console.error(`[API /user] Token is valid, but user ID ${userContext.userId} not found in database.`);
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found in database.',
      });
    }

    console.log('[API /user] Successfully found user in DB:', user);
    return user;

  } catch (dbError) {
    console.error('[API /user] Database error:', dbError);
    throw createError({
      statusCode: 500,
      statusMessage: 'A database error occurred.',
    });
  }
});