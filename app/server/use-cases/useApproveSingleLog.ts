import type { Kysely } from 'kysely';
import type { DB } from '~/server/db/types';
import { approveLog } from '~/server/services/approve-log.service';

export async function useApproveSingleLog(
    db: Kysely<DB>,
    logId: string,
    remarks: string | null,
    adminId: string
) {
    await approveLog(db, logId, remarks, adminId);
    return { success: true };
}