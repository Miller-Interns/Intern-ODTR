export default defineEventHandler(async (event) => {
  // 1. Read the IDs of the logs to be approved from the request body
  const { logIds } = await readBody(event);

  // 2. Validate the input
  if (!logIds || !Array.isArray(logIds) || logIds.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'An array of log IDs is required.',
    });
  }

  try {
    // 3. Update the database
    // Use an 'UPDATE' query with a 'WHERE IN' clause to update all
    // specified logs in a single, efficient database transaction.
    const result = await db
      .updateTable('time_logs')
      .set({ status: true }) // Set the status to true (approved)
      .where('id', 'in', logIds)
      .execute();

    // The result from Kysely gives us the number of affected rows
    const approvedCount = result[0]?.numUpdatedRows ?? 0;

    // 4. Return a success response
    return { 
      success: true, 
      message: `${approvedCount} log(s) approved successfully.` 
    };

  } catch (error) {
    console.error('API Error approving logs:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred during approval.',
    });
  }
});