import { sql } from 'kysely';
import type { Selectable } from 'kysely';
import type { RawTimeLog, InternDetailsResponse, InternWithDetails, InternDetailQueryResult } from '../../types/composites.js';
import type { TimeLog } from '~/server/db/types'

export default defineEventHandler(async (event): Promise<InternDetailsResponse> => {
  const internId = event.context.params?.id;

  if (!internId) {
    throw createError({ statusCode: 400, statusMessage: 'Intern ID is required.' });
  }

  try {
    const db = event.context.db;
    const internResult: InternDetailQueryResult = await db
      .selectFrom('interns as i')
      .innerJoin('users as u', 'u.id', 'i.user_id')
      .innerJoin('batches as b', 'b.id', 'i.batch_id')
      .where('i.id', '=', internId)
      .selectAll('i')
      .select(['u.name', 'u.email', 'b.batch_number'])
      .select(
        sql<number>`(
          SELECT COALESCE(SUM(tl.total_hours), 0)
          FROM time_logs as tl
          WHERE tl.intern_id = i.id AND tl.status = true
        )`.as('completed_hours')
      )
      .executeTakeFirstOrThrow();

    const { name, email, batch_number, completed_hours, ...internBase } = internResult;
    const completedHours = Number(completed_hours) || 0;
    const remainingHours = internBase.required_hours - completedHours;

    const intern: InternWithDetails = {
      ...internBase,
      user: { name, email },
      batch: { batch_number },
      completed_hours: completedHours,
      remaining_hours: remainingHours,
    };

    const timeLogsResult: Selectable<TimeLog>[] = await db
      .selectFrom('time_logs')
      .where('intern_id', '=', internId)
      .orderBy('time_in', 'desc')
      .selectAll()
      .execute();

    const timeLogs: RawTimeLog[] = timeLogsResult.map(log => ({
      ...log,
      time_in: log.time_in.toISOString(),
      time_out: log.time_out ? log.time_out.toISOString() : null,
      admin_id: log.admin_id || null
    }));

    return {
      intern,
      timeLogs,
    };

  } catch (error: any) {
    console.error(`API Error fetching details for intern ${internId}:`, error);
    if (error.name === 'NoResultError') {
      throw createError({ statusCode: 404, statusMessage: 'Intern not found.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'An internal server error occurred.' });
  }
});