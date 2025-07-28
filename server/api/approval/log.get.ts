import { defineEventHandler, setResponseStatus } from 'h3';
import { db } from '../../utils/db' 

function calculateTotalHours(startTime: Date, endTime: Date | null): number | null {
  if (!endTime) return null; // Can't calculate if there's no end time
  const start = startTime.getTime();
  const end = endTime.getTime();
  const diffMilliseconds = Math.abs(end - start);
  return diffMilliseconds / (1000 * 60 * 60); // returns hours
}

function calculateOvertimeHours(
  totalHours: number | null,
  standardWorkdayHours: number = 8
): number | null {
  if (totalHours === null) return null; // Can't calculate overtime without total hours
  const overtime = totalHours > standardWorkdayHours ? totalHours - standardWorkdayHours : 0;
  return overtime;
}

export default defineEventHandler(async (event) => {
  try {
    const pendingLogsFromDb = await db
      .selectFrom('time_logs')
      .innerJoin('interns', 'interns.id', 'time_logs.intern_id')
      .innerJoin('users', 'users.id', 'interns.user_id')
      .where('time_logs.status', '=', false)
      .selectAll('time_logs')
      .select(['users.name as intern_name'])
      .orderBy('time_logs.time_in', 'asc')
      .execute();

    const formattedLogs = pendingLogsFromDb.map((log) => {
const total_hours = calculateTotalHours(log.time_in, log.time_out);
      const overtime = calculateOvertimeHours(total_hours);
      return {
        ...log, 
        intern: {
          id: log.intern_id,
          name: log.intern_name ?? 'Unnamed Intern',
        },
         total_hours,
        overtime,
        // Ensure date fields are strings, as the UI expects
        time_in: log.time_in.toISOString(),
 time_out: log.time_out ? log.time_out.toISOString() : null,      };
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