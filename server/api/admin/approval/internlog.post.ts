export default defineEventHandler(async (event) => {
  const { logIds, remarks } = await readBody(event);

  if (!logIds || !Array.isArray(logIds) || logIds.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'An array of log IDs is required.',
    });
  }

  try {
    const result = await db
      .updateTable('time_logs')
      .set({
        status: true,
        remarks: remarks
      })
      .where('id', 'in', logIds)
      .execute();

    const approvedCount = result[0]?.numUpdatedRows ?? 0;

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