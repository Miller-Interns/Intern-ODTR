import { z } from 'zod';
import { useApproveAllLogs } from '~/server/use-cases/useApproveAll';

const approveAllSchema = z.object({
  logIds: z.array(z.string().min(1)).min(1, 'At least one log ID is required.'),
  remarks: z.string().nullable().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const adminId = event.context.auth.userId as string;
    const body = await readBody(event);
    const validation = approveAllSchema.safeParse(body);

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

    const { logIds, remarks } = validation.data;
    const result = await useApproveAllLogs(event.context.db, logIds, remarks || null, adminId);

    return {
      success: true,
      message: `Successfully approved ${result.approvedCount} logs.`,
    }

  } catch (error: any) {
    console.error('Error in approve-all API:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred during bulk approval.',
    });
  }
});