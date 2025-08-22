import { getCurrentTimeLogUseCase } from '../../use-case/get-current-timelog.use-case'

export default defineEventHandler(async (event) => {
  return await getCurrentTimeLogUseCase(event.context)
})