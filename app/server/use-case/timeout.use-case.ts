import z from 'zod'
import { checkAuthentication } from '../utils/check-authentication'
import { createSchemaValidator } from '../utils/create-schema-validator'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'
import { db } from '../db'

// The DTO now expects 'intern_notes', which is optional.
const dtoSchema = z.object({
  timeLogId: z.string().uuid(),
  intern_notes: z.string().optional(),
})
const validateDTO = createSchemaValidator(dtoSchema)
export type TimeoutDTO = z.infer<typeof dtoSchema>

export const timeOutUseCase = async (dto: TimeoutDTO, context: RequestContext) => {
	const userId = await checkAuthentication(context)
	// Use the new field name from the DTO
	const { timeLogId, intern_notes } = await validateDTO(dto)

	const intern = await userService.getInternByUserId(userId, context)
	if (!intern) {
		throw createError({ status: 404, message: 'Intern profile not found.' })
	}

	const qb = (context.trx ??= db)
	const timeLog = await qb
		.selectFrom('time_logs')
		.selectAll()
		.where('id', '=', timeLogId)
		.where('intern_id', '=', intern.id) // Security check: user can only time out their own log
		.executeTakeFirst()

	if (!timeLog) {
		throw createError({ status: 404, message: 'Active time log not found or access denied.' })
	}

	// Check if the log is already completed. This is the correct logic for a nullable field.
	if (timeLog.time_out !== null) {
		throw createError({ status: 400, message: 'This log has already been timed out.' })
	}

	// Calculate the duration between the original time_in and now.
	const timeIn = new Date(String(timeLog.time_in))
	const timeOut = new Date()
	const totalMilliseconds = timeOut.getTime() - timeIn.getTime()
	const totalHours = totalMilliseconds / (1000 * 60 * 60)

	// Call the service to perform the database update with the correct field name.
	const updatedLog = await timeLogService.timeOut(
		timeLogId,
		{ intern_notes, total_hours: totalHours },
		context,
	)

	// Note: We no longer update the intern's 'hours_completed' here.
	// That value is now calculated dynamically when the dashboard loads.

	return { updatedLog }
}