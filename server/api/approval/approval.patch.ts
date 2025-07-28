import { defineEventHandler, readBody, createError } from 'h3'
import { db   } from '../../../server/utils/db' // Adjust path if needed


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

  // --- Dynamic Query Building ---
  // Create an object to hold only the data we want to update.
  const dataToUpdate: { status?: boolean; remarks?: string } = {}

  // Check if a 'status' was sent in the body (from onLogApproved)
  if (typeof body.status === 'boolean') {
    dataToUpdate.status = body.status
  }

  // Check if 'remarks' were sent in the body (from submitRemark)
  if (typeof body.remarks === 'string') {
    // We allow setting remarks to an empty string, so we don't check for !body.remarks
    dataToUpdate.remarks = body.remarks
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
      .executeTakeFirstOrThrow() // Throws an error if the logId is not found

    return { success: true, message: 'Log updated successfully.' }
  } catch (e: any) {
    console.error('Error updating log:', e.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update the log in the database.',
    })
  }
})