// app/server/use-case/get-current-timelog.use-case.ts

import { checkAuthentication } from '../utils/check-authentication'
import { timeLogService } from '../service/timelog.service'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'
import { db } from '../db'
import type { DB } from '../db/types'
import type { ExpressionBuilder } from 'kysely'

export const getCurrentTimeLogUseCase = async (context: RequestContext) => {
  const userId = await checkAuthentication(context)

  const intern = await userService.getInternByUserId(userId, context)
  if (!intern) {
    throw createError({ status: 404, message: 'Intern profile not found.' })
  }

  const activeTimeLog = await timeLogService.getActiveTimeLogByInternId(intern.id, context)
  const requiredHours = intern.required_hours

  const qb = (context.trx ??= db)
  const renderedHoursData = await qb
    .selectFrom('time_logs')
    .select((eb: ExpressionBuilder<DB, 'time_logs'>) => eb.fn.sum<number>('total_hours').as('total'))
    .where('intern_id', '=', intern.id)
    .where('status', '=', true)
    .executeTakeFirst()

  const renderedHours = Number(renderedHoursData?.total || 0)

  return { activeTimeLog, requiredHours, renderedHours }
}