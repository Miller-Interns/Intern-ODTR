import { sql} from 'kysely';
import type { ActiveInternsApiResponse, InternWithDetails } from '../../../../app/types/composites.ts';
import type { Batch } from '../../../../app/server/db/types';
import type { Selectable } from 'kysely';

export default defineEventHandler(async (_event): 
Promise<ActiveInternsApiResponse> => {
  try {
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

    const internsData = await db
      .selectFrom('interns as i')
      .innerJoin('users as u', 'u.id', 'i.user_id')
      .where('i.batch_id', '=', activeBatch.id)
      .selectAll('i') // Select all columns from the 'interns' table
      .select(['u.name', 'u.email'])

      .select(
        sql<number>`(
          SELECT COALESCE(SUM(total_hours), 0)
          FROM time_logs
          WHERE intern_id = i.id AND status = true
        )`.as('completed_hours')
      )
      .orderBy('u.name', 'asc')
      .execute();

       const interns: InternWithDetails[] = internsData.map(row => {
 const { name, email, completed_hours, ...internBase } = row;
        return {
          ...internBase,
          user: {
            name,
            email,
            // avatar: null, // Placeholder for future avatar column
          },
          completed_hours:  Number(completed_hours) || 0, 
      };
    });

    return {
      batch: activeBatch,
      interns: interns,
    };

   } catch (error: any) {
    // 5. Handle potential errors
    console.error('API Error fetching active interns:', error);

    // Re-throw a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred while fetching data.',
    });
  }
});