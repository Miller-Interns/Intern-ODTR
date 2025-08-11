import { z } from 'zod';
import { useApproveSingleLog } from '~/server/use-cases/useApproveSingleLog'; 

const approveLogSchema = z.object({
  logId: z.string().min(1, 'Log ID cannot be empty.'),
  remarks: z.string().nullable().optional(),
});

export default defineEventHandler(async (event) => {
  try {

    // if (!event.context.user) {
    //   throw createError({
    //     statusCode: 401, 
    //     statusMessage: 'Authentication is required to perform this action.',
    //   });
    // }

    // const adminId = event.context.user.id; 
    const adminId = '015084bc-bec3-4373-aec3-729fba0a825a';

    const body = await readBody(event);
    const validation = approveLogSchema.safeParse(body);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      if (firstIssue) {
        const errorMessage = `${firstIssue.path.join('.')} - ${firstIssue.message}`;
        throw createError({
          statusCode: 400, 
          statusMessage: errorMessage,
        });
      } else {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid request body.',
        });
      }
    }

    const { logId, remarks } = validation.data;
    await useApproveSingleLog(event.context.db, logId, remarks || null, adminId);
    return { success: true, message: 'Log updated successfully.' };

  } catch (error: any) {
    if (!error.statusCode) {
      console.error('Error in approve-log API:', error.message);
      throw createError({ statusCode: 500, statusMessage: 'An internal server error occurred.' });
    }
    throw error;
  }
});