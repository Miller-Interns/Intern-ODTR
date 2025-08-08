import type { Kysely, Transaction } from 'kysely';
import type { DB } from '~/server/db/types';

export function calculateWorkHours(timeIn: Date, timeOut: Date | null): { totalHours: number; overtimeHours: number } {
    const STANDARD_WORK_HOURS = 8;
    const BREAK_HOURS = 1;

    if (!timeOut || isNaN(timeIn.getTime()) || isNaN(timeOut.getTime())) {
        return { totalHours: 0, overtimeHours: 0 };
    }

    const grossDurationHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);
    const netWorkHours = Math.max(0, grossDurationHours - BREAK_HOURS);
    const calculatedOvertime = Math.max(0, netWorkHours - STANDARD_WORK_HOURS);

    return { totalHours: netWorkHours, overtimeHours: calculatedOvertime };
}

export async function approveLog(
    dbOrTrx: Kysely<DB> | Transaction<DB>,
    logId: string,
    remarks: string | null,
    adminId: string
) {
    const originalLog = await dbOrTrx
        .selectFrom('time_logs')
        .select(['time_in', 'time_out', 'remarks'])
        .where('id', '=', logId)
        .executeTakeFirstOrThrow();

    const { totalHours, overtimeHours } = calculateWorkHours(
        originalLog.time_in,
        originalLog.time_out
    );

    return dbOrTrx
        .updateTable('time_logs')
        .set({
            status: true,
            remarks: remarks ?? originalLog.remarks,

            total_hours: totalHours,
            overtime: overtimeHours,
            admin_id: adminId,
        })
        .where('id', '=', logId)
        .executeTakeFirst();
}