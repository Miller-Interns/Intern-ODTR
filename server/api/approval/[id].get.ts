import { defineEventHandler, createError } from 'h3';
import { db } from '../../../server/utils/db' 
import { sql } from 'kysely';

export default defineEventHandler(async (event) => {
  const internId = event.context.params?.id;

  if (!internId) {
    throw createError({ statusCode: 400, statusMessage: 'Intern ID is required.' });
  }

  try {
    const internDetails = await db
      .selectFrom('interns')
      .innerJoin('users', 'users.id', 'interns.user_id')
      .where('interns.id', '=', internId)
      .select([
        'interns.id',
        'users.name',
        'interns.school',
        'interns.course',
        'interns.year',
        'interns.status',
        'interns.required_hours',
        // 'users.avatar_url' 
      ])
      .executeTakeFirst();

    if (!internDetails) {
      throw createError({ statusCode: 404, statusMessage: 'Intern not found.' });
    }

    const hoursResult = await db
      .selectFrom('time_logs')
      .where('intern_id', '=', internId)
      .where('status', '=', true) 
      .select(sql<number>`SUM(total_hours)`.as('completed_hours'))
      .executeTakeFirst();

    const hoursCompleted = hoursResult?.completed_hours ?? 0;

    const timeLogRecords = await db
      .selectFrom('time_logs')
      .where('intern_id', '=', internId)
      .select(['id', 'time_in', 'time_out', 'total_hours', 'overtime', 'remarks', 'status'])
      .orderBy('time_in', 'desc')
      .execute();
      
    return {
      intern: {
        ...internDetails,
        hoursCompleted: hoursCompleted,
        statusString: internDetails.status ? 'Ongoing' : 'Completed',
        avatar: null, 
        role: 'UI/UX Designer' 
      },
      timeLogs: timeLogRecords.map(log => ({
        ...log,
        status: log.status ? 'approved' : 'pending',
        date: log.time_in
      })),
    };

  } catch (error: any) {
    if (error.statusCode === 404) throw error;

    console.error(`API Error fetching details for intern ${internId}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch intern details.',
    });
  }
});