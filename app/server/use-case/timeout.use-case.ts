// app/server/use-case/timeout.use-case.ts

import z from 'zod'
import { checkAuthentication } from '../utils/check-authentication'
import { createSchemaValidator } from '../utils/create-schema-validator'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'
import { db } from '../db' // Import db for direct use

const dtoSchema = z.object({
  timeLogId: z.string().uuid(),
  remarks: z.string().optional(),
})
const validateDTO = createSchemaValidator(dtoSchema)
export type TimeoutDTO = z.infer<typeof dtoSchema>

export const timeOutUseCase = async (dto: TimeoutDTO, context: RequestContext) => {
  // FIX: Get the userId string directly
  const userId = await checkAuthentication(context)
  const { timeLogId, remarks } = await validateDTO(dto)

  // FIX: Call the exported service method correctly
  const intern = await userService.getInternByUserId(userId, context)
  if (!intern) {
    throw createError({ status: 404, message: 'Intern profile not found.' })
  }

  const timeLog = await (context.trx ??= db)
    .selectFrom('time_logs')
    .selectAll()
    .where('id', '=', timeLogId)
    .where('intern_id', '=', intern.id)
    .executeTakeFirst()

  if (!timeLog) {
    throw createError({ status: 404, message: 'Active time log not found or access denied.' })
  }
  if (timeLog.time_out) {
      throw createError({ status: 400, message: 'This log has already been timed out.' })
  }

  const timeIn = new Date(String(timeLog.time_in))
  const timeOut = new Date()
  const totalMilliseconds = timeOut.getTime() - timeIn.getTime()
  const totalHours = totalMilliseconds / (1000 * 60 * 60)

  const updatedLog = await timeLogService.timeOut(
    timeLogId,
    { remarks, total_hours: totalHours },
    context,
  )

  return { updatedLog }
}