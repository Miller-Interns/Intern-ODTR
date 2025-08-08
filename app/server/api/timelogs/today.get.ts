import type { TimeLogEntry } from '~/interfaces/time-logs';
import { useGetPendingToday } from '~/server/use-cases/useGetPendingToday';

export default defineEventHandler(async (event): Promise<TimeLogEntry[]> => {

  try {
    const db = event.context.db;
    const logs = await useGetPendingToday(db);
    return logs;

  } catch (error: any) {
    console.error("API Error in GET /api/timelogs/today:", {
      message: error.message,
      stack: error.stack,
    });

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch pending logs.'
    });
  }
});