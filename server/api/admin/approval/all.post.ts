type LogPayload = {
  id: string;
  total_hours: number;
  overtime: number;
}

export default defineEventHandler(async (event) => {
  const { logs } = await readBody(event);

  if (!Array.isArray(logs) || logs.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body must contain a non-empty "logs" array.',
    });
  }

  try {
    await db.transaction().execute(async (trx) => {
      for (const log of logs as LogPayload[]) {
        if (!log.id || typeof log.total_hours !== 'number' || typeof log.overtime !== 'number') {
          throw new Error('Invalid log object found in payload.');
        }

        await trx
          .updateTable('time_logs')
          .set({
            status: true,                   // Set status to approved
            total_hours: log.total_hours,   // USE THE CALCULATED VALUE
            overtime: log.overtime,         // USE THE CALCULATED VALUE
          })
          .where('id', '=', log.id)
          .execute();
      }
    });

    console.log(`Bulk approval successful. Approved ${logs.length} logs.`);
    return {
      success: true,
      message: `Successfully approved ${logs.length} logs.`,
      approvedCount: logs.length,
    };

  } catch (e: any) {
    console.error('Error during bulk approval:', e.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while approving all logs.',
    });
  }
});