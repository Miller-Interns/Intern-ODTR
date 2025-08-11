import { z } from 'zod';
import type { Transaction } from 'kysely';
import type { DB } from '~/server/db/types';
import { useApproveSingleLog } from '~/server/use-cases/useApproveSingleLog'; 

const approveLogSchema = z.object({
    logId: z.string().min(1, 'Log ID cannot be empty.'),
    admin_remarks: z.string().nullable().optional(),
});

const bulkApproveSchema = z.object({
    logs: z.array(approveLogSchema).min(1, 'At least one log is required.'),
});

export default defineEventHandler(async (event) => {
    try {
        // const adminId = event.context.user.id;
        const adminId = '015084bc-bec3-4373-aec3-729fba0a825a'; //temporary

        const body = await readBody(event);
        const validation = bulkApproveSchema.safeParse(body);

        if (!validation.success) {
            const firstIssue = validation.error.issues[0];
            const errorMessage = firstIssue ? `${firstIssue.path.join('.')} - ${firstIssue.message}` : 'Invalid request body.';
            throw createError({
                statusCode: 400,
                statusMessage: errorMessage,
            });
        }

        const { logs } = validation.data;

    
        await event.context.db.transaction().execute(async (trx: Transaction<DB>) => {
            for (const log of logs) {
                await useApproveSingleLog(trx, log.logId, log.admin_remarks || null, adminId);
            }
        });

        return {
            success: true,
            message: `Successfully approved ${logs.length} logs.`,
        };

    } catch (error: any) {
        if (error.statusCode) {
            throw error;
        }

        console.error('Error in bulk-approve API:', error.message);
        throw createError({
            statusCode: 500,
            statusMessage: 'An internal server error occurred during bulk approval.',
        });
    }
});