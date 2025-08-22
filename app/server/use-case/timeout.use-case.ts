import z from 'zod'
import { checkAuthentication } from '../utils/check-authentication'
import { createSchemaValidator } from '../utils/create-schema-validator'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import { createTimeoutResponse } from '../response/timeout.response' // Import the new formatter
import type { RequestContext } from '../types/RequestContext'

const dtoSchema = z.object({
	timeLogId: z.string().uuid(),
	intern_notes: z.string().optional(),
})
const validateDTO = createSchemaValidator(dtoSchema)
export type TimeoutDTO = z.infer<typeof dtoSchema>
export const timeOutUseCase = async (dto: TimeoutDTO, context: RequestContext) => {
	const userId = await checkAuthentication(context)
	const { timeLogId, intern_notes } = await validateDTO(dto)
	const intern = await userService.getInternByUserId(userId, context)
	if (!intern) {
		throw createError({ status: 404, message: 'Intern profile not found.' })
	}

	const timeLogToUpdate = await timeLogService.findActiveLogByIdAndInternId(timeLogId, intern.id, context)

	if (!timeLogToUpdate) {
		throw createError({ status: 404, message: 'Active time log not found or it has already been timed out.' })
	}

	const timeIn = new Date(String(timeLogToUpdate.time_in))
	const timeOut = new Date()
	const totalMilliseconds = timeOut.getTime() - timeIn.getTime()
	const totalHours = totalMilliseconds / (1000 * 60 * 60)
	const updatedLog = await timeLogService.timeOut(timeLogId, { intern_notes, total_hours: totalHours }, context)

	if (!updatedLog) {
		throw createError({ status: 500, message: 'Failed to update the time log.' })
	}

	return createTimeoutResponse(updatedLog)
}
