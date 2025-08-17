import { z } from 'zod'
import { internService } from '~/server/service/interns/intern.service'

export default defineEventHandler(async (event) => {
  const internId = getRouterParams(event).id
  const { status } = await readBody(event)
  const validatedStatus = z.enum(['INCOMING', 'ONGOING', 'COMPLETED']).parse(status)
  return internService.updateInternStatus(internId, validatedStatus)
})