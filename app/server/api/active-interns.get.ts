import { sql } from 'kysely';
import type { ActiveInternsApiResponse, InternWithDetails, InternQueryResult } from '../../types/composites.js';
import type { Batch } from '../db/types.js';
import type { Selectable } from 'kysely';

export default defineEventHandler(async (event):
  Promise<ActiveInternsApiResponse> => {
  try {
    const db = event.context.db;
    const activeBatch: Selectable<Batch> | undefined = await db
      .selectFrom('batches')
      .selectAll()
      .where('status', '=', true)
      .executeTakeFirst();

    if (!activeBatch) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No active batch found.',
      });
    }

    const internsData: InternQueryResult[] = await db
      .selectFrom('interns as i')
      .innerJoin('users as u', 'u.id', 'i.user_id')
      .where('i.batch_id', '=', activeBatch.id)
      .selectAll('i')
      .select(['u.name', 'u.email'])

      .select(
        sql<number>`CAST((SELECT COALESCE(SUM(total_hours), 0) FROM time_logs WHERE intern_id = i.id AND status = true) AS INTEGER)`.as('completed_hours')
      )
      .orderBy('u.name', 'asc')
      .execute();

    const interns: InternWithDetails[] = internsData.map((row) => {
      const { name, email, completed_hours, ...internBase } = row;

      const completed = parseFloat(completed_hours as any) || 0;
      const required = parseFloat(internBase.required_hours as any) || 0;
      const remaining_hours = required - completed;

      return {
        ...internBase,
        user: {
          name,
          email,
        },
        batch: {
          batch_number: activeBatch.batch_number,
        },
        completed_hours: completed,
        remaining_hours,
      };
    });


    return {
      batch: activeBatch,
      interns: interns,
    };

  } catch (error: any) {
    if (error.statusCode === 404) {
      throw error;
    }

    console.error('API Error fetching active interns:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred while fetching data.',
    });
  }
});
