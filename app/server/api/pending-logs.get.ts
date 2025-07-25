import { db } from '../utils/db' // Adjust path if needed

export default defineEventHandler(async () => {
  try {
    const logs = await db
      // 1. Start with the main table we want data from.
      .selectFrom('time_logs')

      // 2. Join with the 'interns' table to connect the log to an intern profile.
      .innerJoin('interns', 'interns.id', 'time_logs.intern_id')

      // 3. Join with the 'users' table to get the name associated with that intern.
      .innerJoin('users', 'users.id', 'interns.user_id')

      // 4. Filter to get only the logs that are pending approval.
      .where('time_logs.status', '=', false)

      // 5. Select the specific columns we need for the UI.
      .select([
        'time_logs.id',
        'time_logs.intern_id',
        'time_logs.time_in',
        'time_logs.time_out',
        'time_logs.remarks',
        'time_logs.status',
        'time_logs.admin_id',
        'time_logs.total_hours',
        'users.id as intern_user_id', // Select the user ID for the intern
        'users.name as intern_name',   // Select the name from the 'users' table and give it an alias.
      ])
      .execute()

    // 6. Reshape the data to match the TimeLogForUI type your component expects.
    const formattedLogs = logs.map((log) => {
      return {
        ...log,
        intern: {
          id: log.intern_user_id, // The ID from the users table
          name: log.intern_name || 'Unnamed Intern', // Use the name from the join, with a fallback.
        },
      }
    })

    return formattedLogs
  } catch (e: any) {
    console.error(e) // Log the actual error on the server for debugging.
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch pending logs.',
    })
  }
})