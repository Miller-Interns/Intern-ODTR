import type { PendingLogQueryResult, TimeLogEntry } from '~/types/composites';

export default defineEventHandler(async (event): Promise<TimeLogEntry[]> => {

  try {
    const db = event.context.db;
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pendingLogsFromDb: PendingLogQueryResult[] = await db
      .selectFrom('time_logs as tl')
      .innerJoin('interns as i', 'i.id', 'tl.intern_id')
      .innerJoin('users as u', 'u.id', 'i.user_id')
      .where('tl.status', '=', false)
      .where('tl.time_in', '>=', today)
      .where('tl.time_in', '<', tomorrow)
      .select([
        'tl.id', 'tl.intern_id', 'tl.admin_id', 'tl.status', 'tl.remarks',
        'tl.time_in', 'tl.time_out', 'u.name as intern_name', 'i.role as intern_role',
        'i.intern_picture',
        'tl.total_hours',
        'tl.overtime'
      ])
      .orderBy('tl.time_in', 'desc')
      .execute();

    const formattedLogs: TimeLogEntry[] = pendingLogsFromDb.map((log) => {
      return {
        id: log.id,
        intern_id: log.intern_id,
        admin_id: log.admin_id,
        status: log.status,
        remarks: log.remarks,

        time_in: log.time_in.toISOString(),
        time_out: log.time_out ? log.time_out.toISOString() : null,

        total_hours: log.total_hours,
        overtime: log.overtime,

        intern: {
          id: log.intern_id,
          name: log.intern_name ?? 'Unnamed Intern',
          role: log.intern_role,
          intern_picture: log.intern_picture,
        },
      };
    });

    return formattedLogs;

  } catch (error: any) {
    console.error("API Error fetching logs:", {
      message: error.message,
      stack: error.stack,
    });
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch logs.'
    })
  }
});