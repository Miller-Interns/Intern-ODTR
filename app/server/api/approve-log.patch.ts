import type { DB } from '../db/types';
import type { Updateable } from 'kysely';

export default defineEventHandler(async (event) => {
  const db = event.context.db;
  const body = await readBody(event);
  const { logId, remarks, status, total_hours, overtime } = body;

  if (!logId) {
    throw createError({ statusCode: 400, statusMessage: 'A log ID is required.' });
  }

  const dataToUpdate: Updateable<DB['time_logs']> = {};

  if (typeof remarks === 'string') {
    dataToUpdate.remarks = remarks;
  }

  if (status === true) {
    dataToUpdate.status = true;

    if (typeof total_hours !== 'number' || typeof overtime !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'When approving a log, total_hours and overtime are required.',
      });
    }
    dataToUpdate.total_hours = Math.round(total_hours);
    dataToUpdate.overtime = Math.round(overtime);
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields were provided for update.' });
  }

  try {
    const result = await db
      .updateTable('time_logs')
      .set(dataToUpdate)
      .where('id', '=', logId)
      .executeTakeFirst();

    if (result.numUpdatedRows === 0n) {
      throw createError({ statusCode: 404, statusMessage: `Log with ID ${logId} not found.` });
    }

    return { success: true, message: 'Log updated successfully.' };

  } catch (e: any) {
    if (!e.statusCode) {
      console.error('Error updating log:', e.message);
      throw createError({ statusCode: 500, statusMessage: 'Failed to update the log in the database.' });
    }
    throw e;
  }
});

