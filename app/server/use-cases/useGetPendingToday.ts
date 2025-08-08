import type { Kysely } from 'kysely';
import type { DB } from '~/server/db/types';
import type { TimeLogEntry } from '~/interfaces/time-logs';
import { fetchPendingLogsFromDb, formatDbLogsToTimeEntries } from '~/server/services/log.service';

export async function useGetPendingToday(db: Kysely<DB>): Promise<TimeLogEntry[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const rawLogs = await fetchPendingLogsFromDb(db, today, tomorrow);
    const formattedLogs = formatDbLogsToTimeEntries(rawLogs);
    return formattedLogs;
}