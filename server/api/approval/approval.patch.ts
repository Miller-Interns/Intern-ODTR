import { defineEventHandler, readBody, createError } from 'h3'
import { db, type DB   } from '../../../server/utils/db' // Adjust path if needed

function calculateTotalHours(startTime: Date, endTime: Date | null): number | null {
  if (!endTime) return null; // Return null if there's no end time
  const diffMilliseconds = Math.abs(endTime.getTime() - startTime.getTime());
  return diffMilliseconds / (1000 * 60 * 60); // returns hours
}

function calculateOvertimeHours(
  totalHours: number | null,
  standardWorkdayHours: number = 8
): number | null {
  if (totalHours === null) return null; // Can't calculate without total hours
  const overtime = totalHours > standardWorkdayHours ? totalHours - standardWorkdayHours : 0;
  return overtime;
}

export default defineEventHandler(async (event) => {
  // Read the data sent from the onLogApproved or submitRemark functions
  const body = await readBody(event)

  // --- Input Validation ---
  if (!body.logId) {
    throw createError({
      statusCode: 400, // Bad Request
      statusMessage: 'A log ID is required to perform an update.',
    })
  }

   const logToUpdate = await db
    .selectFrom('time_logs')
    .where('id', '=', body.logId)
    .select(['time_in', 'time_out'])
    .executeTakeFirst();

    if (!logToUpdate) {
    throw createError({
      statusCode: 404, // Not Found
      statusMessage: `Log with ID ${body.logId} was not found.`,
    })
  }
  
 const dataToUpdate: Partial<DB['time_logs']> = {}

  // If 'remarks' were sent, add them to the update object.
  // This can happen with or without an approval.
  if (typeof body.remarks === 'string') {
    dataToUpdate.remarks = body.remarks
  }

  // This block only runs when the frontend sends `status: true`.
  if (body.status === true) {
    // 1. Set the status to true for the update
    dataToUpdate.status = true;

    // 2. Calculate hours and overtime using the data we fetched
    const totalHours = calculateTotalHours(logToUpdate.time_in, logToUpdate.time_out);
    const overtime = calculateOvertimeHours(totalHours);

    // 3. Add the calculated values to our update object
    dataToUpdate.total_hours = totalHours;
    dataToUpdate.overtime = overtime;
  }

   // If after checking, there's nothing to update, it's an error.
  if (Object.keys(dataToUpdate).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid fields (status or remarks) were provided for update.',
    })
  }

  // --- Database Operation ---
  try {
   

    // Use Kysely to update the 'time_logs' table.
    // The `set` method takes our dynamically built object.
    await db
      .updateTable('time_logs')
      .set(dataToUpdate)
      .where('id', '=', body.logId)
      .execute();

    return { success: true, message: 'Log updated successfully.' }
  } catch (e: any) {
    console.error('Error updating log:', e.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update the log in the database.',
    })
  }
})