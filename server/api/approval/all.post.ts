import { defineEventHandler, createError } from 'h3'
import { db } from '../../../server/utils/db' // Adjust path if needed
import { UpdateResult } from 'kysely'

export default defineEventHandler(async (_event) => {
  try {

    // Run a bulk update on the 'time_logs' table
    const results: UpdateResult[] = await db
      .updateTable('time_logs')
      .set({ status: true }) // Approve them
      .where('status', '=', false) // Target only currently pending logs
      .execute()

     const updateResult = results[0]
     if (!updateResult) {
      console.log('No pending logs were found to approve.')
      return {
        success: true,
        message: 'No pending logs to approve.',
        approvedCount: 0,
      }
    }
    // The result from Kysely includes the number of rows affected.
    const updatedCount = Number(updateResult.numUpdatedRows)

    console.log(`Bulk approval successful. Approved ${updatedCount} logs.`)

    return {
      success: true,
      message: `Successfully approved ${updatedCount} logs.`,
      approvedCount: updatedCount,
    }
  } catch (e: any) {
    console.error('Error during bulk approval:', e.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while approving all logs.',
    })
  }
})