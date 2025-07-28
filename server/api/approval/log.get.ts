import { defineEventHandler, setResponseStatus } from 'h3';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const pendingLogsFromDb = await db
      .selectFrom('time_logs')
      .innerJoin('interns', 'interns.id', 'time_logs.intern_id')
      .innerJoin('users', 'users.id', 'interns.user_id')
      .where('time_logs.status', '=', false)
      .select([
        'time_logs.id',
        'time_logs.time_in',
        'time_logs.time_out',
        'time_logs.remarks',
        'time_logs.status',
        'time_logs.intern_id',
        'time_logs.admin_id',
        'time_logs.total_hours', // Send the raw value (likely null or 0)
        'time_logs.overtime',    // Send the raw value (likely null or 0)
        'users.name as intern_name',
      ])
      .orderBy('time_logs.time_in', 'asc')
      .execute();

    const formattedLogs = pendingLogsFromDb.map((log) => {
     return {
       id: log.id,
        intern_id: log.intern_id,
        admin_id: log.admin_id,
        status: log.status,
        remarks: log.remarks,

        total_hours: log.total_hours,
        overtime: log.overtime,

        time_in: log.time_in.toISOString(),
        time_out: log.time_out ? log.time_out.toISOString() : null,

        intern: {
        id: log.intern_id,
        name: log.intern_name ?? 'Unnamed Intern', // Provide a fallback for safety
        },
      };
    });

    return formattedLogs;

  } catch (error: any) {
    console.error('API Error fetching pending logs:', error);
    setResponseStatus(event, 500);
    return {
      message: 'Failed to fetch pending logs.',
    };
  }
});