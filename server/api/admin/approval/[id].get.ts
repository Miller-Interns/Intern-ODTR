import { sql } from 'kysely';

import type { InternWithDetails, TimeLogForUI } from '../../../../app/types/composites.ts';

type InternDetailsResponse = {
  intern: InternWithDetails;
  timeLogs: TimeLogForUI[];
};

export default defineEventHandler(async (event): Promise<InternDetailsResponse> => {
  const internId = event.context.params?.id;

  if (!internId) {
    throw createError({ statusCode: 400, statusMessage: 'Intern ID is required.' });
  }

  try {
    const internResult = await db
      .selectFrom('interns as i')
      .innerJoin('users as u', 'u.id', 'i.user_id')
      .where('i.id', '=', internId)
      .selectAll('i')
      .select(['u.name', 'u.email' /*, 'u.avatar' */])
      .select(
        sql<number>`(
          SELECT COALESCE(SUM(total_hours), 0)
          FROM time_logs
          WHERE intern_id = i.id AND status = true
        )`.as('completed_hours')
      )
      .executeTakeFirstOrThrow();

    const { name, email, completed_hours, ...internBase } = internResult;
    const intern: InternWithDetails = {
      ...internBase,
      user: { name, email /*, avatar */ },
      completed_hours: Number(completed_hours) || 0,
    };

    const timeLogsResult = await db
      .selectFrom('time_logs as tl')
      .innerJoin('interns as i', 'i.id', 'tl.intern_id')
      .innerJoin('users as u', 'u.id', 'i.user_id')
      .where('tl.intern_id', '=', internId)
      .orderBy('tl.time_in', 'desc')
      .select([
        'tl.id', 'tl.intern_id', 'tl.time_in', 'tl.time_out', 'tl.overtime',
        'tl.total_hours', 'tl.remarks', 'tl.status', 'tl.admin_id',
        'u.name'
      ])
      .execute();

    const timeLogs: TimeLogForUI[] = timeLogsResult.map(log => {
      const { name, ...restOfLog } = log;
      return {
        ...restOfLog,
        intern: {
          id: log.intern_id,
          name: name,
        },
        time_in: log.time_in.toISOString(),
        time_out: log.time_out ? log.time_out.toISOString() : null,
      };
    });

    return {
      intern,
      timeLogs: timeLogs,
    };

  } catch (error: any) {
    console.error(`API Error fetching details for intern ${internId}:`, error);
    if (error.name === 'NoResultError') {
      throw createError({ statusCode: 404, statusMessage: 'Intern not found.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'An internal server error occurred.' });
  }
});